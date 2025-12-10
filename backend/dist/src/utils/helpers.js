import { v4 as uuidv4 } from 'uuid';
import { PAGINATION } from '../constants/index.js';
/**
 * Generate a unique order number
 * Format: KRISHANSHECLAT-{TIMESTAMP}-{RANDOM}
 */
export const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = uuidv4().substring(0, 4).toUpperCase();
    return `KRISHANSHECLAT-${timestamp}-${random}`;
};
/**
 * Generate a unique SKU
 */
export const generateSKU = (categorySlug, productName) => {
    const category = categorySlug.substring(0, 3).toUpperCase();
    const name = productName.replace(/\s+/g, '').substring(0, 5).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${category}-${name}-${random}`;
};
/**
 * Generate a URL-friendly slug from text
 */
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};
/**
 * Calculate discount percentage
 */
export const calculateDiscountPercent = (originalPrice, salePrice) => {
    if (!originalPrice || originalPrice <= 0)
        return 0;
    const discount = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(discount * 100) / 100;
};
/**
 * Format price in INR
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};
/**
 * Get pagination metadata
 * Calculates skip, take, and pagination info for database queries
 */
export const getPagination = (total, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
    const normalizedPage = Math.max(1, Number(page));
    const normalizedLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Number(limit)));
    const skip = (normalizedPage - 1) * normalizedLimit;
    const pages = Math.ceil(total / normalizedLimit);
    return {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        pages,
        skip,
        take: normalizedLimit,
    };
};
/**
 * Paginate array (for in-memory arrays)
 * @deprecated Use getPagination for database queries
 */
export const paginate = (items, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
    const pagination = getPagination(items.length, page, limit);
    const offset = pagination.skip;
    const paginatedItems = items.slice(offset, offset + pagination.limit);
    return {
        data: paginatedItems,
        total: pagination.total,
        page: pagination.page,
        pages: pagination.pages,
    };
};
/**
 * Clean object - remove undefined/null values
 */
export const cleanObject = (obj) => {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && value !== null) {
            cleaned[key] = value;
        }
    }
    return cleaned;
};
/**
 * Delay execution
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/**
 * Retry async function
 */
export const retry = async (fn, retries = 3, delayMs = 1000) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (i < retries - 1) {
                await delay(delayMs * (i + 1));
            }
        }
    }
    throw lastError;
};
//# sourceMappingURL=helpers.js.map