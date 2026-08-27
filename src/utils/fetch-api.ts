export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "") || "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE}${normalizedEndpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...fetchOptions, headers });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage: string;
    try {
      const parsed = JSON.parse(errorBody);
      errorMessage = parsed.message || parsed.title || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const fetchApi = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
