"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteRowButton({ action }: { action: () => Promise<{ error: string | null } | void> }) {
  const [hidden, setHidden] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (hidden) return null;

  return (
    <button
      onClick={() => {
        setHidden(true);
        startTransition(() => {
          action();
        });
      }}
      disabled={isPending}
      className="flex-shrink-0 text-white/40 hover:text-red-400"
      aria-label="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
