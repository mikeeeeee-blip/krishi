import mongoose from 'mongoose';
import { config } from './index.js';
/**
 * Connect to MongoDB database
 * @throws Error if connection fails or MONGODB_URI is missing
 */
export const connectDB = async () => {
    // Validate MongoDB URI
    if (!config.mongoUri || config.mongoUri.trim() === '') {
        console.error('❌ ERROR: MONGODB_URI is not set in environment variables');
        console.error('Please set MONGODB_URI in your .env file');
        process.exit(1);
    }
    try {
        // Connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        const conn = await mongoose.connect(config.mongoUri, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error(`   Error: ${error.message}`);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Check if MONGODB_URI is correct in .env file');
        console.error('   2. Verify MongoDB server is running');
        console.error('   3. Check network connectivity');
        console.error('   4. For MongoDB Atlas: Verify IP whitelist and credentials\n');
        process.exit(1);
    }
};
/**
 * Check if database is connected
 */
export const isDBConnected = () => {
    return mongoose.connection.readyState === 1; // 1 = connected
};
//# sourceMappingURL=db.js.map