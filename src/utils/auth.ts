/**
 * Returns Authorization headers for authenticated requests
 */
export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token"));
}

/**
 * Log the user out
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}
