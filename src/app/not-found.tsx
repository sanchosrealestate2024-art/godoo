import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl text-white md:text-5xl">Page Not Found</h1>
      <Link
        href="/"
        className="mt-8 border border-white/50 px-6 py-3 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian"
      >
        Return Home
      </Link>
    </main>
  );
}
