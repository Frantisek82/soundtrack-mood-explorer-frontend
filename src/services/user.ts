import { getAuthHeaders } from "@/src/utils/auth";

const API_URL = "http://localhost:3000/api/user/me";

export async function getCurrentUser() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export async function updatePassword(password: string) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
}

export async function deleteAccount() {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete account");
  }
}
