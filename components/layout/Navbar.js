import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          EventBooking
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/events" className="text-slate-600 hover:text-slate-900">
            Events
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}