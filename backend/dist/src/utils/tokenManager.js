import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
/**
 * Generate access token (short-lived)
 */
export const generateAccessToken = (payload) => {
    return jwt.sign({ ...payload, type: 'access' }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
        issuer: 'krishansheclat-agroxglobal',
        audience: 'krishansheclat-agroxglobal-users',
    });
};
/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign({ id: payload.id, type: 'refresh' }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
        issuer: 'krishansheclat-agroxglobal',
        audience: 'krishansheclat-agroxglobal-users',
    });
};
/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};
/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret, {
            issuer: 'krishansheclat-agroxglobal',
            audience: 'krishansheclat-agroxglobal-users',
        });
        if (decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
};
/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.refreshSecret, {
            issuer: 'krishansheclat-agroxglobal',
            audience: 'krishansheclat-agroxglobal-users',
        });
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        return { id: decoded.id };
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
};
//# sourceMappingURL=tokenManager.js.map