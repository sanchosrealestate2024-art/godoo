"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { ProjectWithMedia } from "@/types/database";
import { CATEGORY_LABELS } from "@/lib/utils";

export function Hero({ project }: { project: ProjectWithMedia | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);
  const imageX = useTransform(springX, [-0.5, 0.5], [-16, 16]);
  const imageY = useTransform(springY, [-0.5, 0.5], [-16, 16]);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="ambient-spotlight relative flex h-screen min-h-[640px] w-full items-end overflow-hidden bg-obsidian"
      style={{ perspective: 1000 }}
    >
      <div className="pointer-events-none absolute inset-6 z-10 hidden border border-white/10 md:block" />
      <div className="pointer-events-none absolute left-8 top-8 z-10 hidden technical-label md:block">
        N 09.0192&deg; &middot; E 38.7525&deg;
      </div>
      <div className="pointer-events-none absolute right-8 top-8 z-10 hidden technical-label md:block">
        FIG. 01 &mdash; HERO
      </div>

      {project?.cover_image ? (
        <motion.div
          style={{ rotateX, rotateY, x: imageX, y: imageY }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover grayscale-[15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/10" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-obsidian-raised to-obsidian" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="technical-label mb-6"
        >
          {project?.category ? CATEGORY_LABELS[project.category] ?? project.category : "FEATURED WORK"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {project?.title ?? "Architecture, Rooted in Place"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center gap-6"
        >
          {project?.location && (
            <span className="technical-label">{project.location}</span>
          )}
          {project && (
            <Link
              href={`/projects/${project.slug}`}
              data-cursor-hover
              className="group inline-flex items-center gap-3 border border-white/50 px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-obsidian"
            >
              View Project
            </Link>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 flex flex-col items-center gap-2 text-white/50 md:right-10"
      >
        <span className="technical-label [writing-mode:vertical-rl]">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
