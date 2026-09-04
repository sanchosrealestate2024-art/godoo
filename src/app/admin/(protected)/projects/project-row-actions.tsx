"use client";

import { useState, useTransition } from "react";
import { toggleProjectField } from "./actions";

export function ProjectRowActions({
  projectId,
  published,
  featured,
  field,
}: {
  projectId: string;
  published: boolean;
  featured: boolean;
  field: "published" | "featured";
}) {
  const current = field === "published" ? published : featured;
  const [value, setValue] = useState(current);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      const result = await toggleProjectField(projectId, field, next);
      if (result?.error) setValue(!next);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
        value ? "bg-white/20 text-white" : "bg-obsidian-panel/5 text-white/40"
      }`}
    >
      {value ? "Yes" : "No"}
    </button>
  );
}
