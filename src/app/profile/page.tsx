"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/src/utils/auth";
import { updatePassword, deleteAccount } from "@/src/services/user";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import Button from "@/src/components/Button";

export default function ProfilePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
     Focus feedback message
  ===================== */
  useEffect(() => {
    if (message) {
      messageRef.current?.focus();
    }
  }, [message]);

  if (!mounted) return null;

  /* =====================
     Update password
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

      await updatePassword(password);

      setPassword("");
      setConfirmPassword("");

      setMessage("Password updated successfully.");
      setMessageType("success");
    } catch (err: any) {
      setMessage(err.message || "Failed to update password.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     Confirm Delete Account
  ===================== */
  async function handleDeleteAccount() {
    try {
      setDeleteLoading(true);

      await deleteAccount();

      logout();
      router.push("/");

    } catch {
      alert("Failed to delete account.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  }

  /* =====================
     UI
  ===================== */
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your account settings.
        </p>
      </header>

      {/* Password Card */}
      <section className="bg-zinc-900 rounded-xl p-6">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm mb-1">
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
            <label htmlFor="confirm-password" className="block text-sm mb-1">
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

          {message && (
            <p
              ref={messageRef}
              tabIndex={-1}
              role={messageType === "error" ? "alert" : "status"}
              aria-live={
                messageType === "error" ? "assertive" : "polite"
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

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            Update Password
          </Button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="mt-8 border-t border-zinc-800 pt-6 space-y-4">
        <Button
          variant="danger"
          onClick={() => setShowDeleteDialog(true)}
          className="w-full"
        >
          Delete Account
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full"
        >
          Logout
        </Button>
      </section>

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Account"
        description="This action will permanently delete your account and all associated data, including your saved favorites. This cannot be undone."
        confirmLabel="Yes, Delete Account"
        cancelLabel="Cancel"
        loading={deleteLoading}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
      />
    </main>
  );
}
