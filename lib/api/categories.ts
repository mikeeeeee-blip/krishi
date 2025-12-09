/**
 * Categories API Client
 */

import { fetchPublic, ApiResponse } from './client';

// Get all categories
export const getCategories = async (active: boolean = true) => {
  return fetchPublic<Array<any>>(`/categories?active=${active}`);
};

// Get category tree (hierarchical)
export const getCategoryTree = async () => {
  return fetchPublic<Array<any>>('/categories/tree');
};

// Get category by ID
export const getCategoryById = async (categoryId: string) => {
  return fetchPublic<any>(`/categories/${categoryId}`);
};

// Get category by slug
export const getCategoryBySlug = async (slug: string) => {
  return fetchPublic<any>(`/categories/slug/${slug}`);
};

