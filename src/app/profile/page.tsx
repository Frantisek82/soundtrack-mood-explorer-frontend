"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/src/utils/auth";
import { logout } from "@/src/utils/auth";


export default function ProfilePage() {
  const [image, setImage] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        {/* Change Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-3 p-3 rounded bg-black border border-zinc-700"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-black border border-zinc-700"
          />
        </div>

        <button className="w-full bg-white text-black py-3 rounded font-medium">
          Save Changes
        </button>
        // inside JSX
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="mt-6 w-full bg-red-500 py-3 rounded font-medium"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
