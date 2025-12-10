import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { userModel } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validatePassword, isPasswordSimilarToUserInfo } from '../utils/passwordValidator.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/tokenManager.js';
// Constants
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
};
const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
/**
 * Set httpOnly cookies for tokens
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie('refreshToken', refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};
/**
 * Clear token cookies
 */
const clearTokenCookies = (res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
};
/**
 * Format user data for response (excludes sensitive information)
 */
const formatUserResponse = (user) => ({
    id: user._id,
    email: user.email,
    username: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    emailVerified: user.emailVerified,
});
/**
 * Sanitize phone number - convert empty strings to undefined
 */
const sanitizePhone = (phone) => {
    return phone && phone.trim() !== '' ? phone.trim() : undefined;
};
/**
 * Check if user account is active and not deleted
 */
const validateUserAccount = (user) => {
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (user.status !== 'ACTIVE') {
        throw new ApiError(403, `Account is ${user.status.toLowerCase()}. Please contact support.`);
    }
    if (user.deletedAt) {
        throw new ApiError(403, 'This account has been deleted');
    }
};
export class AuthController {
    /**
     * Register new user
     * POST /api/v1/auth/register
     */
    register = asyncHandler(async (req, res) => {
        const { email, password, username, firstName, lastName, phone } = req.body;
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const formattedErrors = passwordValidation.errors.map((err) => ({ message: err }));
            throw new ApiError(400, 'Password validation failed', formattedErrors);
        }
        // Check if password is similar to user info
        if (isPasswordSimilarToUserInfo(password, { email, firstName, lastName })) {
            throw new ApiError(400, 'Password is too similar to your personal information. Please choose a different password.');
        }
        // Check if user already exists
        const sanitizedPhone = sanitizePhone(phone);
        const normalizedEmail = email.toLowerCase();
        const existingUserQuery = sanitizedPhone
            ? { $or: [{ email: normalizedEmail }, { phone: sanitizedPhone }] }
            : { email: normalizedEmail };
        const existingUser = await userModel.findOne(existingUserQuery);
        if (existingUser) {
            throw new ApiError(409, 'An account with this email or phone already exists');
        }
        // Hash password
        const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
        // Create user
        const user = await userModel.create({
            email: normalizedEmail,
            passwordHash,
            firstName: firstName.trim(),
            lastName: lastName?.trim(),
            displayName: username?.trim() || firstName.trim(),
            phone: sanitizedPhone,
            status: 'ACTIVE', // In production, set to 'PENDING_VERIFICATION'
            emailVerified: false,
        });
        // Verify user was created
        if (!user || !user._id) {
            throw new ApiError(500, 'Failed to create user account');
        }
        // Generate tokens
        const { accessToken, refreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: formatUserResponse(user),
                tokens: { accessToken, refreshToken },
            },
        });
    });
    /**
     * Login user
     * POST /api/v1/auth/login
     */
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }
        // Find user by email (case-insensitive)
        const user = await userModel.findOne({ email: email.toLowerCase() });
        // Always perform bcrypt comparison (even if user doesn't exist) to prevent timing attacks
        const hashToCompare = user?.passwordHash || '$2a$12$dummy.hash.to.prevent.timing.attack';
        const isPasswordValid = await bcrypt.compare(password, hashToCompare);
        if (!user || !isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }
        // Validate account status
        validateUserAccount(user);
        // Update last login timestamp
        user.lastLoginAt = new Date();
        await user.save();
        // Generate tokens
        const { accessToken, refreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: formatUserResponse(user),
                tokens: { accessToken, refreshToken },
            },
        });
    });
    /**
     * Refresh access token
     * POST /api/v1/auth/refresh-token
     */
    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token required');
        }
        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        }
        catch (error) {
            throw new ApiError(401, error instanceof Error ? error.message : 'Invalid refresh token');
        }
        // Get user and validate account
        const user = await userModel.findById(decoded.id).select('email role status');
        if (!user || user.status !== 'ACTIVE') {
            throw new ApiError(401, 'Invalid refresh token');
        }
        // Generate new token pair
        const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set new cookies
        setTokenCookies(res, accessToken, newRefreshToken);
        res.json({
            success: true,
            data: {
                accessToken,
                refreshToken: newRefreshToken,
            },
        });
    });
    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    logout = asyncHandler(async (req, res) => {
        clearTokenCookies(res);
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    });
    /**
     * Get current user profile
     * GET /api/v1/auth/me
     */
    getProfile = asyncHandler(async (req, res) => {
        const user = await userModel.findById(req.user.id).select('-passwordHash');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.json({
            success: true,
            data: user,
        });
    });
    /**
     * Update user profile
     * PUT /api/v1/auth/me
     */
    updateProfile = asyncHandler(async (req, res) => {
        const { firstName, lastName, displayName, phone } = req.body;
        const updateData = {};
        if (firstName)
            updateData.firstName = firstName.trim();
        if (lastName !== undefined)
            updateData.lastName = lastName?.trim();
        if (displayName !== undefined)
            updateData.displayName = displayName.trim();
        if (phone)
            updateData.phone = phone.trim();
        const user = await userModel
            .findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true,
        })
            .select('email firstName lastName displayName phone');
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    });
    /**
     * Change password
     * PUT /api/v1/auth/change-password
     */
    changePassword = asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new ApiError(400, 'Current password and new password are required');
        }
        // Get user with password hash
        const user = await userModel.findById(req.user.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new ApiError(400, 'Current password is incorrect');
        }
        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            const formattedErrors = passwordValidation.errors.map((err) => ({ message: err }));
            throw new ApiError(400, 'New password validation failed', formattedErrors);
        }
        // Check if new password is same as current
        const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new ApiError(400, 'New password must be different from current password');
        }
        // Check if password is similar to user info
        if (isPasswordSimilarToUserInfo(newPassword, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName || undefined,
        })) {
            throw new ApiError(400, 'Password is too similar to your personal information');
        }
        // Hash and update password
        user.passwordHash = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
        await user.save();
        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    });
    /**
     * Forgot password
     * POST /api/v1/auth/forgot-password
     */
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        if (!email) {
            throw new ApiError(400, 'Email is required');
        }
        // Check if user exists (don't reveal if user exists for security)
        await userModel.findOne({ email: email.toLowerCase() });
        res.json({
            success: true,
            message: 'Password reset functionality is currently unavailable. Please contact support for assistance.',
        });
    });
    /**
     * Reset password
     * POST /api/v1/auth/reset-password
     */
    resetPassword = asyncHandler(async (req, res) => {
        const { token, password } = req.body;
        // TODO: Implement password reset with token validation
        // This should verify the reset token, check expiration, and update password
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    });
}
//# sourceMappingURL=auth.controller.js.map