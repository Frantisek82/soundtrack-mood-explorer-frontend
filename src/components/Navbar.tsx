"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/src/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isAuthenticated());
  }, [pathname]);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    router.push("/login");
  }

  const linkClass = (path: string) =>
    pathname.startsWith(path)
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white transition";

  // ⛔ Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Soundtrack Mood Explorer
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/explore" className={linkClass("/explore")}>
            Explore
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>

          {loggedIn ? (
            <>
              <Link href="/favorites" className={linkClass("/favorites")}>
                Favorites
              </Link>

              <Link href="/profile" className={linkClass("/profile")}>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
