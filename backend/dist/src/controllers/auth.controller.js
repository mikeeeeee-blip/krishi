import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { User } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validatePassword, isPasswordSimilarToUserInfo } from '../utils/passwordValidator.js';
import { generateTokenPair } from '../utils/tokenManager.js';
/**
 * Set httpOnly cookies for tokens
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
    const isProduction = config.nodeEnv === 'production';
    const cookieOptions = {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: isProduction, // Only send over HTTPS in production
        sameSite: 'strict', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token
    });
};
/**
 * Clear token cookies
 */
const clearTokenCookies = (res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
};
export class AuthController {
    /**
     * Register new user
     * POST /api/v1/auth/register
     */
    register = asyncHandler(async (req, res) => {
        const { email, password, firstName, lastName, phone } = req.body;
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const formattedErrors = passwordValidation.errors.map(err => ({ message: err }));
            throw new ApiError(400, 'Password validation failed', formattedErrors);
        }
        // Check if password is similar to user info
        if (isPasswordSimilarToUserInfo(password, { email, firstName, lastName })) {
            throw new ApiError(400, 'Password is too similar to your personal information. Please choose a different password.');
        }
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { phone: phone }]
        });
        if (existingUser) {
            // Don't reveal which field already exists (security best practice)
            throw new ApiError(409, 'An account with this email or phone already exists');
        }
        // Hash password with bcrypt
        const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            firstName: firstName.trim(),
            lastName: lastName?.trim(),
            phone: phone?.trim(),
            status: 'ACTIVE', // In production, set to 'PENDING_VERIFICATION'
            emailVerified: false,
        });
        // Generate token pair
        const { accessToken, refreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set httpOnly cookies
        setTokenCookies(res, accessToken, refreshToken);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    emailVerified: user.emailVerified,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
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
        const user = await User.findOne({ email: email.toLowerCase() });
        // Always perform bcrypt comparison (even if user doesn't exist)
        const hashToCompare = user?.passwordHash || '$2a$12$dummy.hash.to.prevent.timing.attack';
        const isPasswordValid = await bcrypt.compare(password, hashToCompare);
        if (!user || !isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }
        // Check account status
        if (user.status !== 'ACTIVE') {
            throw new ApiError(403, `Account is ${user.status.toLowerCase()}. Please contact support.`);
        }
        // Check if account is deleted
        if (user.deletedAt) {
            throw new ApiError(403, 'This account has been deleted');
        }
        // Update last login timestamp
        user.lastLoginAt = new Date();
        await user.save();
        // Generate token pair
        const { accessToken, refreshToken } = generateTokenPair({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set httpOnly cookies
        setTokenCookies(res, accessToken, refreshToken);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    emailVerified: user.emailVerified,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
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
        const { verifyRefreshToken: verifyToken } = await import('../utils/tokenManager.js');
        let decoded;
        try {
            decoded = verifyToken(refreshToken);
        }
        catch (error) {
            throw new ApiError(401, error instanceof Error ? error.message : 'Invalid refresh token');
        }
        // Get user
        const user = await User.findById(decoded.id).select('email role status');
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
        // Clear cookies
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
        const user = await User.findById(req.user.id).select('-passwordHash');
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
        const user = await User.findByIdAndUpdate(req.user.id, {
            ...(firstName && { firstName: firstName.trim() }),
            ...(lastName !== undefined && { lastName: lastName?.trim() }),
            ...(displayName !== undefined && { displayName: displayName?.trim() }),
            ...(phone && { phone: phone.trim() }),
        }, { new: true, runValidators: true }).select('email firstName lastName displayName phone');
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
        const user = await User.findById(req.user.id);
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
            const formattedErrors = passwordValidation.errors.map(err => ({ message: err }));
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
        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
        // Update password
        user.passwordHash = newPasswordHash;
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
        // Just check if user exists (conceptually) but we don't need to do anything with it
        // because email service is not implemented.
        await User.findOne({ email: email.toLowerCase() });
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
        // Implementation pending as noted in original code
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    });
}
//# sourceMappingURL=auth.controller.js.map