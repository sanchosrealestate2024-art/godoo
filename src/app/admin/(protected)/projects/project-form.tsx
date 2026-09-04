"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/database";
import { CATEGORY_LABELS } from "@/lib/utils";
import { CoverImageUploader } from "./cover-image-uploader";

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<{ error: string | null } | void>;
}) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState(project?.cover_image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("cover_image", coverImage);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setError(null);
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <label className="eyebrow mb-2 block">Cover Image</label>
        <CoverImageUploader value={coverImage} onChange={setCoverImage} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Title" name="title" defaultValue={project?.title} required />
        <TextField label="Slug" name="slug" defaultValue={project?.slug} placeholder="auto-generated from title" />
      </div>

      <div>
        <label className="eyebrow mb-2 block">Description</label>
        <textarea
          name="description"
          defaultValue={project?.description ?? ""}
          rows={4}
          className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className="eyebrow mb-2 block">Category</label>
          <select
            name="category"
            defaultValue={project?.category ?? ""}
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          >
            <option value="">Select…</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow mb-2 block">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "draft"}
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="concept">Concept</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <TextField label="Year" name="year" type="number" defaultValue={project?.year ?? undefined} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Location" name="location" defaultValue={project?.location ?? ""} />
        <TextField label="Area" name="area" defaultValue={project?.area ?? ""} placeholder="e.g. 4,200 m²" />
        <TextField label="Client" name="client" defaultValue={project?.client ?? ""} />
        <TextField label="Architect" name="architect" defaultValue={project?.architect ?? ""} />
      </div>

      <div className="flex gap-8">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="published" defaultChecked={project?.published} className="accent-white" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="accent-white" />
          Featured
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="border border-white/50 px-8 py-3 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian disabled:opacity-50"
      >
        {isPending ? "Saving…" : project ? "Save Changes" : "Create Project"}
      </button>
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/15 bg-obsidian-raised p-3 text-white placeholder:text-neutral-600/30 focus:border-white focus:outline-none"
      />
    </div>
  );
}
