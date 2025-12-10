import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Custom API Error Class
 * Extends Error with additional properties for API error handling
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Array<{ field?: string; message: string }>;
  isExpired?: boolean; // For token expiration
  code?: string; // Error code for client handling

  constructor(
    statusCode: number,
    message: string,
    errors?: Array<{ field?: string; message: string }>,
    isOperational = true,
    isExpired = false,
    code?: string
  ) {
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
export const notFoundHandler = (req: Request, res: Response) => {
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
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Initialize response variables
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = ERROR_MESSAGES.INTERNAL_ERROR;
  let errors: Array<{ field?: string; message: string }> | undefined;
  let code: string | undefined;

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
    errors = Object.values(err.errors).map((val: any) => ({
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
  } else if (statusCode >= 500) {
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
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
