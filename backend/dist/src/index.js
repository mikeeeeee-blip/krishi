import express from 'express';
import cors from 'cors';
import helmetModule from 'helmet';
// Helmet v8+ ES module compatibility
const helmet = helmetModule.default || helmetModule;
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import routes from './routes/index.js';
/**
 * Initialize application
 * Connects to database first, then starts the server
 */
const initializeApp = async () => {
    try {
        // Connect to database first
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();
        // Start server after database connection is established
        startServer();
    }
    catch (error) {
        console.error('❌ Failed to initialize application:', error);
        process.exit(1);
    }
};
/**
 * Initialize Express Application
 * Sets up all middleware and routes
 */
const createApp = () => {
    const app = express();
    // Trust proxy (for rate limiting, IP detection behind reverse proxy)
    app.set('trust proxy', 1);
    // Security middleware
    app.use(helmet({
        contentSecurityPolicy: config.nodeEnv === 'production' ? {} : false,
        crossOriginEmbedderPolicy: false,
    }));
    // CORS configuration - Allow all origins
    const corsOptions = {
        origin: true, // Allow all origins
        credentials: true, // Allow credentials (cookies, authorization headers)
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
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
    }
    else {
        app.use(morgan('combined'));
    }
    return app;
};
// Initialize Express app
const app = createApp();
/**
 * API Landing Page
 * Simple landing page for the API
 */
app.get('/', (req, res) => {
    res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KRISHANSHECLAT AGROXGLOBAL API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        h1 {
          color: #2d3748;
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .subtitle {
          color: #718096;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .status {
          display: inline-block;
          background: #48bb78;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 30px;
        }
        .info {
          background: #f7fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: left;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .label {
          color: #718096;
          font-weight: 600;
          font-size: 14px;
        }
        .value {
          color: #2d3748;
          font-weight: 500;
          font-size: 14px;
        }
        .links {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 30px;
        }
        .link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          border: 2px solid #667eea;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .link:hover {
          background: #667eea;
          color: white;
        }
        @media (max-width: 480px) {
          .container { padding: 30px 20px; }
          h1 { font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌱 KRISHANSHECLAT AGROXGLOBAL API</h1>
        <p class="subtitle">Agricultural E-Commerce Platform API</p>
        <div class="status">● API Running</div>
        <div class="info">
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="value">Online</span>
          </div>
          <div class="info-item">
            <span class="label">Environment:</span>
            <span class="value">${config.nodeEnv}</span>
          </div>
          <div class="info-item">
            <span class="label">API Version:</span>
            <span class="value">${config.apiVersion}</span>
          </div>
          <div class="info-item">
            <span class="label">Base URL:</span>
            <span class="value">/api/v1</span>
          </div>
        </div>
        <div class="links">
          <a href="/health" class="link">Health Check</a>
          <a href="/api/v1" class="link">API Docs</a>
        </div>
      </div>
    </body>
    </html>
  `);
});
/**
 * Health Check Endpoint
 * Returns API status and basic information
 */
app.get('/health', (req, res) => {
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
const startServer = () => {
    // Verify database is connected before starting server
    if (mongoose.connection.readyState !== 1) {
        console.error('❌ ERROR: Database is not connected. Cannot start server.');
        console.error('   Connection state:', mongoose.connection.readyState);
        process.exit(1);
    }
    const server = app.listen(config.port, () => {
        const dbName = mongoose.connection.name || 'N/A';
        console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🌱 KRISHANSHECLAT AGROXGLOBAL Backend API                        ║
  ║                                                           ║
  ║   Environment: ${config.nodeEnv.padEnd(40)}║
  ║   Server running on: http://localhost:${String(config.port).padEnd(20)}║
  ║   API Version: ${config.apiVersion.padEnd(42)}║
  ║   Database: ${dbName.padEnd(40)}║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
    `);
    });
    app.get('/', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'KRISHANSHECLAT AGROXGLOBAL API is running',
            timestamp: new Date().toISOString(),
            environment: config.nodeEnv,
        });
    });
    // Graceful shutdown handler
    const gracefulShutdown = (signal) => {
        console.log(`${signal} received. Shutting down gracefully...`);
        server.close(() => {
            console.log('HTTP server closed.');
            // Close database connections
            mongoose.connection.close(false)
                .then(() => {
                console.log('Database connections closed.');
                process.exit(0);
            })
                .catch((err) => {
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
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        gracefulShutdown('uncaughtException');
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled Rejection:', reason);
        gracefulShutdown('unhandledRejection');
    });
};
// Vercel serverless function handler
// For Vercel, we need to ensure DB connection on first invocation
let dbConnected = false;
const vercelHandler = async (req, res) => {
    // Ensure database connection on first invocation
    if (!dbConnected && mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
            dbConnected = true;
        }
        catch (error) {
            console.error('Failed to connect to database:', error);
            return res.status(500).json({ success: false, message: 'Database connection failed' });
        }
    }
    // Handle Express app
    return app(req, res);
};
export default vercelHandler;
// Export handler for Vercel serverless functions
export const handler = vercelHandler;
// Start the server only if not running on Vercel
// Vercel sets VERCEL environment variable
if (!process.env.VERCEL) {
    initializeApp();
}
//# sourceMappingURL=index.js.map