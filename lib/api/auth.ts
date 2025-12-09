/**
 * Authentication API Client
 */

import { fetchWithAuth, fetchPublic, ApiResponse, API_BASE_URL } from './client';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    role: string;
    emailVerified: boolean;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

// Register new user
export const register = async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  const result = await fetchPublic<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  // Store tokens if provided
  if (result.data?.tokens) {
    localStorage.setItem('accessToken', result.data.tokens.accessToken);
    localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
  }

  return result;
};

// Login user
export const login = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const result = await fetchPublic<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  // Store tokens if provided
  if (result.data?.tokens) {
    localStorage.setItem('accessToken', result.data.tokens.accessToken);
    localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
  }

  return result;
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens regardless of API call success
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Get current user profile
export const getProfile = async (): Promise<ApiResponse<any>> => {
  return fetchWithAuth('/auth/me');
};

// Refresh token (re-exported from client for convenience)
export { refreshAccessToken as refreshToken } from './client';

