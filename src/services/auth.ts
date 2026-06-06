const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
   Login (cookie-based)
===================== */

export async function loginUser(data: LoginData): Promise<void> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // VERY IMPORTANT
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Invalid credentials");
  }

  // No localStorage anymore
  // Cookie is set automatically by browser
}

/* =====================
   Logout (API-based)
===================== */

export async function logoutUser(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // send cookie
  });
}
