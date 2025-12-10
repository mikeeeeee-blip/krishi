import mongoose from 'mongoose';
import { config } from '../config/index.js';
/**
 * Diagnostic utility to check database connection and configuration
 */
export const checkDatabaseConnection = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    const state = mongoose.connection.readyState;
    const mongoUri = config.mongoUri || '';
    const mongoUriSet = mongoUri.trim() !== '';
    // Show preview of URI (hide password)
    let mongoUriPreview = 'Not set';
    if (mongoUriSet) {
        try {
            const url = new URL(mongoUri);
            mongoUriPreview = `${url.protocol}//${url.username ? '***:***@' : ''}${url.hostname}${url.pathname}`;
        }
        catch {
            mongoUriPreview = 'Invalid format';
        }
    }
    return {
        isConnected: state === 1,
        connectionState: states[state] || 'unknown',
        mongoUriSet,
        mongoUriPreview,
        databaseName: mongoose.connection.name || null,
    };
};
/**
 * Log database diagnostics
 */
export const logDatabaseDiagnostics = () => {
    const diagnostics = checkDatabaseConnection();
    console.log('\n📊 Database Diagnostics:');
    console.log(`   Connection State: ${diagnostics.connectionState}`);
    console.log(`   Is Connected: ${diagnostics.isConnected ? '✅ Yes' : '❌ No'}`);
    console.log(`   MongoDB URI Set: ${diagnostics.mongoUriSet ? '✅ Yes' : '❌ No'}`);
    console.log(`   MongoDB URI: ${diagnostics.mongoUriPreview}`);
    console.log(`   Database Name: ${diagnostics.databaseName || 'N/A'}`);
    console.log('');
};
//# sourceMappingURL=dbDiagnostics.js.map