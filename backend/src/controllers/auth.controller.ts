import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { validatePassword, isPasswordSimilarToUserInfo } from '../utils/passwordValidator.js';
import { generateTokenPair } from '../utils/tokenManager.js';

/**
 * Set httpOnly cookies for tokens
 */
const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = config.nodeEnv === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'strict' as const, // CSRF protection
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
const clearTokenCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const formattedErrors = passwordValidation.errors.map(err => ({ message: err }));
      throw new ApiError(400, 'Password validation failed', formattedErrors);
    }

    // Check if password is similar to user info
    if (isPasswordSimilarToUserInfo(password, { email, firstName, lastName })) {
      throw new ApiError(
        400,
        'Password is too similar to your personal information. Please choose a different password.'
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      // Don't reveal which field already exists (security best practice)
      throw new ApiError(409, 'An account with this email or phone already exists');
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName?.trim(),
        phone: phone?.trim(),
        status: 'ACTIVE', // In production, set to 'PENDING_VERIFICATION' and send verification email
        emailVerified: false, // Should be false until email is verified
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate token pair
    const { accessToken, refreshToken } = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set httpOnly cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Return user data (without sensitive info) and tokens in response body
    // Frontend can choose to use cookies or store tokens in memory/localStorage
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        // Include tokens in response for clients that prefer localStorage
        // Remove these if you want to force httpOnly cookie usage only
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
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always perform bcrypt comparison (even if user doesn't exist)
    // This prevents timing attacks that could reveal if email exists
    const hashToCompare = user?.passwordHash || '$2a$12$dummy.hash.to.prevent.timing.attack';
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !isPasswordValid) {
      // Generic error message to prevent user enumeration
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        403,
        `Account is ${user.status.toLowerCase()}. Please contact support.`
      );
    }

    // Check if account is deleted
    if (user.deletedAt) {
      throw new ApiError(403, 'This account has been deleted');
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token pair
    const { accessToken, refreshToken } = generateTokenPair({
      id: user.id,
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
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        // Include tokens in response for clients that prefer localStorage
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
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required');
    }

    // Verify refresh token
    const { verifyRefreshToken: verifyToken } = await import('../utils/tokenManager.js');
    let decoded: { id: string };
    
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      throw new ApiError(401, error instanceof Error ? error.message : 'Invalid refresh token');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
      id: user.id,
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
  logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear cookies
    clearTokenCookies(res);

    // In production, you might want to:
    // 1. Add token to blacklist (Redis)
    // 2. Invalidate refresh token in database
    // 3. Log logout event

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

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
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, displayName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(firstName && { firstName: firstName.trim() }),
        ...(lastName !== undefined && { lastName: lastName?.trim() }),
        ...(displayName !== undefined && { displayName: displayName?.trim() }),
        ...(phone && { phone: phone.trim() }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        phone: true,
      },
    });

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
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Current password and new password are required');
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

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
    if (
      isPasswordSimilarToUserInfo(newPassword, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
      })
    ) {
      throw new ApiError(
        400,
        'Password is too similar to your personal information'
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, config.bcryptSaltRounds);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  });

  /**
   * Forgot password
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    // Note: Email service is not configured. Password reset functionality requires email service.
    res.json({
      success: true,
      message: 'Password reset functionality is currently unavailable. Please contact support for assistance.',
    });
  });

  /**
   * Reset password
   * POST /api/v1/auth/reset-password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new ApiError(400, 'Reset token and new password are required');
    }

    // TODO: Verify reset token and update password
    // 1. Verify token (JWT or database token)
    // 2. Validate new password
    // 3. Update password hash
    // 4. Invalidate reset token

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  });
}
