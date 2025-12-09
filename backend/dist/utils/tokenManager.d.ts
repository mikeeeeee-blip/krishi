export interface TokenPayload {
    id: string;
    email: string;
    role: string;
    type?: 'access' | 'refresh';
}
/**
 * Generate access token (short-lived)
 */
export declare const generateAccessToken: (payload: TokenPayload) => string;
/**
 * Generate refresh token (long-lived)
 */
export declare const generateRefreshToken: (payload: TokenPayload) => string;
/**
 * Generate both access and refresh tokens
 */
export declare const generateTokenPair: (payload: TokenPayload) => {
    accessToken: string;
    refreshToken: string;
};
/**
 * Verify access token
 */
export declare const verifyAccessToken: (token: string) => TokenPayload;
/**
 * Verify refresh token
 */
export declare const verifyRefreshToken: (token: string) => {
    id: string;
};
//# sourceMappingURL=tokenManager.d.ts.map