// Request/Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

// Product types
export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  inStock?: boolean;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'name' | 'rating' | 'orderCount';
  order: 'asc' | 'desc';
}

// Order types
export interface CreateOrderRequest {
  items: OrderItemInput[];
  shippingAddress: AddressInput;
  billingAddress?: AddressInput;
  paymentMethod: 'COD' | 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
  couponCode?: string;
  customerNotes?: string;
}

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
}

// Cart types
export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

// Review types
export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}

