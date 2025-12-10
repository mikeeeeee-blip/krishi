import { Request, Response, NextFunction } from 'express';
/**
 * Custom API Error Class
 * Extends Error with additional properties for API error handling
 */
export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: Array<{
        field?: string;
        message: string;
    }>;
    isExpired?: boolean;
    code?: string;
    constructor(statusCode: number, message: string, errors?: Array<{
        field?: string;
        message: string;
    }>, isOperational?: boolean, isExpired?: boolean, code?: string);
}
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Global Error Handler
 * Handles all errors and returns appropriate responses
 */
export declare const errorHandler: (err: any, req: Request, res: Response, _next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map