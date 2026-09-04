import Image from "next/image";
import Link from "next/link";
import type { ProjectWithMedia } from "@/types/database";

export function RelatedProjects({ projects }: { projects: ProjectWithMedia[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-obsidian-raised px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-10 text-2xl text-white md:text-3xl">Related Projects</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-obsidian-panel">
                {p.cover_image && (
                  <Image
                    src={p.cover_image}
                    alt={p.title}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="font-display mt-3 text-lg text-white">{p.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
