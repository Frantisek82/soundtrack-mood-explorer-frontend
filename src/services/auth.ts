const API_URL = "http://localhost:3000/api";

/**
 * Login user
 * - Sends credentials so backend can set auth cookie
 * - Stores JWT in localStorage for Authorization headers
 */
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⭐ REQUIRED for cookies
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();

  // Save token for API calls (headers)
  localStorage.setItem("token", data.token);

  return data;
}

/**
 * Register user
 */
export async function registerUser(
  email: string,
  password: string
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
}

/**
 * Logout user
 * - Clears local token
 * - Cookie is cleared by backend/proxy logic
 */
export function logoutUser() {
  localStorage.removeItem("token");
}
