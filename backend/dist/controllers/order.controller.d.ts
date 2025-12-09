import { Request, Response } from 'express';
export declare class OrderController {
    /**
     * Get user's orders with pagination and filtering
     * GET /api/v1/orders/my-orders
     */
    getMyOrders: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getOrderById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Create new order
     * POST /api/v1/orders
     */
    createOrder: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Cancel order (customer)
     * POST /api/v1/orders/:id/cancel
     */
    cancelOrder: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Admin: Get all orders with advanced filters
     * GET /api/v1/orders
     */
    getAllOrders: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getOrderStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getOrderByIdAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateOrderStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updatePaymentStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=order.controller.d.ts.map