"use client";

import { useState, useTransition } from "react";
import type { Blog } from "@/types/database";
import { ImageField } from "@/components/admin/image-field";

export function BlogForm({
  blog,
  action,
}: {
  blog?: Blog;
  action: (formData: FormData) => Promise<{ error: string | null } | void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
      else setError(null);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <ImageField bucket="blog" label="Cover Image" name="cover_image" defaultValue={blog?.cover_image} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="eyebrow mb-2 block">Title</label>
          <input
            name="title"
            defaultValue={blog?.title}
            required
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block">Slug</label>
          <input
            name="slug"
            defaultValue={blog?.slug}
            placeholder="auto-generated from title"
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="eyebrow mb-2 block">Excerpt</label>
        <textarea
          name="excerpt"
          defaultValue={blog?.excerpt ?? ""}
          rows={2}
          className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
        />
      </div>

      <div>
        <label className="eyebrow mb-2 block">Content (HTML)</label>
        <textarea
          name="content"
          defaultValue={blog?.content ?? ""}
          rows={14}
          className="w-full border border-white/15 bg-obsidian-raised p-3 font-mono text-sm text-white focus:border-white focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" name="published" defaultChecked={blog?.published} className="accent-white" />
        Published
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="border border-white/50 px-8 py-3 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian disabled:opacity-50"
      >
        {isPending ? "Saving…" : blog ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
