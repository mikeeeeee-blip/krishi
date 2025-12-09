import { Request, Response } from 'express';
export declare class CategoryController {
    getAllCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryTree: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryBySlug: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryProducts: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=category.controller.d.ts.map