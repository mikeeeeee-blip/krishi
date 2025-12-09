/**
 * Application Constants
 * Centralized constants for better maintainability
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const USER_ROLES: {
    readonly CUSTOMER: "CUSTOMER";
    readonly SELLER: "SELLER";
    readonly ADMIN: "ADMIN";
};
export declare const USER_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly PENDING_VERIFICATION: "PENDING_VERIFICATION";
    readonly SUSPENDED: "SUSPENDED";
};
export declare const PRODUCT_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly OUT_OF_STOCK: "OUT_OF_STOCK";
    readonly DISCONTINUED: "DISCONTINUED";
};
export declare const ORDER_STATUS: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
    readonly REFUNDED: "REFUNDED";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export declare const PAYMENT_METHODS: {
    readonly COD: "COD";
    readonly UPI: "UPI";
    readonly CREDIT_CARD: "CREDIT_CARD";
    readonly DEBIT_CARD: "DEBIT_CARD";
    readonly NET_BANKING: "NET_BANKING";
    readonly WALLET: "WALLET";
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const ORDER_CONFIG: {
    readonly TAX_RATE: 0.18;
    readonly FREE_SHIPPING_THRESHOLD: 500;
    readonly DEFAULT_SHIPPING_CHARGE: 50;
    readonly ONLINE_PAYMENT_DISCOUNT: 30;
};
export declare const TOKEN_TYPES: {
    readonly ACCESS: "access";
    readonly REFRESH: "refresh";
};
export declare const VALIDATION: {
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PASSWORD_MAX_LENGTH: 128;
    readonly EMAIL_MAX_LENGTH: 255;
    readonly NAME_MAX_LENGTH: 100;
    readonly PHONE_MAX_LENGTH: 20;
};
export declare const CACHE_KEYS: {
    readonly CATEGORIES: "categories";
    readonly FEATURED_PRODUCTS: "featured_products";
    readonly BEST_SELLERS: "best_sellers";
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly FORBIDDEN: "Access forbidden";
    readonly NOT_FOUND: "Resource not found";
    readonly VALIDATION_FAILED: "Validation failed";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly USER_EXISTS: "User already exists";
    readonly TOKEN_EXPIRED: "Token expired";
    readonly TOKEN_INVALID: "Invalid token";
};
export declare const SUCCESS_MESSAGES: {
    readonly CREATED: "Resource created successfully";
    readonly UPDATED: "Resource updated successfully";
    readonly DELETED: "Resource deleted successfully";
    readonly LOGIN_SUCCESS: "Login successful";
    readonly REGISTER_SUCCESS: "Registration successful";
    readonly LOGOUT_SUCCESS: "Logout successful";
};
//# sourceMappingURL=index.d.ts.map