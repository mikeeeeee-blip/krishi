/**
 * Vercel Serverless Function Entry Point
 * This file is used by Vercel to deploy the Express app as a serverless function
 *
 * Vercel will compile TypeScript on the fly for serverless functions.
 * The handler will automatically connect to MongoDB on first invocation.
 */
import handler from '../src/index.js';
// Export the handler for Vercel serverless functions
export default handler;
//# sourceMappingURL=index.js.map