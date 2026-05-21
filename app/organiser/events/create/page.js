"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/frontend/auth";

export default function CreateEventPage() {
  const router = useRouter();

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

  useEffect(() => {
    async function loadCategories() {
      const token = getToken();
      const user = getUser();

      if (!token || !user || user.role !== "ORGANISER") {
        setError("Only organisers can create events.");
        setPageLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load categories.");
          return;
        }

        setCategories(data.categories || []);

        if (data.categories?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data.categories[0].id,
          }));
        }
      } catch (error) {
        setError("Something went wrong while loading categories.");
      } finally {
        setPageLoading(false);
      }
    }

    loadCategories();
  }, []);

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

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          eventDate: new Date(formData.eventDate).toISOString(),
          capacity: Number(formData.capacity),
          categoryId: formData.categoryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create event.");
        return;
      }

      router.push("/organiser/events");
    } catch (error) {
      setError("Something went wrong while creating the event.");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
        <section className="mx-auto max-w-3xl">
          <p className="text-slate-600">Loading create event form...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create Event</h1>
          <p className="mt-2 text-slate-600">
            Add a new event for attendees to book.
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
                placeholder="Event title"
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
                placeholder="Event description"
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
                placeholder="100"
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
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </section>
    </main>
  );
}