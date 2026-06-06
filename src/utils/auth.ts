const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/* =====================
   Check authentication (server-based)
===================== */

export async function isAuthenticated(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}

/* =====================
   Logout (server-based)
===================== */

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
