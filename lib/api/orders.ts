/**
 * Order Management API Client
 */

import { fetchWithAuth, ApiResponse } from './client';

interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User Order APIs
export const getUserOrders = async (filters: OrderFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return fetchWithAuth<Array<any>>(`/orders/my-orders?${params.toString()}`);
};

export const createOrder = async (orderData: {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod: string;
  couponCode?: string;
  customerNotes?: string;
}) => {
  return fetchWithAuth<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getUserOrderById = async (orderId: string) => {
  return fetchWithAuth<any>(`/orders/my-orders/${orderId}`);
};

export const cancelOrder = async (orderId: string, reason?: string) => {
  return fetchWithAuth<any>(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

// Admin Order APIs
export const getAllOrders = async (filters: OrderFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return fetchWithAuth<Array<any>>(`/orders?${params.toString()}`);
};

export const getOrderById = async (orderId: string) => {
  return fetchWithAuth<any>(`/orders/${orderId}`);
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  trackingNumber?: string,
  carrierName?: string
) => {
  return fetchWithAuth<any>(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, trackingNumber, carrierName }),
  });
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string,
  paymentId?: string
) => {
  return fetchWithAuth<any>(`/orders/${orderId}/payment-status`, {
    method: 'PUT',
    body: JSON.stringify({ paymentStatus, paymentId }),
  });
};

export const getOrderStats = async (dateFrom?: string, dateTo?: string) => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  return fetchWithAuth<any>(`/orders/stats?${params.toString()}`);
};

