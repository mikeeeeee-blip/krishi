import { Request, Response } from 'express';
export declare class UserController {
    /**
     * Get user addresses
     */
    getAddresses: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Add address
     */
    addAddress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update address
     */
    updateAddress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Delete address
     */
    deleteAddress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Set default address
     */
    setDefaultAddress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Admin: Get all users
     */
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Admin: Get user by ID
     */
    getUserById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Admin: Update user status
     */
    updateUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=user.controller.d.ts.map