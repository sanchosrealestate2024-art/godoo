"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Contact } from "@/types/database";
import { updateContactStatus, deleteContact } from "./actions";

const STATUS_OPTIONS: Contact["status"][] = ["new", "read", "replied", "archived"];

export function MessageRow({ contact }: { contact: Contact }) {
  const [status, setStatus] = useState(contact.status);
  const [deleted, setDeleted] = useState(false);
  const [, startTransition] = useTransition();

  if (deleted) return null;

  return (
    <div className="border border-white/10 bg-obsidian-raised p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{contact.name}</p>
          <p className="text-xs text-white/50">{contact.email}</p>
          {contact.phone && <p className="text-xs text-white/50">{contact.phone}</p>}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => {
              const next = e.target.value as Contact["status"];
              setStatus(next);
              startTransition(() => {
                updateContactStatus(contact.id, next);
              });
            }}
            className="border border-white/15 bg-obsidian px-2 py-1 text-xs capitalize text-white/70"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setDeleted(true);
              startTransition(() => {
                deleteContact(contact.id);
              });
            }}
            className="text-white/40 hover:text-red-400"
            aria-label="Delete message"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {contact.subject && <p className="mt-3 text-sm text-white">{contact.subject}</p>}
      <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{contact.message}</p>
      <p className="mt-3 text-xs text-white/40">
        {format(new Date(contact.created_at), "MMM d, yyyy · h:mm a")}
        {contact.project_type ? ` · ${contact.project_type}` : ""}
      </p>
    </div>
  );
}
