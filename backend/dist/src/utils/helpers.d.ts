/**
 * Generate a unique order number
 * Format: KRISHANSHECLAT-{TIMESTAMP}-{RANDOM}
 */
export declare const generateOrderNumber: () => string;
/**
 * Generate a unique SKU
 */
export declare const generateSKU: (categorySlug: string, productName: string) => string;
/**
 * Generate a URL-friendly slug from text
 */
export declare const generateSlug: (text: string) => string;
/**
 * Calculate discount percentage
 */
export declare const calculateDiscountPercent: (originalPrice: number, salePrice: number) => number;
/**
 * Format price in INR
 */
export declare const formatPrice: (price: number) => string;
/**
 * Get pagination metadata
 * Calculates skip, take, and pagination info for database queries
 */
export declare const getPagination: (total: number, page?: number, limit?: number) => {
    page: number;
    limit: number;
    total: number;
    pages: number;
    skip: number;
    take: number;
};
/**
 * Paginate array (for in-memory arrays)
 * @deprecated Use getPagination for database queries
 */
export declare const paginate: <T>(items: T[], page?: number, limit?: number) => {
    data: T[];
    total: number;
    page: number;
    pages: number;
};
/**
 * Clean object - remove undefined/null values
 */
export declare const cleanObject: <T extends object>(obj: T) => Partial<T>;
/**
 * Delay execution
 */
export declare const delay: (ms: number) => Promise<void>;
/**
 * Retry async function
 */
export declare const retry: <T>(fn: () => Promise<T>, retries?: number, delayMs?: number) => Promise<T>;
//# sourceMappingURL=helpers.d.ts.map