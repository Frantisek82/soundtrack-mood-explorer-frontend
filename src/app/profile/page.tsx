"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/src/utils/auth";
import Button from "@/src/components/Button";

export default function ProfilePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "error" | "success" | null
  >(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const messageRef = useRef<HTMLParagraphElement>(null);

  /* =====================
     Protect page
  ===================== */
  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  /* =====================
     Focus message
  ===================== */
  useEffect(() => {
    if (message) {
      messageRef.current?.focus();
    }
  }, [message]);

  if (!mounted) {
    return null;
  }

  /* =====================
     Handlers
  ===================== */
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      // 🔧 Placeholder for future backend integration
      // await updatePassword(password);

      setPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
      setMessageType("success");
    } catch {
      setMessage("Failed to update password.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     UI
  ===================== */
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
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
          <div
            className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold"
            aria-hidden="true"
          >
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
            <label
              htmlFor="new-password"
              className="block text-sm mb-1"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-white"
              required
            />
          </div>

          {/* Feedback message */}
          {message && (
            <p
              ref={messageRef}
              tabIndex={-1}
              role={
                messageType === "error"
                  ? "alert"
                  : "status"
              }
              aria-live={
                messageType === "error"
                  ? "assertive"
                  : "polite"
              }
              className={`text-sm outline-none ${
                messageType === "error"
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}

          {/* Update password */}
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            aria-disabled={loading}
            className="w-full mt-4"
          >
            Update Password
          </Button>
        </form>
      </section>

      {/* Logout */}
      <div className="mt-6">
        <Button
          variant="danger"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </main>
  );
}
