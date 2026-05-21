"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/frontend/auth";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    setError("");

    const token = getToken();

    if (!token) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load bookings.");
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      setError("Something went wrong while loading bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <p className="text-slate-600">Loading bookings...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-2 text-slate-600">
            View your booked event tickets.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Browse events and book your first ticket.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse Events
            </Link>
          </div>
        )}

        {!error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {booking.event?.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {new Date(booking.event?.eventDate).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      Status: {booking.status}
                    </p>
                  </div>

                  <Link
                    href={`/events/${booking.event?.id}`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View Event
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}