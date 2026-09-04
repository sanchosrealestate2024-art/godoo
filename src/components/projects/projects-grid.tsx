"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProjectWithMedia } from "@/types/database";
import { CATEGORY_LABELS } from "@/lib/utils";

export function ProjectsGrid({ projects }: { projects: ProjectWithMedia[] }) {
  if (projects.length === 0) {
    return (
      <p className="mt-20 text-center text-white/50">
        No projects match your search — try clearing a filter.
      </p>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
        >
          <Link href={`/projects/${project.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-obsidian-panel">
              {project.cover_image && (
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
              )}
            </div>
            <div className="mt-4">
              <span className="eyebrow text-white">
                {project.category ? CATEGORY_LABELS[project.category] ?? project.category : ""}
                {project.year ? ` · ${project.year}` : ""}
              </span>
              <h3 className="mt-2 font-display text-xl text-white">{project.title}</h3>
              {project.location && <p className="mt-1 text-sm text-white/50">{project.location}</p>}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
