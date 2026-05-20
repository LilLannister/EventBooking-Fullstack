import Link from "next/link";

export default function Home() {
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

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/events"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Browse Events
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}