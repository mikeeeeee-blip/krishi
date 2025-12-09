import { Request, Response } from 'express';
export declare class AuthController {
    /**
     * Register new user
     * POST /api/v1/auth/register
     */
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Login user
     * POST /api/v1/auth/login
     */
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Refresh access token
     * POST /api/v1/auth/refresh-token
     */
    refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get current user profile
     * GET /api/v1/auth/me
     */
    getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update user profile
     * PUT /api/v1/auth/me
     */
    updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Change password
     * PUT /api/v1/auth/change-password
     */
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Forgot password
     * POST /api/v1/auth/forgot-password
     */
    forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Reset password
     * POST /api/v1/auth/reset-password
     */
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=auth.controller.d.ts.map