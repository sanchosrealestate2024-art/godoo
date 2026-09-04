import { getProjectCategories, getPublishedProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { ProjectsFilters } from "@/components/projects/projects-filters";
import { Pagination } from "@/components/projects/pagination";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const [{ projects, totalPages, total }, categories, settings] = await Promise.all([
    getPublishedProjects({
      search: params.q,
      category: params.category,
      sort: (params.sort as "newest" | "oldest" | "title_asc" | "title_desc") ?? "newest",
      page,
    }),
    getProjectCategories(),
    getSettings(),
  ]);

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-3">Portfolio</p>
          <h1 className="font-display text-4xl text-white md:text-6xl">All Projects</h1>
          <p className="mt-3 text-sm text-white/50">{total} projects</p>

          <ProjectsFilters categories={categories} />

          <ProjectsGrid projects={projects} />

          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
