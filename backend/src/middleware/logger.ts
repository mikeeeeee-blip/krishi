import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

/**
 * Request Logger Middleware
 * Logs request details in a structured format
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Log request
  if (config.nodeEnv === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';

    if (config.nodeEnv === 'development') {
      console.log(
        `[${new Date().toISOString()}] ${logLevel} ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
};

