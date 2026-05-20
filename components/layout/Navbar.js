"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/frontend/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          EventBooking
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/events" className="text-slate-600 hover:text-slate-900">
            Events
          </Link>

          {user?.role === "ORGANISER" && (
            <Link
              href="/organiser/events"
              className="text-slate-600 hover:text-slate-900"
            >
              My Events
            </Link>
          )}

          {user?.role === "ATTENDEE" && (
            <Link
              href="/my-bookings"
              className="text-slate-600 hover:text-slate-900"
            >
              My Bookings
            </Link>
          )}

          {user ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:inline">
                {user.role}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}