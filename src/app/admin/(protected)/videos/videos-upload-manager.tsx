"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, Loader2 } from "lucide-react";
import { uploadVideo } from "@/lib/upload";
import { addProjectVideo } from "../projects/actions";

interface ProjectOption {
  id: string;
  title: string;
}

interface VideoWithProject {
  id: string;
  video_url: string;
  title: string | null;
  project: { id: string; title: string; slug: string } | null;
}

export function VideosUploadManager({
  initialVideos,
  projects,
}: {
  initialVideos: VideoWithProject[];
  projects: ProjectOption[];
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!projectId) {
      setError("Pick a project first.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadVideo("project-videos", file, projectId);
      const result = await addProjectVideo(projectId, url, null, file.name, videos.length);
      if (result?.error) {
        setError(result.error);
        return;
      }
      const project = projects.find((p) => p.id === projectId);
      setVideos((prev) => [
        {
          id: crypto.randomUUID(),
          video_url: url,
          title: file.name,
          project: project ? { id: project.id, title: project.title, slug: "" } : null,
        },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="mt-8 flex flex-col gap-3 border border-white/10 bg-obsidian-panel p-4 sm:flex-row sm:items-center">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="border border-white/15 bg-obsidian-raised px-3 py-2 text-sm text-white focus:border-white focus:outline-none sm:w-64"
        >
          {projects.length === 0 && <option value="">No projects yet</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !projectId}
          className="flex items-center gap-2 border border-white/50 px-5 py-2 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-obsidian disabled:opacity-40"
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
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <div key={v.id} className="border border-white/10 bg-obsidian-raised p-3">
            <video src={v.video_url} className="aspect-video w-full object-cover" muted controls preload="metadata" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-white/60">{v.title ?? "Untitled"}</span>
              {v.project && (
                <Link href={`/admin/projects/${v.project.id}`} className="text-xs text-white hover:underline">
                  {v.project.title}
                </Link>
              )}
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <p className="col-span-full mt-10 text-center text-white/50">No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
