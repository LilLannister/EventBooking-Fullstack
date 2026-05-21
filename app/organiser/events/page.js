"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, getUser } from "@/lib/frontend/auth";

export default function OrganiserEventsPage() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function deleteEvent(eventId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        const token = getToken();

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to delete event.");
                return;
            }

            setEvents((prev) =>
                prev.filter((event) => event.id !== eventId)
            );
        } catch (error) {
            setError("Something went wrong while deleting event.");
        }
    }

    async function fetchEvents() {
        const token = getToken();
        const user = getUser();

        if (!token || !user) {
            setError("Please login as an organiser.");
            setLoading(false);
            return;
        }

        if (user.role !== "ORGANISER") {
            setError("Only organisers can access this page.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to load events.");
                return;
            }

            const organiserEvents = (data.events || []).filter(
                (event) => event.organiser?.id === user.id
            );

            setEvents(organiserEvents);
        } catch (error) {
            setError("Something went wrong while loading organiser events.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
                <section className="mx-auto max-w-6xl">
                    <p className="text-slate-600">Loading organiser events...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Events</h1>
                        <p className="mt-2 text-slate-600">
                            Manage the events you created as an organiser.
                        </p>
                    </div>

                    <Link
                        href="/organiser/events/create"
                        className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Create Event
                    </Link>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {!error && events.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No events created yet
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Create your first event to start accepting bookings.
                        </p>
                    </div>
                )}

                {!error && events.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {events.map((event) => (
                            <article
                                key={event.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {event.category?.name || "General"}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Capacity: {event.capacity}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {event.title}
                                </h2>

                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                                    {event.description}
                                </p>

                                <p className="mt-4 text-sm font-medium text-slate-700">
                                    {new Date(event.eventDate).toLocaleString()}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/organiser/events/${event.id}/dashboard`}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href={`/organiser/events/${event.id}/edit`}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}