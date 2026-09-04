/**
 * Seeds Supabase with starter content.
 * Run: npm run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (bypasses RLS).
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("Seeding settings...");
  await supabase
    .from("settings")
    .update({
      company_name: "GODOO Architecture Studio",
      email: "info@godooarchitecture.com",
      phone: "+251 900 000 000",
      address: "Bole Road, Addis Ababa, Ethiopia",
      stats_years_experience: 8,
      stats_awards: 5,
    })
    .eq("id", 1);

  console.log("Seeding projects...");
  const projects = [
    {
      title: "Bank Headquarters",
      slug: "bank-headquarters",
      description:
        "A contemporary corporate headquarters in the heart of Addis Ababa, balancing monumental presence with functional workspace design.",
      category: "commercial",
      location: "Addis Ababa, Ethiopia",
      client: "Confidential",
      architect: "GODOO Architecture Studio",
      year: 2024,
      area: "12,000 m²",
      status: "completed" as const,
      featured: true,
      published: true,
    },
    {
      title: "Hospital with Vernacular Architecture",
      slug: "hospital-vernacular-architecture",
      description:
        "A healthcare facility that draws on traditional Ethiopian architectural forms and materials while meeting modern clinical requirements.",
      category: "institutional",
      location: "Addis Ababa, Ethiopia",
      client: "Confidential",
      architect: "GODOO Architecture Studio",
      year: 2023,
      area: "8,500 m²",
      status: "completed" as const,
      featured: true,
      published: true,
    },
  ];

  for (const project of projects) {
    const { error } = await supabase.from("projects").upsert(project, { onConflict: "slug" });
    if (error) console.error(`Failed to seed ${project.title}:`, error.message);
    else console.log(`✓ ${project.title}`);
  }

  console.log("Done. Add images/videos to each project from the admin dashboard.");
}

seed().then(() => process.exit(0));
