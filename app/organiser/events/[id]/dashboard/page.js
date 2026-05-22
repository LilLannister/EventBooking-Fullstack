"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, getUser } from "@/lib/frontend/auth";

export default function OrganiserDashboardPage({ params }) {
    const [dashboard, setDashboard] = useState(null);
    const [eventId, setEventId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            const resolvedParams = await params;
            const id = resolvedParams.id;
            setEventId(id);

            const token = getToken();
            const user = getUser();

            if (!token || !user || user.role !== "ORGANISER") {
                setError("Only organisers can access this dashboard.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/organiser/events/${id}/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load dashboard.");
                    return;
                }

                setDashboard(data.dashboard);
            } catch (error) {
                setError("Something went wrong while loading dashboard.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [params]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
                <section className="mx-auto max-w-6xl">
                    <p className="text-slate-600">Loading dashboard...</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
                <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard unavailable
                    </h1>
                    <p className="mt-3 text-slate-600">{error}</p>

                    <Link
                        href="/organiser/events"
                        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Back to My Events
                    </Link>
                </section>
            </main>
        );
    }

    const capacity = dashboard.capacity || 0;
    const soldTickets = dashboard.soldTickets || 0;
    const availableTickets = dashboard.availableTickets || 0;
    const usageRate =
        capacity > 0 ? Math.round((soldTickets / capacity) * 100) : 0;
    const isSoldOut = availableTickets === 0;

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                            Organiser Dashboard
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">
                                {dashboard.eventTitle}
                            </h1>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${isSoldOut
                                    ? "bg-red-50 text-red-700"
                                    : "bg-green-50 text-green-700"
                                    }`}
                            >
                                {isSoldOut ? "Sold Out" : "Active"}
                            </span>
                        </div>
                        <p className="mt-2 text-slate-600">
                            Monitor ticket sales and attendee information for this event.
                        </p>
                    </div>

                    <Link
                        href="/organiser/events"
                        className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Back to My Events
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Capacity</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {capacity}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Sold Tickets</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {soldTickets}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Available Tickets
                        </p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {availableTickets}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Usage</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {usageRate}%
                        </p>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Capacity Usage
                            </h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Percentage of available seats already booked.
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-700">
                                {soldTickets} / {capacity} seats booked
                            </p>
                        </div>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${usageRate}%` }}
                        />
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">Attendee List</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Confirmed attendees for this event.
                    </p>

                    {dashboard.attendees.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                            <p className="font-medium text-slate-900">No attendees yet</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Attendees will appear here after booking tickets.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Name</th>
                                        <th className="px-4 py-3 font-semibold">Email</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {dashboard.attendees.map((attendee) => (
                                        <tr key={attendee.id}>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {attendee.name}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {attendee.email}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}