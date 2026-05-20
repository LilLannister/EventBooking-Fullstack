async function getEvents() {
  const response = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export default async function EventsPage() {
  const data = await getEvents();
  const events = data.events || [];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="mt-2 text-slate-600">
            Browse available events and book your ticket.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No events available
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {new Date(event.eventDate).toLocaleString()}
                </p>

                <a
                  href={`/events/${event.id}`}
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Details
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}