import { createClient } from "@/lib/supabase/server";
import { getFeaturedProjects, getLatestFeaturedProject, getSiteStats } from "@/lib/data/projects";
import { getClientLogos, getSettings, getTestimonials } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { StudioIntro } from "@/components/home/studio-intro";
import { HorizontalGallery } from "@/components/home/horizontal-gallery";
import { VideoShowcase, type ShowcaseVideo } from "@/components/home/video-showcase";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ClientLogos } from "@/components/home/client-logos";

export const revalidate = 60; // ISR: refresh homepage data every 60s

async function getShowcaseVideos(): Promise<ShowcaseVideo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_videos")
    .select("*, project:projects!inner(title, slug, published)")
    .eq("project.published", true)
    .order("display_order", { ascending: true })
    .limit(6);
  if (error) throw error;
  return (data ?? []) as unknown as ShowcaseVideo[];
}

export default async function HomePage() {
  const [latestFeatured, featuredProjects, stats, testimonials, logos, settings, videos] =
    await Promise.all([
      getLatestFeaturedProject(),
      getFeaturedProjects(),
      getSiteStats(),
      getTestimonials(),
      getClientLogos(),
      getSettings(),
      getShowcaseVideos(),
    ]);

  const stackImages = featuredProjects
    .flatMap((p) => p.project_images.filter((img) => img.kind === "gallery"))
    .slice(0, 5);

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main>
        <Hero project={latestFeatured} />
        <StudioIntro images={stackImages} companyName={settings?.company_name ?? "GODOO"} />
        <HorizontalGallery projects={featuredProjects} />
        <VideoShowcase videos={videos} />
        <StatsSection {...stats} />
        <TestimonialsSection testimonials={testimonials} />
        <ClientLogos logos={logos} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
