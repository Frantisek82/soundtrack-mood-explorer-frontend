"use client";

import { useState } from "react";
import { registerUser } from "@/src/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // inside component
const router = useRouter();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    alert("Registration successful");
    router.push("/login");
  } catch (err: any) {
    alert(err.message);
  }
}

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Register</h1>
        <p className="text-gray-400">
          Create a new account.
        </p>
      </header>
      <form className="bg-zinc-900 p-8 rounded-xl w-full max-w-md">

        {["name", "email", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : "text"}
            placeholder={field}
            className="w-full mb-4 p-3 rounded bg-black border border-zinc-700"
            value={(form as any)[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition">
          Create Account
        </button>
      </form>
    </main>
  );
}
