"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/frontend/auth";

export default function EditEventPage({ params }) {
    const router = useRouter();

    const [eventId, setEventId] = useState("");
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        capacity: "",
        categoryId: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    function formatDateTimeLocal(dateValue) {
        const date = new Date(dateValue);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        return localDate.toISOString().slice(0, 16);
    }

    useEffect(() => {
        async function loadPageData() {
            const resolvedParams = await params;
            const id = resolvedParams.id;
            setEventId(id);

            const token = getToken();
            const user = getUser();

            if (!token || !user || user.role !== "ORGANISER") {
                setError("Only organisers can edit events.");
                setPageLoading(false);
                return;
            }

            try {
                const [eventResponse, categoriesResponse] = await Promise.all([
                    fetch(`/api/events/${id}`),
                    fetch("/api/categories"),
                ]);

                const eventData = await eventResponse.json();
                const categoriesData = await categoriesResponse.json();

                if (!eventResponse.ok) {
                    setError(eventData.message || "Failed to load event.");
                    return;
                }

                if (!categoriesResponse.ok) {
                    setError(categoriesData.message || "Failed to load categories.");
                    return;
                }

                const event = eventData.event;

                setCategories(categoriesData.categories || []);

                setFormData({
                    title: event.title || "",
                    description: event.description || "",
                    eventDate: event.eventDate
                        ? formatDateTimeLocal(event.eventDate)
                        : "",
                    capacity: String(event.capacity || ""),
                    categoryId: event.category?.id || "",
                });
            } catch (error) {
                setError("Something went wrong while loading the edit form.");
            } finally {
                setPageLoading(false);
            }
        }

        loadPageData();
    }, [params]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const token = getToken();

        if (
            !formData.title ||
            !formData.description ||
            !formData.eventDate ||
            !formData.capacity ||
            !formData.categoryId
        ) {
            setError("All fields are required.");
            return;
        }

        if (Number(formData.capacity) <= 0) {
            setError("Capacity must be greater than 0.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    eventDate: formData.eventDate, 
                    capacity: Number(formData.capacity),
                    categoryId: formData.categoryId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to update event.");
                return;
            }

            router.push("/organiser/events");
        } catch (error) {
            setError("Something went wrong while updating the event.");
        } finally {
            setLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
                <section className="mx-auto max-w-3xl">
                    <p className="text-slate-600">Loading edit event form...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
                    <p className="mt-2 text-slate-600">
                        Update your event information.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                >
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Date and Time
                            </label>
                            <input
                                name="eventDate"
                                type="datetime-local"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Capacity
                            </label>
                            <input
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Category
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {loading ? "Updating..." : "Update Event"}
                    </button>
                </form>
            </section>
        </main>
    );
}