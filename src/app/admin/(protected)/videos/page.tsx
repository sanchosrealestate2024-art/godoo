import { createClient } from "@/lib/supabase/server";
import { VideosUploadManager } from "./videos-upload-manager";

export default async function AdminVideosPage() {
  const supabase = await createClient();

  const [{ data: videos }, { data: projects }] = await Promise.all([
    supabase
      .from("project_videos")
      .select("id, video_url, title, project:projects(id, title, slug)")
      .order("created_at", { ascending: false }),
    supabase.from("projects").select("id, title").order("title", { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl">Videos</h1>
      <p className="mt-2 text-sm text-white/50">
        All project films. Pick a project below and upload directly, or add more from that
        project&apos;s edit page.
      </p>

      <VideosUploadManager
        initialVideos={(videos ?? []) as any}
        projects={projects ?? []}
      />
    </div>
  );
}
