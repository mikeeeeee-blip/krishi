import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import routes from './routes/index.js';

// ... (imports)

// Connect to Database
connectDB();

/**
 * Initialize Express Application
 * Sets up all middleware and routes
 */
const createApp = (): Express => {
  const app = express();

  // Trust proxy (for rate limiting, IP detection behind reverse proxy)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: config.nodeEnv === 'production',
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  const corsOptions = {
    origin: config.corsOrigin.split(',').map(origin => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  };
  app.use(cors(corsOptions));

  // Cookie parser (must be before routes)
  app.use(cookieParser());

  // Request parsing with size limits
  app.use(express.json({
    limit: '10mb',
    strict: true,
  }));
  app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 100,
  }));

  // Compression (gzip)
  app.use(compression({
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
  }));

  // Request logging
  app.use(requestLogger);

  // HTTP request logging (morgan)
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  return app;
};

// Initialize Express app
const app = createApp();

/**
 * Health Check Endpoint
 * Returns API status and basic information
 */
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    message: 'KRISHANSHECLAT AGROXGLOBAL API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: config.apiVersion,
    uptime: process.uptime(),
  });
});

// API routes
app.use(`/api/v1`, routes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

/**
 * Start Server
 * Initializes the Express server with graceful shutdown handling
 */
const startServer = (): void => {
  const server = app.listen(config.port, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🌱 KRISHANSHECLAT AGROXGLOBAL Backend API                        ║
  ║                                                           ║
  ║   Environment: ${config.nodeEnv.padEnd(40)}║
  ║   Server running on: http://localhost:${String(config.port).padEnd(20)}║
  ║   API Version: ${config.apiVersion.padEnd(42)}║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown handler
  const gracefulShutdown = (signal: string): void => {
    console.log(`${signal} received. Shutting down gracefully...`);

    server.close(() => {
      console.log('HTTP server closed.');

      // Close database connections
      mongoose.connection.close(false)
        .then(() => {
          console.log('Database connections closed.');
          process.exit(0);
        })
        .catch((err: Error) => {
          console.error('Error closing database connections:', err);
          process.exit(1);
        });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
  });
};

// Vercel serverless function handler
export default app;

// Export handler for Vercel serverless functions
export const handler = app;

// Start the server only if not running on Vercel
// Vercel sets VERCEL environment variable
if (!process.env.VERCEL) {
  startServer();
}

