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

  // Ensure no duplicate slashes
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
  login: (data: { username: string; password: string }) =>
    apiRequest("/api/auth/login", { method: "POST", body: data }),

  logout: () => apiRequest("/api/auth/logout", { method: "POST" }),

  register: (data: {
    username: string;
    password: string;
    email?: string;
    fullName?: string;
  }) => apiRequest("/api/auth/register", { method: "POST", body: data }),

  validateToken: () => {
    const token = localStorage.getItem("banking-token");
    if (!token) throw new Error("No JWT token found");
    return apiRequest("/api/auth/validate-token", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// -----------------------------------------------------------
// CUSTOMER API
// -----------------------------------------------------------
export const customerApi = {
  getAll: () => apiRequest("/api/customers"),
  getOne: (id: string) => apiRequest(`/api/customers/${id}`),
  create: (data: Record<string, any>) =>
    apiRequest("/api/customers/create", { method: "POST", body: data }),
  update: (id: string, data: Record<string, any>) =>
    apiRequest(`/api/customers/update/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    apiRequest(`/api/customers/delete/${id}`, { method: "DELETE" }),
};

// -----------------------------------------------------------
// ACCOUNT API
// -----------------------------------------------------------
export const accountApi = {
  createAccount: (data: { accountType: string; initialDeposit: number }) =>
    apiRequest("/api/accounts/create", { method: "POST", body: data }),

  getAllAccounts: () => apiRequest("/api/accounts"),
  getAccountById: (id: string) => apiRequest(`/api/accounts/${id}`),
};

// -----------------------------------------------------------
// DASHBOARD API
// -----------------------------------------------------------
export const dashboardApi = {
  getDashboardData: () => apiRequest("/api/dashboard"),
};

// -----------------------------------------------------------
// TRANSACTION API
// -----------------------------------------------------------
export const transactionApi = {
  deposit: (data: { accountNumber: string; amount: number }) =>
    apiRequest("/api/transactions/deposit", { method: "POST", body: data }),

  withdraw: (data: { accountNumber: string; amount: number }) =>
    apiRequest("/api/transactions/withdraw", { method: "POST", body: data }),

  transfer: (data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) =>
    apiRequest("/api/transactions/transfer", { method: "POST", body: data }),

  getHistory: () => apiRequest("/api/transactions/history"),
};

// -----------------------------------------------------------
// PROFILE API
// -----------------------------------------------------------
export const profileApi = {
  getProfile: () => apiRequest("/api/profile"),
  updateProfile: (data: Record<string, any>) =>
    apiRequest("/api/profile", { method: "PUT", body: data }),
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
