"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "@/src/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* =====================
  Check auth (ASYNC)
  ===================== */
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      setLoggedIn(isAuth);
    }

    checkAuth();

  }, [pathname]);

  /* =====================
  Logout
  ===================== */
  async function handleLogout() {
    console.log("Logout clicked");

    await logout();

    console.log("Logout request completed");

    setLoggedIn(false);
    setMenuOpen(false);

    console.log("Setting loggedIn=false");

    router.push("/login");
  }

  const linkClass = (path: string) =>
    pathname.startsWith(path)
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white transition";

  /* =====================
  Loading guard
  ===================== */
  if (loggedIn === null) {
    return null;
  }

  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg md:text-xl font-semibold text-zinc-200 hover:text-white transition" >
            Soundtrack Mood Explorer
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-zinc-200 text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
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
                  className="text-red-400 hover:text-red-300 transition cursor-pointer"
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

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4 text-center border-t border-zinc-800 pt-4">
            <Link
              href="/explore"
              className={linkClass("/explore")}
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>

            <Link
              href="/contact"
              className={linkClass("/contact")}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/favorites"
                  className={linkClass("/favorites")}
                  onClick={() => setMenuOpen(false)}
                >
                  Favorites
                </Link>

                <Link
                  href="/profile"
                  className={linkClass("/profile")}
                  onClick={() => setMenuOpen(false)}
                >
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
                <Link
                  href="/login"
                  className={linkClass("/login")}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={linkClass("/register")}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>

  );
}