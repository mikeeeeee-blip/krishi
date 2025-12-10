import { Prisma } from '@prisma/client';
import { config } from '../config/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
/**
 * Custom API Error Class
 * Extends Error with additional properties for API error handling
 */
export class ApiError extends Error {
    statusCode;
    isOperational;
    errors;
    isExpired; // For token expiration
    code; // Error code for client handling
    constructor(statusCode, message, errors, isOperational = true, isExpired = false, code) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.isExpired = isExpired;
        this.code = code;
        // Maintains proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
// Not found handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: 'NOT_FOUND',
    });
};
/**
 * Global Error Handler
 * Handles all errors and returns appropriate responses
 */
export const errorHandler = (err, req, res, _next) => {
    // Initialize response variables
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.INTERNAL_ERROR;
    let errors;
    let code;
    // Handle ApiError instances
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
        code = err.code;
    }
    // Handle Prisma errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        switch (err.code) {
            case 'P2002':
                statusCode = HTTP_STATUS.CONFLICT;
                message = 'Unique constraint violation';
                errors = [{ message: 'A record with this value already exists' }];
                code = 'UNIQUE_CONSTRAINT_VIOLATION';
                break;
            case 'P2025':
                statusCode = HTTP_STATUS.NOT_FOUND;
                message = ERROR_MESSAGES.NOT_FOUND;
                code = 'RECORD_NOT_FOUND';
                break;
            case 'P2003':
                statusCode = HTTP_STATUS.BAD_REQUEST;
                message = 'Foreign key constraint violation';
                errors = [{ message: 'Referenced record does not exist' }];
                code = 'FOREIGN_KEY_VIOLATION';
                break;
            default:
                statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
                message = 'Database error occurred';
                code = 'DATABASE_ERROR';
        }
    }
    // Handle Prisma validation errors
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_FAILED;
        errors = [{ message: err.message }];
        code = 'VALIDATION_ERROR';
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = ERROR_MESSAGES.TOKEN_INVALID;
        code = 'INVALID_TOKEN';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = ERROR_MESSAGES.TOKEN_EXPIRED;
        code = 'TOKEN_EXPIRED';
    }
    // Handle validation errors
    else if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_FAILED;
        code = 'VALIDATION_ERROR';
    }
    // Handle unknown errors
    else {
        message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
    }
    // Log error details
    const errorLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode,
        message: err.message,
        stack: err.stack,
        code,
        ...(config.nodeEnv === 'development' && {
            body: req.body,
            query: req.query,
            params: req.params,
        }),
    };
    if (config.nodeEnv === 'development') {
        console.error('Error Details:', errorLog);
    }
    else if (statusCode >= 500) {
        // Log server errors in production
        console.error('Server Error:', {
            timestamp: errorLog.timestamp,
            method: errorLog.method,
            url: errorLog.url,
            statusCode: errorLog.statusCode,
            message: errorLog.message,
            code: errorLog.code,
        });
    }
    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        code,
        ...(config.nodeEnv === 'development' && {
            stack: err.stack,
            details: errorLog,
        }),
    });
};
// Async handler wrapper to catch async errors
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map