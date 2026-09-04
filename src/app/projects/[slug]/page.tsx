import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProjectHero } from "@/components/project-detail/project-hero";
import { ProjectInfo } from "@/components/project-detail/project-info";
import { ProjectGallery } from "@/components/project-detail/project-gallery";
import { ProjectVideos } from "@/components/project-detail/project-videos";
import { ProjectDrawings } from "@/components/project-detail/project-drawings";
import { BeforeAfter } from "@/components/project-detail/before-after";
import { RelatedProjects } from "@/components/project-detail/related-projects";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: project.cover_image ? { images: [project.cover_image] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProjects(project),
    getSettings(),
  ]);

  const gallery = project.project_images.filter((i) => i.kind === "gallery");
  const blueprints = project.project_images.filter((i) => i.kind === "blueprint");
  const floorPlans = project.project_images.filter((i) => i.kind === "floor_plan");
  const construction = project.project_images.filter((i) => i.kind === "construction");
  const before = project.project_images.filter((i) => i.kind === "before");
  const after = project.project_images.filter((i) => i.kind === "after");

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main>
        <ProjectHero project={project} />
        <ProjectInfo project={project} />
        <ProjectGallery images={gallery} title="Gallery" />
        <ProjectVideos videos={project.project_videos} />
        <ProjectDrawings images={blueprints} title="Blueprints" />
        <ProjectDrawings images={floorPlans} title="Floor Plans" />
        <ProjectGallery images={construction} title="Construction" />
        <BeforeAfter before={before} after={after} />
        <RelatedProjects projects={related} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
