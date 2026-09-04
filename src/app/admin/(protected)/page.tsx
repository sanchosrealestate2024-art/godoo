import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: projects }, { count: published }, { count: drafts }, { count: messages }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", false),
      supabase.from("contacts").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);

  const cards = [
    { label: "Total Projects", value: projects ?? 0, href: "/admin/projects" },
    { label: "Published", value: published ?? 0, href: "/admin/projects" },
    { label: "Drafts", value: drafts ?? 0, href: "/admin/projects" },
    { label: "New Messages", value: messages ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-white/50">Overview of the GODOO CMS.</p>

      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-white/10 bg-obsidian-raised p-6 transition-colors hover:border-white/40"
          >
            <p className="font-display text-4xl text-white">{c.value}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-white/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/admin/projects/new"
          className="border border-white/50 px-6 py-3 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian"
        >
          + New Project
        </Link>
      </div>
    </div>
  );
}
