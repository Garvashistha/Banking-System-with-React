// src/context/auth-context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/auth";
import { authApi } from "../lib/api";

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
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

  // ✅ Check and restore existing session
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("banking-user");
      const token = localStorage.getItem("banking-token");

      // Restore saved user instantly for smoother UX
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("banking-user");
        }
      }

      // Then validate token silently
      if (token) {
        try {
          const response = await authApi.validateToken();

          // Expecting: { success: true, user: {...} }
          if (response?.success && response?.user) {
            setUser(response.user);
            localStorage.setItem("banking-user", JSON.stringify(response.user));
          } else {
            localStorage.removeItem("banking-token");
            localStorage.removeItem("banking-user");
            setUser(null);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("banking-token");
          localStorage.removeItem("banking-user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Login handler
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ username, password });

      if (response.token && response.user) {
        localStorage.setItem("banking-token", response.token);
        localStorage.setItem("banking-user", JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }

      return { success: false, error: response.error || "Invalid credentials" };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: "Network or server error" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register handler
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
      }

      return { success: false, error: response.error || "Registration failed" };
    } catch (error: any) {
      console.error("Register error:", error);
      return { success: false, error: "Network or server error" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("banking-token");
      localStorage.removeItem("banking-user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
