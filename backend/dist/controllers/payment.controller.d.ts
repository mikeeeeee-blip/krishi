import { Request, Response } from 'express';
export declare class PaymentController {
    createPaymentOrder: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    handleWebhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPaymentStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    private handlePaymentCaptured;
    private handlePaymentFailed;
    private handleRefundCreated;
}
//# sourceMappingURL=payment.controller.d.ts.map