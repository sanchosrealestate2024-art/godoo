"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/utils";

export function ProjectsFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="mt-10 flex flex-col gap-4 border-y border-white/10 py-6 md:flex-row md:items-center md:justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: search || null });
        }}
        className="flex items-center gap-3 border-b border-white/20 pb-2 md:w-72"
      >
        <Search size={16} className="text-white/50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600/40 focus:outline-none"
        />
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={searchParams.get("category") ?? "all"}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="border border-white/20 bg-obsidian px-3 py-2 text-xs uppercase tracking-wide text-white/70 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="border border-white/20 bg-obsidian px-3 py-2 text-xs uppercase tracking-wide text-white/70 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title_asc">Title A–Z</option>
          <option value="title_desc">Title Z–A</option>
        </select>
      </div>
      {isPending && <span className="sr-only">Loading…</span>}
    </div>
  );
}
