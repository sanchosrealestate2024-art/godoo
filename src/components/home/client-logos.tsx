import Image from "next/image";
import type { ClientLogo } from "@/types/database";

export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  if (logos.length === 0) return null;

  return (
    <section className="bg-obsidian-raised px-6 py-16 md:px-10">
      <p className="eyebrow mb-10 text-center">Trusted By</p>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
        {logos.map((logo) => (
          <div key={logo.id} className="relative h-10 w-28 opacity-60 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
            <Image src={logo.logo_url} alt={logo.name} fill className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
