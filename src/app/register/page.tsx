"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { key: "name", label: "Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "password", label: "Password", type: "password" },
    {
      key: "confirmPassword",
      label: "Confirm password",
      type: "password",
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create account
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        {fields.map(({ key, label, type }) => (
          <input
            key={key}
            type={type}
            placeholder={label}
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            className="
              w-full
              mb-4
              px-4
              py-3
              rounded-lg
              bg-black
              border
              border-zinc-700
              text-white
              placeholder:text-gray-500
              focus:outline-none
              focus:border-white
            "
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            mt-2
            px-6
            py-3
            rounded-lg
            bg-white
            text-black
            font-medium
            hover:bg-gray-200
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}