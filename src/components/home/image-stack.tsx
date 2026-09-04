"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectImage } from "@/types/database";

/**
 * Interactive Image Stack — a shuffling deck of project photographs.
 * Auto-cycles, and can be advanced manually by clicking the stack.
 */
export function ImageStack({
  images,
  intervalMs = 3200,
}: {
  images: Pick<ProjectImage, "id" | "image_url" | "caption">[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(() => setActive((prev) => (prev + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, paused]);

  if (images.length === 0) return null;

  const visible = images.slice(0, 5);

  return (
    <div
      className="relative aspect-[3/4] w-full max-w-sm cursor-pointer select-none"
      onClick={() => setActive((prev) => (prev + 1) % images.length)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-cursor-hover
    >
      {visible.map((img, i) => {
        const offset = (i - active + visible.length) % visible.length;
        const isTop = offset === 0;
        return (
          <motion.div
            key={img.id}
            className="absolute inset-0 overflow-hidden border border-white/10 bg-obsidian-panel"
            animate={{
              rotate: isTop ? 0 : (offset % 2 === 0 ? -1 : 1) * offset * 2.5,
              scale: 1 - offset * 0.04,
              x: isTop ? 0 : offset * 10,
              y: isTop ? 0 : offset * 10,
              zIndex: visible.length - offset,
              opacity: offset > 3 ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={img.image_url}
              alt={img.caption ?? "Project photograph"}
              fill
              sizes="384px"
              className="object-cover grayscale-[10%]"
            />
          </motion.div>
        );
      })}

      <div className="pointer-events-none absolute -bottom-8 left-0 technical-label">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
