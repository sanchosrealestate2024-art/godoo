"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "../actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-400/70 hover:text-red-400"
      >
        Delete Project
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60">Delete permanently?</span>
      <button
        onClick={() =>
          startTransition(async () => {
            await deleteProject(projectId);
            router.push("/admin/projects");
          })
        }
        disabled={isPending}
        className="border border-red-400/50 px-3 py-1 text-xs uppercase text-red-400 hover:bg-red-400 hover:text-obsidian"
      >
        {isPending ? "Deleting…" : "Confirm"}
      </button>
      <button onClick={() => setConfirming(false)} className="text-xs text-white/50">
        Cancel
      </button>
    </div>
  );
}
