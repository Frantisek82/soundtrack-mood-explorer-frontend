"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/src/utils/auth";
import {
  getCurrentUser,
  updatePassword,
  deleteAccount,
  type User,
} from "@/src/services/user";
import { getFavorites } from "@/src/services/favorites";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import Button from "@/src/components/Button";
import StatCard from "@/src/components/StatCard";
import {
  CalendarDaysIcon,
  StarIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteMood, setFavoriteMood] = useState("—");

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
     Protect page (ASYNC)
  ===================== */
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();

      if (!isAuth) {
        router.push("/login");
        return;
      }

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const favorites = await getFavorites();
      setFavoriteCount(favorites.length);

      const moodCounts: Record<string, number> = {};

      favorites.forEach((favorite) => {
        favorite.moods.forEach((mood: string) => {
          moodCounts[mood] = (moodCounts[mood] ?? 0) + 1;
        });
      });

      const mostCommonMood =
        Object.entries(moodCounts).sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] ?? "No favorites yet";

      setFavoriteMood(mostCommonMood);

      setAuthChecked(true);
    }

    checkAuth();
  }, [router]);

  /* =====================
     Focus feedback message
  ===================== */
  useEffect(() => {
    if (message) {
      messageRef.current?.focus();
    }
  }, [message]);

  /* =====================
     Loading guard
  ===================== */
  if (!authChecked) {
    return (
      <div className="p-12 flex justify-center">
        Loading...
      </div>
    );
  }

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
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update password.",
      );
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

      await logout(); // IMPORTANT
      router.push("/");

    } catch {
      alert("Failed to delete account.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  }

  /* =====================
     Logout
  ===================== */
  async function handleLogout() {
    await logout(); // IMPORTANT
    router.push("/login");
  }

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

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

      {/* Statistics */}
      <section
        aria-label="Profile statistics"
        className="grid gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard
          icon={CalendarDaysIcon}
          label="Member Since"
          value={memberSince}
        />

        <StatCard
          icon={StarIcon}
          label="Favorite Count"
          value={favoriteCount}
        />

        <StatCard
          icon={FaceSmileIcon}
          label="Most Common Mood"
          value={favoriteMood}
        />
      </section>

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
              className={`text-sm outline-none ${messageType === "error"
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
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </section>

      {/* Confirm Dialog */}
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