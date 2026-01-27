"use client";

import { useState } from "react";
import { loginUser } from "@/src/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const res = await loginUser({ email, password });

    // Store token (simple version)
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    router.push("/explore");
  } catch (err: any) {
    alert(err.message);
  }
}

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black border border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-black border border-zinc-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-white text-black py-3 rounded font-medium">
          Login
        </button>
      </form>
    </main>
  );
}
