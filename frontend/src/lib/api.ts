import { User, LoginCredentials, RegisterData } from '../types/auth';
import { Customer, CustomerFormData } from '../types/customer';
import { Transaction } from '../types/transaction';
import { DashboardData } from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // 🔑 allow session cookie from Spring Security
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

//
// Authentication API (works with Spring Security session)
//
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.success) {
      return {
        success: true,
        user: result.data.user || {
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

  register: async (userData: RegisterData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return await apiRequest('/auth/logout', { method: 'POST' });
  },

  validateSession: async () => {
    return await apiRequest('/auth/validate', { method: 'GET' });
  },
};

//
// Customer API
//
export const customerApi = {
  getAll: async () => apiRequest('/customers'),

  getById: async (id: number) => apiRequest(`/customers/${id}`),

  create: async (customerData: CustomerFormData) =>
    apiRequest('/customers', { method: 'POST', body: JSON.stringify(customerData) }),

  update: async (id: number, customerData: CustomerFormData) =>
    apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(customerData) }),

  delete: async (id: number) =>
    apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

//
// Dashboard API
//
export const dashboardApi = {
  getDashboardData: async (): Promise<{ success: boolean; data?: DashboardData; error?: string }> =>
    apiRequest('/dashboard'),
};

//
// Transaction API
//
export const transactionApi = {
  deposit: async (data: { accountNumber: string; amount: number }) =>
    apiRequest('/transactions/deposit', { method: 'POST', body: JSON.stringify(data) }),

  withdraw: async (data: { accountNumber: string; amount: number }) =>
    apiRequest('/transactions/withdraw', { method: 'POST', body: JSON.stringify(data) }),

  transfer: async (data: { fromAccount: string; toAccount: string; amount: number }) =>
    apiRequest('/transactions/transfer', { method: 'POST', body: JSON.stringify(data) }),

  getHistory: async () => apiRequest('/transactions/history'),
};

export default apiRequest;
