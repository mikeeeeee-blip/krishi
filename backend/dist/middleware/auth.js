import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiError } from './errorHandler.js';
import { userModel } from '../models/user.model.js';
/**
 * Extract JWT token from request
 * Supports both Authorization header (Bearer token) and httpOnly cookies
 */
const extractToken = (req) => {
    // Try Authorization header first (for API clients)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    // Try httpOnly cookie (for web browsers)
    if (req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
    }
    return null;
};
/**
 * Main authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            throw new ApiError(401, 'Access token required');
        }
        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, 'Token expired', undefined, true); // isExpired flag
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(401, 'Invalid token');
            }
            throw error;
        }
        // Verify user still exists and is active
        const user = await userModel.findById(decoded.id).select('id email role status deletedAt');
        if (!user) {
            throw new ApiError(401, 'User not found');
        }
        if (user.deletedAt) {
            throw new ApiError(401, 'Account has been deleted');
        }
        if (user.status !== 'ACTIVE') {
            throw new ApiError(403, `Account is ${user.status.toLowerCase()}`);
        }
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
/**
 * Optional authentication middleware
 * Doesn't throw error if no token, but attaches user if valid token exists
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return next();
        }
        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            const user = await userModel.findById(decoded.id).select('id email role status deletedAt');
            // Only attach if user exists, is active, and not deleted
            if (user && !user.deletedAt && user.status === 'ACTIVE') {
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };
            }
        }
        catch {
            // Silently ignore token errors for optional auth
        }
        next();
    }
    catch {
        next();
    }
};
/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, `Access denied. Required roles: ${roles.join(', ')}`));
        }
        next();
    };
};
/**
 * Admin only middleware
 */
export const adminOnly = authorize('ADMIN');
/**
 * Seller middleware (sellers, admins, super admins)
 */
export const sellerOnly = authorize('SELLER', 'ADMIN', 'SUPER_ADMIN');
/**
 * Verify refresh token middleware
 */
export const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token required');
        }
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
        if (decoded.type !== 'refresh') {
            throw new ApiError(401, 'Invalid token type');
        }
        // Verify user exists
        const user = await userModel.findById(decoded.id).select('id email role status');
        if (!user || user.status !== 'ACTIVE') {
            throw new ApiError(401, 'Invalid refresh token');
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new ApiError(401, 'Refresh token expired'));
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            next(new ApiError(401, 'Invalid refresh token'));
        }
        else {
            next(error);
        }
    }
};
//# sourceMappingURL=auth.js.map