/**
 * Query Builder Utilities
 * Helper functions for building queries
 */
export interface PaginationParams {
    page?: number | string | undefined;
    limit?: number | string | undefined;
}
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
/**
 * Build pagination metadata from query params
 */
export declare const buildPagination: (total: number, params: PaginationParams) => {
    page: number;
    limit: number;
    total: number;
    pages: number;
    skip: number;
    take: number;
};
/**
 * Build orderBy clause
 */
export declare const buildOrderBy: (sortBy?: string, sortOrder?: "asc" | "desc", defaultSort?: string) => Record<string, "asc" | "desc">;
/**
 * Build date range filter
 */
export declare const buildDateRange: (dateFrom?: string | Date, dateTo?: string | Date) => any;
/**
 * Build price range filter
 */
export declare const buildPriceRange: (minPrice?: number | string | undefined, maxPrice?: number | string | undefined) => any;
//# sourceMappingURL=queryBuilder.d.ts.map