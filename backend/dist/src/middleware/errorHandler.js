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
    // Mongoose: CastError (Invalid ID)
    else if (err.name === 'CastError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
        code = 'INVALID_ID';
    }
    // Mongoose: ValidationError
    else if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_FAILED;
        errors = Object.values(err.errors).map((val) => ({
            message: val.message,
        }));
        code = 'VALIDATION_ERROR';
    }
    // Mongoose: Duplicate Key Error
    else if (err.code === 11000) {
        statusCode = HTTP_STATUS.CONFLICT;
        message = 'Duplicate field value entered';
        // const field = Object.keys(err.keyValue)[0];
        errors = [{ message: 'A record with this value already exists' }];
        code = 'DUPLICATE_KEY_ERROR';
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