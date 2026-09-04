"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ProjectVideo, Project } from "@/types/database";

export interface ShowcaseVideo extends ProjectVideo {
  project: Pick<Project, "title" | "slug">;
}

function VideoCard({ video, index }: { video: ShowcaseVideo; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => {
        setHovering(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovering(false);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }}
      data-cursor-hover
      className="group relative aspect-video overflow-hidden border border-white/10 bg-obsidian-panel"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, rgba(255,255,255,0.12), transparent 60%)",
        }}
      />
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.thumbnail ?? undefined}
        className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 ease-smooth group-hover:scale-105"
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
        <span className="technical-label text-white">{video.project.title}</span>
        <span className="technical-label text-white/50">
          {hovering ? "PLAYING" : String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

export function VideoShowcase({ videos }: { videos: ShowcaseVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-obsidian px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="technical-label mb-2">FIG. 03 &mdash; MOTION</p>
        <h2 className="font-display text-3xl text-white md:text-4xl">Project Films</h2>

        <div className="mt-12 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
