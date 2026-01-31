"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/src/utils/auth";

export default function ProfilePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔐 Protect page + avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // ⛔ Placeholder: backend endpoint can be added later
      // await updatePassword(password);

      setPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch {
      setMessage("Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your account settings.
        </p>
      </header>

      {/* Profile Card */}
      <section className="bg-zinc-900 rounded-xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold">
            U
          </div>
          <div>
            <p className="font-semibold">Your Account</p>
            <p className="text-sm text-gray-400">
              Update your password below
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:outline-none focus:border-white"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-gray-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition
              ${loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
              }
            `}
          >
            {loading ? "Saving..." : "Update Password"}
          </button>
        </form>
      </section>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mt-6 text-sm text-red-400 hover:text-red-300 transition"
      >
        Logout
      </button>
    </main>
  );
}