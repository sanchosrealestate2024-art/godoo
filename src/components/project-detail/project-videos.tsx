import type { ProjectVideo } from "@/types/database";

export function ProjectVideos({ videos }: { videos: ProjectVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="bg-obsidian-raised px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-8 text-2xl text-white md:text-3xl">Films</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id} className="aspect-video overflow-hidden bg-obsidian-panel">
              <video
                src={video.video_url}
                poster={video.thumbnail ?? undefined}
                controls
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
