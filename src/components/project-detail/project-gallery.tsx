"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProjectImage } from "@/types/database";

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  if (images.length === 0) return null;

  return (
    <section className="bg-obsidian px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-8 text-2xl text-white md:text-3xl">{title}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              className={`relative overflow-hidden bg-obsidian-panel ${
                i % 5 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.caption ?? title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-obsidian/70 px-4 py-2 text-xs text-white/70">
                  {img.caption}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
