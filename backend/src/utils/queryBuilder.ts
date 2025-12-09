import { Prisma } from '@prisma/client';
import { PAGINATION } from '../constants/index.js';
import { getPagination } from './helpers.js';

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
export const buildPagination = (
  total: number,
  params: PaginationParams
): {
  page: number;
  limit: number;
  total: number;
  pages: number;
  skip: number;
  take: number;
} => {
  const page = params.page ? (typeof params.page === 'string' ? Number(params.page) : params.page) : PAGINATION.DEFAULT_PAGE;
  const limit = params.limit ? (typeof params.limit === 'string' ? Number(params.limit) : params.limit) : PAGINATION.DEFAULT_LIMIT;
  return getPagination(total, page, limit);
};

/**
 * Build orderBy clause for Prisma queries
 */
export const buildOrderBy = (
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc',
  defaultSort: string = 'createdAt'
): Record<string, 'asc' | 'desc'> => {
  const validSortFields = ['createdAt', 'updatedAt', 'name', 'price', 'totalAmount'];
  const field = sortBy && validSortFields.includes(sortBy) ? sortBy : defaultSort;
  return { [field]: sortOrder };
};

/**
 * Build date range filter
 */
export const buildDateRange = (
  dateFrom?: string | Date,
  dateTo?: string | Date
): Prisma.DateTimeFilter | undefined => {
  if (!dateFrom && !dateTo) return undefined;

  const filter: Prisma.DateTimeFilter = {};
  if (dateFrom) {
    filter.gte = dateFrom instanceof Date ? dateFrom : new Date(dateFrom);
  }
  if (dateTo) {
    const endDate = dateTo instanceof Date ? dateTo : new Date(dateTo);
    endDate.setHours(23, 59, 59, 999);
    filter.lte = endDate;
  }
  return filter;
};

/**
 * Build price range filter
 */
export const buildPriceRange = (
  minPrice?: number | string | undefined,
  maxPrice?: number | string | undefined
): Prisma.DecimalFilter | undefined => {
  if (!minPrice && !maxPrice) return undefined;

  const filter: Prisma.DecimalFilter = {};
  if (minPrice !== undefined) {
    const min = typeof minPrice === 'string' ? Number(minPrice) : minPrice;
    if (!isNaN(min)) filter.gte = min;
  }
  if (maxPrice !== undefined) {
    const max = typeof maxPrice === 'string' ? Number(maxPrice) : maxPrice;
    if (!isNaN(max)) filter.lte = max;
  }
  return filter;
};

