"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProjectWithMedia } from "@/types/database";
import { CATEGORY_LABELS } from "@/lib/utils";

export function ProjectHero({ project }: { project: ProjectWithMedia }) {
  return (
    <section className="relative flex h-[75vh] min-h-[520px] items-end overflow-hidden bg-obsidian">
      {project.cover_image && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
        </motion.div>
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="eyebrow mb-4"
        >
          {project.category ? CATEGORY_LABELS[project.category] ?? project.category : ""}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl text-white md:text-7xl"
        >
          {project.title}
        </motion.h1>
      </div>
    </section>
  );
}
