import { Request, Response } from 'express';
export declare class ProductController {
    /**
     * Get all products with pagination and filters
     * GET /api/v1/products
     */
    getAllProducts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getFeaturedProducts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getBestsellers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getNewArrivals: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchProducts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getProductById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getProductBySlug: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSimilarProducts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createProduct: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateProduct: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteProduct: (req: Request, res: Response, next: import("express").NextFunction) => void;
    addVariant: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateVariant: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteVariant: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=product.controller.d.ts.map