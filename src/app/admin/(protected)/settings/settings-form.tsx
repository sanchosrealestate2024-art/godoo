"use client";

import { useState, useTransition } from "react";
import type { Settings } from "@/types/database";
import { updateSettings } from "./actions";

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result?.error) {
        setError(result.error);
        setSaved(false);
      } else {
        setError(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-xl">Company</h2>
        <Field label="Company Name" name="company_name" defaultValue={settings?.company_name} />
        <Field label="Logo URL" name="logo_url" defaultValue={settings?.logo_url ?? ""} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Contact</h2>
        <Field label="Email" name="email" defaultValue={settings?.email ?? ""} />
        <Field label="Phone" name="phone" defaultValue={settings?.phone ?? ""} />
        <Field label="Address" name="address" defaultValue={settings?.address ?? ""} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Social Media</h2>
        <Field label="Instagram" name="social_instagram" defaultValue={settings?.social_instagram ?? ""} />
        <Field label="Facebook" name="social_facebook" defaultValue={settings?.social_facebook ?? ""} />
        <Field label="LinkedIn" name="social_linkedin" defaultValue={settings?.social_linkedin ?? ""} />
        <Field label="YouTube" name="social_youtube" defaultValue={settings?.social_youtube ?? ""} />
        <Field label="TikTok" name="social_tiktok" defaultValue={settings?.social_tiktok ?? ""} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">SEO</h2>
        <Field label="SEO Title" name="seo_title" defaultValue={settings?.seo_title ?? ""} />
        <Field label="SEO Description" name="seo_description" defaultValue={settings?.seo_description ?? ""} />
        <Field label="Open Graph Image URL" name="seo_og_image" defaultValue={settings?.seo_og_image ?? ""} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Stats (manual inputs)</h2>
        <p className="text-xs text-white/40">
          Projects Completed and Happy Clients are calculated automatically from your project data.
          These two are set manually since they aren&apos;t derived from a table.
        </p>
        <Field label="Years Experience" name="stats_years_experience" type="number" defaultValue={settings?.stats_years_experience ?? ""} />
        <Field label="Awards" name="stats_awards" type="number" defaultValue={settings?.stats_awards ?? ""} />
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="border border-white/50 px-8 py-3 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian disabled:opacity-50"
      >
        {isPending ? "Saving…" : saved ? "Saved ✓" : "Save Settings"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
}) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
      />
    </div>
  );
}
