"use client";

import { useEffect, useState } from "react";
import { getToken, getUser } from "@/lib/frontend/auth";

export default function BookTicketButton({ eventId, soldOut = false }) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        async function checkExistingBooking() {
            const token = getToken();
            const user = getUser();

            if (!token || !user || user.role !== "ATTENDEE") {
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
                    return;
                }

                const alreadyBooked = (data.bookings || []).some(
                    (booking) =>
                        booking.status === "CONFIRMED" &&
                        (booking.eventId === eventId || booking.event?.id === eventId)
                );

                if (alreadyBooked) {
                    setBooked(true);
                    setError("");
                    setMessage("");
                }
            } catch (error) {
                // silently ignore check failure
            }
        }

        checkExistingBooking();
    }, [eventId]);

    async function handleBooking() {
        setMessage("");
        setError("");

        if (soldOut) {
            setError("This event is already sold out.");
            return;
        }

        const token = getToken();
        const user = getUser();

        if (!token || !user) {
            setError("Please login as an attendee to book a ticket.");
            return;
        }

        if (user.role !== "ATTENDEE") {
            setError("Only attendees can book tickets.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/events/${eventId}/bookings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Booking failed.");
                return;
            }

            setMessage("Ticket booked successfully.");
            setBooked(true);

        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-start">
            <button
                onClick={handleBooking}
                disabled={loading || booked || soldOut}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {soldOut ? "Sold Out" : loading ? "Booking..." : booked ? "Booked" : "Book Ticket"}
            </button>

            {message && (
                <p className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}