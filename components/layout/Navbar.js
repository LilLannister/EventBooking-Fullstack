"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/frontend/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        function syncUser() {
            setUser(getUser());
        }
        syncUser();
        setMounted(true);

        window.addEventListener("authChange", syncUser);

        return () => {
            window.removeEventListener("authChange", syncUser);
        };
    }, []);

    function handleLogout() {
        logout();
        setUser(null);
        router.push("/login");
    }

    function navLinkClass(path) {
        const isActive =
            mounted && (pathname === path || pathname.startsWith(`${path}/`));

        return isActive
            ? "font-semibold text-blue-700"
            : "text-slate-700 hover:text-blue-700";
    }

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-lg font-bold text-slate-900">
                    EventBooking
                </Link>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link href="/events" className={navLinkClass("/events")}>
                        Events
                    </Link>

                    {user?.role === "ORGANISER" && (
                        <Link
                            href="/organiser/events"
                            className={navLinkClass("/organiser/events")}
                        >
                            My Events
                        </Link>
                    )}

                    {user?.role === "ATTENDEE" && (
                        <Link
                            href="/my-bookings"
                            className={navLinkClass("/my-bookings")}
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
                            <Link href="/login" className={navLinkClass("/login")}>
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