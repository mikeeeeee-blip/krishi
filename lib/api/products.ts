/**
 * Products API Client
 */

import { fetchPublic, fetchWithAuth, ApiResponse } from './client';

interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Get all products
export const getProducts = async (filters: ProductFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return fetchPublic<Array<any>>(`/products?${params.toString()}`);
};

// Get product by ID
export const getProductById = async (productId: string) => {
  return fetchPublic<any>(`/products/${productId}`);
};

// Get product by slug
export const getProductBySlug = async (slug: string) => {
  return fetchPublic<any>(`/products/slug/${slug}`);
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 10) => {
  return fetchPublic<Array<any>>(`/products/featured?limit=${limit}`);
};

// Get bestseller products
export const getBestsellerProducts = async (limit: number = 10) => {
  return fetchPublic<Array<any>>(`/products/bestsellers?limit=${limit}`);
};

// Search products
export const searchProducts = async (query: string, filters: ProductFilters = {}) => {
  const params = new URLSearchParams({ q: query });
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return fetchPublic<Array<any>>(`/products/search?${params.toString()}`);
};

