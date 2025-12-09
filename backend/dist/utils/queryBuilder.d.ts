import { Prisma } from '@prisma/client';
/**
 * Query Builder Utilities
 * Helper functions for building Prisma queries
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
 * Build orderBy clause for Prisma queries
 */
export declare const buildOrderBy: (sortBy?: string, sortOrder?: "asc" | "desc", defaultSort?: string) => Record<string, "asc" | "desc">;
/**
 * Build date range filter
 */
export declare const buildDateRange: (dateFrom?: string | Date, dateTo?: string | Date) => Prisma.DateTimeFilter | undefined;
/**
 * Build price range filter
 */
export declare const buildPriceRange: (minPrice?: number | string | undefined, maxPrice?: number | string | undefined) => Prisma.DecimalFilter | undefined;
//# sourceMappingURL=queryBuilder.d.ts.map