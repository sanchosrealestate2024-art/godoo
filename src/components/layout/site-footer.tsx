import Link from "next/link";
import type { Settings } from "@/types/database";

export function SiteFooter({ settings }: { settings: Settings | null }) {
  const socials = [
    { label: "Instagram", href: settings?.social_instagram },
    { label: "Facebook", href: settings?.social_facebook },
    { label: "LinkedIn", href: settings?.social_linkedin },
    { label: "YouTube", href: settings?.social_youtube },
    { label: "TikTok", href: settings?.social_tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/10 bg-obsidian px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">
            {settings?.company_name ?? "GODOO Architecture Studio"}
          </p>
          {settings?.address && <p className="mt-4 text-sm text-white/60">{settings.address}</p>}
        </div>

        <div className="space-y-2 text-sm text-white/60">
          {settings?.email && (
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </p>
          )}
          {settings?.phone && (
            <p>
              <a href={`tel:${settings.phone}`} className="hover:text-white">
                {settings.phone}
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-white/60 hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/40">
        <p>
          © {new Date().getFullYear()} {settings?.company_name ?? "GODOO Architecture Studio"}. All
          rights reserved. ·{" "}
          <Link href="/admin/login" className="hover:text-white">
            Studio Login
          </Link>
        </p>
      </div>
    </footer>
  );
}
