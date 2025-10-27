// src/lib/api.ts
// -----------------------------------------------------------
// Universal API helper for the React frontend
// - Uses import.meta.env.VITE_API_URL or defaults to http://localhost:8080
// - Handles JSON automatically and includes JWT token if present
// - Groups requests under authApi, customerApi, dashboardApi, transactionApi
// -----------------------------------------------------------

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8080";

/**
 * Generic API request helper.
 * Automatically stringifies objects, adds token, and handles errors.
 */
async function apiRequest(endpoint: string, options: any = {}): Promise<any> {
  const token = localStorage.getItem("banking-token");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ✅ Include JWT in Authorization header if available
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
  };

  // handle body
  if (options.body !== undefined && options.body !== null) {
    if (typeof FormData !== "undefined" && options.body instanceof FormData) {
      (config as any).body = options.body;
      delete (config.headers as Record<string, string>)["Content-Type"];
    } else if (typeof options.body === "string") {
      (config as any).body = options.body;
    } else {
      (config as any).body = JSON.stringify(options.body);
    }
  }

  // merge extra fetch options
  const leftover = { ...options };
  delete leftover.body;
  delete leftover.method;
  delete leftover.headers;
  Object.assign(config, leftover);

  // Ensure only one "/api" prefix total
  const url =
    API_BASE_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`);

  const res = await fetch(url, config);
  const text = await res.text();
  let payload: any = text;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    // not JSON, keep as text
  }

  if (!res.ok) {
    const error: any = new Error(
      payload?.error || payload?.message || `HTTP ${res.status}`
    );
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

// -----------------------------------------------------------
// AUTH API
// -----------------------------------------------------------
export const authApi = {
  login: async (data: { username: string; password: string }) =>
    apiRequest("/api/auth/login", { method: "POST", body: data }),

  logout: async () => apiRequest("/api/auth/logout", { method: "POST" }),

  register: async (data: {
    username: string;
    password: string;
    email?: string;
    fullName?: string;
  }) => apiRequest("/api/auth/register", { method: "POST", body: data }),

  // ✅ Updated to send Authorization header with token
  validateToken: async () => {
    const token = localStorage.getItem("banking-token");
    if (!token) throw new Error("No JWT token found");
    return apiRequest("/api/auth/validate-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// -----------------------------------------------------------
// CUSTOMER API
// -----------------------------------------------------------
export const customerApi = {
  getAll: async () => apiRequest("/customers"),
  getOne: async (id: string) => apiRequest(`/customers/${id}`),
  create: async (data: Record<string, any>) =>
    apiRequest("/customers/create", { method: "POST", body: data }),
  update: async (id: string, data: Record<string, any>) =>
    apiRequest(`/customers/update/${id}`, { method: "PUT", body: data }),
  delete: async (id: string) =>
    apiRequest(`/customers/delete/${id}`, { method: "DELETE" }),
};

// -----------------------------------------------------------
// DASHBOARD API
// -----------------------------------------------------------
export const dashboardApi = {
  getDashboardData: async () => apiRequest("/dashboard"),
};

// -----------------------------------------------------------
// TRANSACTION API
// -----------------------------------------------------------
export const transactionApi = {
  deposit: async (data: { accountNumber: string; amount: number }) =>
    apiRequest("/transactions/deposit", { method: "POST", body: data }),

  withdraw: async (data: { accountNumber: string; amount: number }) =>
    apiRequest("/transactions/withdraw", { method: "POST", body: data }),

  transfer: async (data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) => apiRequest("/transactions/transfer", { method: "POST", body: data }),

  getHistory: async () => apiRequest("/transactions/history"),
};

// -----------------------------------------------------------
// Default export (optional convenience)
// -----------------------------------------------------------
export default {
  authApi,
  customerApi,
  dashboardApi,
  transactionApi,
};
