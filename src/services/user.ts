const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/* =====================
   Get current user
===================== */

export async function getCurrentUser() {
  const res = await fetch(API_URL, {
    credentials: "include", // cookie-based auth
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

/* =====================
   Update password
===================== */

export async function updatePassword(password: string) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
}

/* =====================
   Delete account
===================== */

export async function deleteAccount() {
  const res = await fetch(API_URL, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete account");
  }
}
