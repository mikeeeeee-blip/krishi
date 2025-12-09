import { Request, Response, NextFunction } from 'express';
/**
 * Rate limiting middleware
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum requests per window
 * @param keyGenerator Function to generate rate limit key (default: IP address)
 */
export declare const rateLimiter: (windowMs?: number, // 15 minutes
maxRequests?: number, keyGenerator?: (req: Request) => string) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export declare const authRateLimiter: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimiter.d.ts.map