import Image from "next/image";
import { getServices, getSettings, getTeam } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const revalidate = 60;

export default async function AboutPage() {
  const [team, services, settings] = await Promise.all([getTeam(), getServices(), getSettings()]);

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-3">The Studio</p>
          <h1 className="font-display text-4xl text-white md:text-6xl">
            {settings?.company_name ?? "GODOO Architecture Studio"}
          </h1>

          {services.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display mb-8 text-2xl text-white">Services</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <div key={s.id} className="border border-white/10 p-6">
                    {s.image && (
                      <div className="relative mb-4 aspect-video overflow-hidden">
                        <Image src={s.image} alt={s.title} fill className="object-cover" />
                      </div>
                    )}
                    <h3 className="font-display text-xl text-white">{s.title}</h3>
                    {s.description && <p className="mt-2 text-sm text-white/60">{s.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {team.length > 0 && (
            <section className="mt-24">
              <h2 className="font-display mb-8 text-2xl text-white">Team</h2>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                {team.map((member) => (
                  <div key={member.id}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-obsidian-panel">
                      {member.photo && (
                        <Image src={member.photo} alt={member.name} fill className="object-cover" />
                      )}
                    </div>
                    <p className="font-display mt-3 text-lg text-white">{member.name}</p>
                    {member.role && <p className="text-xs text-white/50">{member.role}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
