import Image from "next/image";
import type { ProjectImage } from "@/types/database";

export function ProjectDrawings({ images, title }: { images: ProjectImage[]; title: string }) {
  if (images.length === 0) return null;

  return (
    <section className="border-y border-white/10 bg-obsidian-panel px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="technical-label mb-2">{String(images.length).padStart(2, "0")} SHEETS</p>
        <h2 className="font-display mb-8 text-2xl text-white md:text-3xl">{title}</h2>
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={img.image_url}
                alt={img.caption ?? title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
