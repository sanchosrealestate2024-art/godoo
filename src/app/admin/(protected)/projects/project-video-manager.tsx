"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadVideo } from "@/lib/upload";
import type { ProjectVideo } from "@/types/database";
import { addProjectVideo, deleteProjectVideo } from "./actions";

export function ProjectVideoManager({
  projectId,
  videos,
}: {
  projectId: string;
  videos: ProjectVideo[];
}) {
  const [items, setItems] = useState(videos);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const { url } = await uploadVideo("project-videos", file, projectId);
      await addProjectVideo(projectId, url, null, file.name, items.length);
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          project_id: projectId,
          video_url: url,
          thumbnail: null,
          title: file.name,
          display_order: prev.length,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(videoId: string) {
    setItems((prev) => prev.filter((v) => v.id !== videoId));
    startTransition(() => {
      deleteProjectVideo(videoId, projectId);
    });
  }

  return (
    <div className="space-y-3">
      {items.map((video) => (
        <div key={video.id} className="flex items-center justify-between border border-white/10 bg-obsidian-raised p-3">
          <video src={video.video_url} className="h-16 w-28 object-cover" muted />
          <span className="flex-1 truncate px-3 text-sm text-white/70">{video.title ?? video.video_url}</span>
          <button onClick={() => handleDelete(video.id)} className="text-white/50 hover:text-red-400" aria-label="Delete video">
            <X size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 border border-dashed border-white/20 px-4 py-3 text-sm text-white/50 hover:border-white hover:text-white"
      >
        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        {uploading ? "Uploading…" : "Upload Video"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
