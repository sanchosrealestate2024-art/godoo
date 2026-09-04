import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

const BUCKETS = ["project-images", "team", "blog", "logos"] as const;

export default async function AdminMediaPage() {
  const supabase = await createClient();

  const results = await Promise.all(
    BUCKETS.map(async (bucket) => {
      const { data } = await supabase.storage.from(bucket).list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
      const files = (data ?? []).filter((f) => f.id);
      return {
        bucket,
        files: files.map((f) => ({
          name: f.name,
          url: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
        })),
      };
    })
  );

  return (
    <div>
      <h1 className="font-display text-3xl">Media Library</h1>
      <p className="mt-2 text-sm text-white/50">
        Files uploaded across every bucket. Upload new media from the relevant section (Projects,
        Team, Blog, Settings).
      </p>

      {results.map(({ bucket, files }) => (
        <div key={bucket} className="mt-10">
          <h2 className="font-display mb-4 text-xl capitalize">{bucket.replace("-", " ")}</h2>
          {files.length === 0 ? (
            <p className="text-sm text-white/40">No files yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {files.map((f) => (
                <a
                  key={f.name}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden border border-white/10 bg-obsidian-panel"
                >
                  <Image src={f.url} alt={f.name} fill sizes="120px" className="object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
