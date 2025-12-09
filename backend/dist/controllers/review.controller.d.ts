import { Request, Response } from 'express';
export declare class ReviewController {
    getProductReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markHelpful: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
    approveReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    rejectReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=review.controller.d.ts.map