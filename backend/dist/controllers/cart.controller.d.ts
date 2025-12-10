import { Request, Response } from 'express';
export declare class CartController {
    private getUserInfo;
    getCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
    addToCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCartItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
    removeFromCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
    clearCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
    mergeCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=cart.controller.d.ts.map