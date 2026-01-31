/**
 * Get token from cookies
 */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

/**
 * Check authentication status
 * Syncs cookie → localStorage if needed
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const localToken = localStorage.getItem("token");
  const cookieToken = getTokenFromCookie();

  // 🔄 Sync cookie to localStorage
  if (!localToken && cookieToken) {
    localStorage.setItem("token", cookieToken);
    return true;
  }

  return Boolean(localToken);
}

/**
 * Login: save token in both places
 */
export function login(token: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);

  document.cookie = [
    `token=${token}`,
    "path=/",
    "SameSite=Lax",   // ✅ REQUIRED
  ].join("; ");
}


/**
 * Logout: clear both places
 */
export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
}


/**
 * Get token for API calls
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token") ?? getTokenFromCookie();
}
