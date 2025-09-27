import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import { authApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('banking-token');
        if (token) {
          // Validate token with backend
          const response = await authApi.validateToken();
          if (response.success && 'user' in response) {
            setUser(response.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('banking-token');
            localStorage.removeItem('banking-user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('banking-token');
        localStorage.removeItem('banking-user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ username, password });
      
      if (response.success && 'user' in response && 'token' in response) {
        setUser(response.user);
        localStorage.setItem('banking-token', response.token);
        localStorage.setItem('banking-user', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, error: 'error' in response ? response.error : 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: 'error' in response ? response.error : 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('banking-token');
      localStorage.removeItem('banking-user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}