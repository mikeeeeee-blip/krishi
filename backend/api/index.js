/**
 * Vercel Serverless Function Entry Point
 * This file is used by Vercel to deploy the Express app as a serverless function
 *
 * Note: Vercel will compile this file and handle the import from src/index.ts
 * The build process compiles the entire backend before deploying
 */
import app from '../src/index.js';
// Export the Express app as the handler for Vercel
export default app;
//# sourceMappingURL=index.js.map