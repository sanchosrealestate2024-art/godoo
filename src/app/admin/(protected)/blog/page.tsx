import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: blogs } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="border border-white/50 px-5 py-2 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {(blogs ?? []).map((post) => (
          <Link
            key={post.id}
            href={`/admin/blog/${post.id}`}
            className="flex items-center justify-between border border-white/10 bg-obsidian-raised p-4 hover:border-white/30"
          >
            <div>
              <p className="text-sm text-white">{post.title}</p>
              <p className="mt-1 text-xs text-white/50">{post.author}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs uppercase ${
                post.published ? "bg-white/20 text-white" : "bg-obsidian-panel/5 text-white/40"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {(blogs ?? []).length === 0 && <p className="mt-10 text-center text-white/50">No posts yet.</p>}
      </div>
    </div>
  );
}
