"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { ProjectWithMedia } from "@/types/database";
import { CATEGORY_LABELS } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalGallery({ projects }: { projects: ProjectWithMedia[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || projects.length === 0) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollDistance = track.scrollWidth - window.innerWidth;
      if (scrollDistance <= 0) return;

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-obsidian-raised">
      <div className="absolute left-6 top-10 z-10 md:left-10">
        <p className="eyebrow mb-2">Selected Works</p>
        <h2 className="font-display text-3xl text-white md:text-4xl">Featured Projects</h2>
      </div>

      <div ref={trackRef} className="flex h-screen items-center gap-6 pl-6 pr-[10vw] pt-20 md:gap-10 md:pl-10">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative h-[65vh] w-[78vw] flex-shrink-0 overflow-hidden md:w-[42vw] lg:w-[32vw]"
          >
            {project.cover_image && (
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="eyebrow mb-2 block text-white">
                {String(i + 1).padStart(2, "0")} —{" "}
                {project.category ? CATEGORY_LABELS[project.category] ?? project.category : ""}
              </span>
              <h3 className="font-display text-2xl text-white md:text-3xl">{project.title}</h3>
              {project.location && <p className="mt-1 text-sm text-white/60">{project.location}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
