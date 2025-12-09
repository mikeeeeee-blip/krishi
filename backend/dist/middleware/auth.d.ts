import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
/**
 * Main authentication middleware
 * Verifies JWT token and attaches user to request
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication middleware
 * Doesn't throw error if no token, but attaches user if valid token exists
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 */
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Admin only middleware
 */
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Seller middleware (sellers, admins, super admins)
 */
export declare const sellerOnly: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Verify refresh token middleware
 */
export declare const verifyRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map