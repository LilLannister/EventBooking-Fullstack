import Link from "next/link";
import BookTicketButton from "@/components/events/BookTicketButton";

async function getEvent(id) {
  const response = await fetch(`http://localhost:3000/api/events/${id}`, {
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("EVENT_DETAIL_FETCH_ERROR:", data);
    return null;
  }
  return data.event;
}

export default async function EventDetailPage({ params }) {
    const { id } = await params;
    const data = await getEvent(id);
    const event = data;

    if (!event) {
        return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
                Event could not be found
            </h1>
            <p className="mt-3 text-slate-600">
                The event may have been deleted or the database may have been reset.
            </p>
            <Link
                href="/events"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
                Back to Events
            </Link>
            </section>
        </main>
        );
    }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {event.category?.name || "General"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              Capacity: {event.capacity}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {event.description}
          </p>

          <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Date:</span>{" "}
              {new Date(event.eventDate).toLocaleString()}
            </p>

            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Category:</span>{" "}
              {event.category?.name || "General"}
            </p>

            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Organiser:</span>{" "}
              {event.organiser?.name || "Unknown"}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <BookTicketButton eventId={event.id} />

            <Link
              href="/events"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}