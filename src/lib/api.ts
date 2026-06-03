// Client-side API helper. Stores the JWT in localStorage and attaches it as a
// Bearer token on every request. Base URL is overridable via VITE_API_URL.

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://staff-app-api-gvq3.onrender.com/api";

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export type AuthUser = {
  id: number;
  username: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
  area: string | null;
};

/* ---- token storage ---- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/* ---- core request helper ---- */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Pulls a human-readable message out of the various error shapes the API
// returns: validation `{ message: string[] }`, `{ error }`, or `{ en, ar }`.
function extractErrorMessage(body: any): string | null {
  if (!body || typeof body !== "object") return null;
  if (Array.isArray(body.message)) return body.message.join(", ");
  return body.message || body.en || body.error || null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Token expired or invalid — drop it so the app can re-auth.
    clearAuth();
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      extractErrorMessage(isJson ? body : null) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

/* ---- auth endpoints ---- */

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  setToken(data.accessToken);
  setStoredUser(data.user);
  return data;
}

export function logout(): void {
  clearAuth();
}

/* ---- users ---- */

export type ApiUser = {
  id: number;
  role: string;
  user: { id: number; username: string };
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  deviceId: string | null;
  area: string | null;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type Role = "ADMIN" | "STAFF";

export function getUsers(): Promise<Paginated<ApiUser>> {
  return apiFetch<Paginated<ApiUser>>("/users");
}

export function createUser(input: {
  username: string;
  password: string;
  role: Role;
}): Promise<ApiUser> {
  return apiFetch<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resetUserPassword(
  userId: string | number,
  password: string,
): Promise<ApiUser> {
  return apiFetch<ApiUser>(`/users/reset-password/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
}

export function deleteUser(
  userId: string | number,
): Promise<{ deletedCount: number; id: number }> {
  return apiFetch(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export function bulkDeleteUsers(ids: number[]): Promise<{ deletedCount: number }> {
  return apiFetch("/users/bulk-delete", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
}

/* ---- activity logs ---- */

export type ActivityLog = {
  id: number;
  eventType: string;
  actor: { id: number; username: string } | null;
  cardSerial: string | null;
  deviceId: string | null;
  area: string | null;
  authorized: boolean | null;
  reason: string | null;
  targetUserId: number | null;
  createdAt: string;
};

export function getActivityLogs(userId: string | number): Promise<Paginated<ActivityLog>> {
  return apiFetch<Paginated<ActivityLog>>(
    `/activity-logs?userId=${encodeURIComponent(userId)}`,
  );
}
