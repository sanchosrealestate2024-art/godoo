import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProjectRowActions } from "./project-row-actions";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="border border-white/50 px-5 py-2 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian"
        >
          + New Project
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/50">
              <th className="py-3 pr-4">Cover</th>
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Published</th>
              <th className="py-3 pr-4">Featured</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  {p.cover_image ? (
                    <div className="relative h-12 w-16 overflow-hidden bg-obsidian-panel">
                      <Image src={p.cover_image} alt={p.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-16 bg-obsidian-panel" />
                  )}
                </td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/projects/${p.id}`} className="hover:text-white">
                    {p.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 capitalize text-white/70">{p.category ?? "—"}</td>
                <td className="py-3 pr-4 capitalize text-white/70">{p.status.replace("_", " ")}</td>
                <td className="py-3 pr-4">
                  <ProjectRowActions
                    projectId={p.id}
                    published={p.published}
                    featured={p.featured}
                    field="published"
                  />
                </td>
                <td className="py-3 pr-4">
                  <ProjectRowActions
                    projectId={p.id}
                    published={p.published}
                    featured={p.featured}
                    field="featured"
                  />
                </td>
                <td className="py-3 pr-4 text-right">
                  <Link href={`/admin/projects/${p.id}`} className="text-xs text-white hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(projects ?? []).length === 0 && (
          <p className="mt-10 text-center text-white/50">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
