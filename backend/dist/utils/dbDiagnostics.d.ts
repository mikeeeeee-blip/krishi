/**
 * Diagnostic utility to check database connection and configuration
 */
export declare const checkDatabaseConnection: () => {
    isConnected: boolean;
    connectionState: string;
    mongoUriSet: boolean;
    mongoUriPreview: string;
    databaseName: string | null;
};
/**
 * Log database diagnostics
 */
export declare const logDatabaseDiagnostics: () => void;
//# sourceMappingURL=dbDiagnostics.d.ts.map