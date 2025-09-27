import { User, LoginCredentials, RegisterData } from '../types/auth';
import { Customer, CustomerFormData } from '../types/customer';
import { Transaction, TransactionFormData } from '../types/transaction';
import { Account, DashboardData } from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('banking-token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response types
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
      throw new Error(data.message || data || 'API request failed');
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // Since your backend uses GET for login, we'll simulate a login flow
    // In a real app, you'd typically POST to /api/auth/login
    const result = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (result.success) {
      // Mock response structure - adjust based on your backend response
      return {
        success: true,
        user: result.data.user || {
          id: 1,
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          fullName: 'User Name',
          roles: ['USER']
        },
        token: result.data.token || 'mock-jwt-token'
      };
    }
    
    return result;
  },

  register: async (userData: RegisterData) => {
    return await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return await apiRequest('/logout', {
      method: 'GET',
    });
  },

  validateToken: async () => {
    const token = localStorage.getItem('banking-token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, user };
      } else {
        return { success: false, error: 'Invalid token' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};

// Customer API
export const customerApi = {
  getAll: async () => {
    return await apiRequest('/customers');
  },

  getById: async (id: number) => {
    return await apiRequest(`/customers/${id}`);
  },

  create: async (customerData: CustomerFormData) => {
    return await apiRequest('/create', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  update: async (id: number, customerData: CustomerFormData) => {
    return await apiRequest(`/update/${id}`, {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/delete/${id}`, {
      method: 'GET',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getDashboardData: async (): Promise<{ success: boolean; data?: DashboardData; error?: string }> => {
    return await apiRequest('/dashboard');
  },
};

// Transaction API
export const transactionApi = {
  deposit: async (data: { accountNumber: string; amount: number }) => {
    return await apiRequest('/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  withdraw: async (data: { accountNumber: string; amount: number }) => {
    return await apiRequest('/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  transfer: async (data: { fromAccount: string; toAccount: string; amount: number }) => {
    return await apiRequest('/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHistory: async () => {
    return await apiRequest('/transactions/history');
  },
};