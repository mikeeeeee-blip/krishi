import { ApiError } from './errorHandler.js';
const store = {};
/**
 * Rate limiting middleware
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum requests per window
 * @param keyGenerator Function to generate rate limit key (default: IP address)
 */
export const rateLimiter = (windowMs = 15 * 60 * 1000, // 15 minutes
maxRequests = 100, keyGenerator = (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
}) => {
    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        // Clean up expired entries
        if (store[key] && store[key].resetTime < now) {
            delete store[key];
        }
        // Initialize or get existing entry
        if (!store[key]) {
            store[key] = {
                count: 0,
                resetTime: now + windowMs,
            };
        }
        // Increment count
        store[key].count++;
        // Set rate limit headers
        const remaining = Math.max(0, maxRequests - store[key].count);
        const resetTime = Math.ceil(store[key].resetTime / 1000);
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', remaining.toString());
        res.setHeader('X-RateLimit-Reset', resetTime.toString());
        // Check if limit exceeded
        if (store[key].count > maxRequests) {
            return next(new ApiError(429, `Too many requests. Please try again after ${Math.ceil((store[key].resetTime - now) / 1000)} seconds.`));
        }
        next();
    };
};
/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authRateLimiter = rateLimiter(15 * 60 * 1000, // 15 minutes
5, // Only 5 attempts per 15 minutes
(req) => {
    // Use email + IP for auth endpoints
    const email = req.body?.email || 'unknown';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `auth:${email}:${ip}`;
});
//# sourceMappingURL=rateLimiter.js.map