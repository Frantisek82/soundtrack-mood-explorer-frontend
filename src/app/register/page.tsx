"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(form);
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form className="bg-zinc-900 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

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

        <button className="w-full bg-white text-black py-3 rounded font-medium">
          Create Account
        </button>
      </form>
    </main>
  );
}
