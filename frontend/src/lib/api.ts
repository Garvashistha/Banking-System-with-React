import { User, LoginCredentials, RegisterData } from '../types/auth';
import { Customer, CustomerFormData } from '../types/customer';
import { Transaction } from '../types/transaction';
import { DashboardData } from '../types/dashboard';

// Base URL for backend API (defined in .env file)
// Example: VITE_API_URL=http://localhost:8080/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ------------------------------------------------------------
// Generic API request helper
// ------------------------------------------------------------
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // allow session cookie from Spring Security
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 204) {
      return { success: true };
    }

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error((data as any).message || data || 'API request failed');
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

// ------------------------------------------------------------
// Authentication API  (Spring Security session)
// ------------------------------------------------------------
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // ✅ Backend endpoint: POST /api/auth/login-success
    const result = await apiRequest('/auth/login-success', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.success) {
      return {
        success: true,
        user: result.data?.user || {
          id: 1,
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          fullName: credentials.username,
          roles: ['USER'],
        },
      };
    }
    return result;
  },

  register: async (userData: RegisterData) =>
    // ✅ Backend endpoint: POST /api/auth/register
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: async () =>
    // ✅ Backend endpoint: POST /api/auth/logout-success
    apiRequest('/auth/logout-success', { method: 'POST' }),

  validateSession: async () =>
    // ✅ Backend endpoint: GET /api/auth/validate (if implemented)
    apiRequest('/auth/validate', { method: 'GET' }),
};

// ------------------------------------------------------------
// Customer API
// ------------------------------------------------------------
export const customerApi = {
  // ✅ Backend endpoint: GET /api/customers
  getAll: async () => apiRequest('/customers'),

  // ✅ Backend endpoint: GET /api/customers/{id}
  getById: async (id: number) => apiRequest(`/customers/${id}`),

  // ✅ Backend should implement: POST /api/customers
  create: async (customerData: CustomerFormData) =>
    apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    }),

  // ✅ Backend should implement: PUT /api/customers/{id}
  update: async (id: number, customerData: CustomerFormData) =>
    apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    }),

  // ✅ Backend should implement: DELETE /api/customers/{id}
  delete: async (id: number) =>
    apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

// ------------------------------------------------------------
// Dashboard API
// ------------------------------------------------------------
export const dashboardApi = {
  // ✅ Backend endpoint: GET /api/dashboard/summary
  getDashboardData: async (): Promise<{
    success: boolean;
    data?: DashboardData;
    error?: string;
  }> => apiRequest('/dashboard/summary'),
};

// ------------------------------------------------------------
// Transaction API
// ------------------------------------------------------------
export const transactionApi = {
  // ✅ Backend endpoint: POST /api/transactions/deposit
  deposit: async (data: { accountNumber: string; amount: number }) =>
    apiRequest('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ✅ Backend endpoint: POST /api/transactions/withdraw
  withdraw: async (data: { accountNumber: string; amount: number }) =>
    apiRequest('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ✅ Backend endpoint: POST /api/transactions/transfer
  transfer: async (data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) =>
    apiRequest('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ✅ Backend endpoint: GET /api/transactions/history
  getHistory: async () => apiRequest('/transactions/history'),
};

export default apiRequest;
