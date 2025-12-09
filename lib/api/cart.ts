/**
 * Cart API Client
 */

import { fetchWithAuth, ApiResponse } from './client';

// Get cart
export const getCart = async () => {
  return fetchWithAuth<any>('/cart');
};

// Add to cart
export const addToCart = async (productId: string, variantId: string | null, quantity: number = 1) => {
  return fetchWithAuth<any>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, variantId, quantity }),
  });
};

// Update cart item
export const updateCartItem = async (productId: string, quantity: number, variantId?: string) => {
  return fetchWithAuth<any>(`/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity, variantId }),
  });
};

// Remove from cart
export const removeFromCart = async (productId: string, variantId?: string) => {
  const params = variantId ? `?variantId=${variantId}` : '';
  return fetchWithAuth<any>(`/cart/items/${productId}${params}`, {
    method: 'DELETE',
  });
};

// Clear cart
export const clearCart = async () => {
  return fetchWithAuth<any>('/cart', {
    method: 'DELETE',
  });
};

