"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { TeamMember } from "@/types/database";
import { deleteTeamMember, updateTeamMember } from "./actions";

export function TeamMemberRow({ member }: { member: TeamMember }) {
  const [deleted, setDeleted] = useState(false);
  const [published, setPublished] = useState(member.published);
  const [, startTransition] = useTransition();

  if (deleted) return null;

  return (
    <div className="flex items-center justify-between border border-white/10 bg-obsidian-raised p-4">
      <div className="flex items-center gap-4">
        {member.photo ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image src={member.photo} alt={member.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-obsidian-panel" />
        )}
        <div>
          <p className="text-sm text-white">{member.name}</p>
          <p className="text-xs text-white/50">{member.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            const next = !published;
            setPublished(next);
            const fd = new FormData();
            fd.set("name", member.name);
            fd.set("role", member.role ?? "");
            fd.set("photo", member.photo ?? "");
            fd.set("bio", member.bio ?? "");
            fd.set("display_order", String(member.display_order));
            if (next) fd.set("published", "on");
            startTransition(() => {
              updateTeamMember(member.id, fd);
            });
          }}
          className={`rounded-full px-3 py-1 text-xs uppercase ${
            published ? "bg-white/20 text-white" : "bg-obsidian-panel/5 text-white/40"
          }`}
        >
          {published ? "Published" : "Hidden"}
        </button>
        <button
          onClick={() => {
            setDeleted(true);
            startTransition(() => {
              deleteTeamMember(member.id);
            });
          }}
          className="text-white/40 hover:text-red-400"
          aria-label="Delete team member"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
