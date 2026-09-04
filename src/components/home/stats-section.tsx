"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl text-white md:text-6xl">
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection({
  projectsCompleted,
  yearsExperience,
  happyClients,
  awards,
}: {
  projectsCompleted: number;
  yearsExperience: number;
  happyClients: number;
  awards: number;
}) {
  const stats: Stat[] = [
    { label: "Projects Completed", value: projectsCompleted, suffix: "+" },
    { label: "Years Experience", value: yearsExperience, suffix: "+" },
    { label: "Happy Clients", value: happyClients, suffix: "+" },
    { label: "Awards", value: awards },
  ];

  return (
    <section className="border-y border-white/10 bg-obsidian-raised px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-center"
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="eyebrow mt-3 text-white/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
