import { getSettings } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactForm } from "@/components/contact/contact-form";

export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Get in Touch</p>
            <h1 className="font-display text-4xl text-white md:text-5xl">
              Let&apos;s Build Something Lasting
            </h1>
            <dl className="mt-10 space-y-4 text-white/70">
              {settings?.address && (
                <div>
                  <dt className="eyebrow mb-1">Studio</dt>
                  <dd>{settings.address}</dd>
                </div>
              )}
              {settings?.email && (
                <div>
                  <dt className="eyebrow mb-1">Email</dt>
                  <dd>
                    <a href={`mailto:${settings.email}`} className="hover:text-white">
                      {settings.email}
                    </a>
                  </dd>
                </div>
              )}
              {settings?.phone && (
                <div>
                  <dt className="eyebrow mb-1">Phone</dt>
                  <dd>
                    <a href={`tel:${settings.phone}`} className="hover:text-white">
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <ContactForm />
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
