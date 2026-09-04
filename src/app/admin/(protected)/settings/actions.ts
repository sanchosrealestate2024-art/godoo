"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const field = (name: string) => String(formData.get(name) ?? "") || null;

  const { error } = await supabase
    .from("settings")
    .update({
      company_name: field("company_name") ?? "GODOO Architecture Studio",
      logo_url: field("logo_url"),
      email: field("email"),
      phone: field("phone"),
      address: field("address"),
      social_instagram: field("social_instagram"),
      social_facebook: field("social_facebook"),
      social_linkedin: field("social_linkedin"),
      social_youtube: field("social_youtube"),
      social_tiktok: field("social_tiktok"),
      seo_title: field("seo_title"),
      seo_description: field("seo_description"),
      seo_og_image: field("seo_og_image"),
      stats_years_experience: formData.get("stats_years_experience")
        ? Number(formData.get("stats_years_experience"))
        : null,
      stats_awards: formData.get("stats_awards") ? Number(formData.get("stats_awards")) : null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { error: null };
}
