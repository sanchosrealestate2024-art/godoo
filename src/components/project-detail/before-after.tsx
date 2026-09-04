"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectImage } from "@/types/database";

export function BeforeAfter({ before, after }: { before: ProjectImage[]; after: ProjectImage[] }) {
  const [split, setSplit] = useState(50);
  if (before.length === 0 || after.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-obsidian px-6 py-16 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="technical-label mb-2">FIG. — CONDITION</p>
        <h2 className="font-display mb-8 text-2xl text-white md:text-3xl">Before &amp; After</h2>
        <div className="relative aspect-video select-none overflow-hidden border border-white/10 bg-obsidian-panel">
          <Image src={after[0].image_url} alt="After" fill className="object-cover grayscale-[10%]" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          >
            <Image src={before[0].image_url} alt="Before" fill className="object-cover grayscale" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${split}%` }}>
            <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white bg-obsidian text-[10px] text-white">
              ⇔
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label="Before and after comparison slider"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <div className="mt-3 flex justify-between technical-label">
          <span>BEFORE</span>
          <span>AFTER</span>
        </div>
      </div>
    </section>
  );
}
