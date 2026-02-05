const API_URL = "http://localhost:3000/api";

/* =====================
   Types
===================== */

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

/* =====================
   Register
===================== */

export async function registerUser(data: RegisterData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
}

/* =====================
   Login
===================== */

export async function loginUser(data: LoginData): Promise<void> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Invalid credentials");
  }

  // 🔑 THIS WAS MISSING — THE CORE BUG
  localStorage.setItem("token", result.token);
}

/* =====================
   Logout
===================== */

export function logoutUser(): void {
  localStorage.removeItem("token");
}
