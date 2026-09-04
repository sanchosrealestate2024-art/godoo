"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/types/database";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (testimonials.length === 0) return null;
  const t = testimonials[index];

  const go = (dir: 1 | -1) =>
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);

  return (
    <section className="border-t border-white/10 bg-obsidian px-6 py-28 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="technical-label mb-8">CLIENT VOICE — {String(index + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <p className="quote-accent text-2xl leading-relaxed text-white md:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              {t.image && (
                <div className="relative h-12 w-12 overflow-hidden rounded-full grayscale">
                  <Image src={t.image} alt={t.client_name} fill className="object-cover" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-white">{t.client_name}</p>
                {t.company && <p className="text-xs text-white/50">{t.company}</p>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <div className="mt-10 flex justify-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="border border-white/20 p-2 text-white transition-colors hover:border-white hover:bg-white hover:text-obsidian"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="border border-white/20 p-2 text-white transition-colors hover:border-white hover:bg-white hover:text-obsidian"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
