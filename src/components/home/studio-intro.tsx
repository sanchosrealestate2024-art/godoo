import { ImageStack } from "./image-stack";
import type { ProjectImage } from "@/types/database";

export function StudioIntro({
  images,
  companyName,
}: {
  images: Pick<ProjectImage, "id" | "image_url" | "caption">[];
  companyName: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-obsidian px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <div>
          <p className="technical-label mb-6">FIG. 02 &mdash; ARCHIVE</p>
          <p className="quote-accent text-3xl leading-relaxed text-white md:text-4xl">
            &ldquo;Every structure begins as a negotiation with its site &mdash; the light, the
            ground, the memory of what stood there before.&rdquo;
          </p>
          <p className="mt-8 text-sm leading-relaxed text-white/50">
            {companyName} designs from first principles: material honesty, spatial clarity, and a
            refusal to decorate what doesn&apos;t need decoration.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <ImageStack images={images} />
        </div>
      </div>
    </section>
  );
}
