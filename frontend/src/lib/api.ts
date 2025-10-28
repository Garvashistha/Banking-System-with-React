// src/lib/api.ts
// -----------------------------------------------------------
// Universal API helper for the React frontend
// -----------------------------------------------------------

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8080";

/**
 * Generic API request helper
 */
async function apiRequest(endpoint: string, options: any = {}): Promise<any> {
  const token = localStorage.getItem("banking-token");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

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

  const leftover = { ...options };
  delete leftover.body;
  delete leftover.method;
  delete leftover.headers;
  Object.assign(config, leftover);

  // ✅ Ensure no duplicate slashes
  const url =
    API_BASE_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`);

  const res = await fetch(url, config);
  const text = await res.text();

  let payload: any = text;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    // not JSON
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
    apiRequest("/auth/login", { method: "POST", body: data }),

  logout: async () => apiRequest("/auth/logout", { method: "POST" }),

  register: async (data: {
    username: string;
    password: string;
    email?: string;
    fullName?: string;
  }) => apiRequest("/auth/register", { method: "POST", body: data }),

  validateToken: async () => {
    const token = localStorage.getItem("banking-token");
    if (!token) throw new Error("No JWT token found");
    return apiRequest("/auth/validate-token", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
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
// ACCOUNT API
// -----------------------------------------------------------
export const accountApi = {
  createAccount: async (data: { accountType: string; initialDeposit: number }) =>
    apiRequest("/accounts/create", { method: "POST", body: data }),

  getAllAccounts: async () => apiRequest("/accounts"),
  getAccountById: async (id: string) => apiRequest(`/accounts/${id}`),
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
// PROFILE API
// -----------------------------------------------------------
export const profileApi = {
  getProfile: async () => apiRequest("/profile"),
  updateProfile: async (data: Record<string, any>) =>
    apiRequest("/profile", { method: "PUT", body: data }),
};

// -----------------------------------------------------------
// Default export
// -----------------------------------------------------------
export default {
  authApi,
  customerApi,
  accountApi,
  dashboardApi,
  transactionApi,
  profileApi,
};
