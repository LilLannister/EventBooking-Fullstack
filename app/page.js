"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/frontend/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setMounted(true);
  }, []);
  
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Event Booking & Ticketing Platform
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Discover events, book tickets, and manage your audience.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A full-stack web application for attendees and organisers, built with
          Next.js, Prisma, authentication, role-based access control, and
          responsive UI.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {!user && (
            <>
              <Link href="/events" className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">
                Browse Events
              </Link>

              <Link href="/login" className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                Login
              </Link>
            </>
          )}

          {user?.role === "ATTENDEE" && (
            <>
              <Link href="/events" className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">
                Browse Events
              </Link>

              <Link href="/my-bookings" className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                My Bookings
              </Link>
            </>
          )}

          {user?.role === "ORGANISER" && (
            <>
              <Link href="/organiser/events" className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">
                My Events
              </Link>

              <Link href="/organiser/events/create" className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                Create Event
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}