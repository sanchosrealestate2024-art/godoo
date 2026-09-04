import { createClient } from "@/lib/supabase/server";
import type { ProjectWithMedia } from "@/types/database";

const PROJECT_WITH_MEDIA_SELECT = `
  *,
  project_images ( * ),
  project_videos ( * )
`;

export async function getFeaturedProjects(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_WITH_MEDIA_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProjectWithMedia[];
}

export async function getLatestFeaturedProject() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_WITH_MEDIA_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProjectWithMedia | null;
}

export interface ProjectListParams {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
  page?: number;
  pageSize?: number;
}

export async function getPublishedProjects(params: ProjectListParams = {}) {
  const { search, category, sort = "newest", page = 1, pageSize = 12 } = params;
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(PROJECT_WITH_MEDIA_SELECT, { count: "exact" })
    .eq("published", true);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
    );
  }
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  switch (sort) {
    case "oldest":
      query = query.order("year", { ascending: true, nullsFirst: false });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    case "title_desc":
      query = query.order("title", { ascending: false });
      break;
    default:
      query = query.order("year", { ascending: false, nullsFirst: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    projects: (data ?? []) as unknown as ProjectWithMedia[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_WITH_MEDIA_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProjectWithMedia | null;
}

export async function getRelatedProjects(project: ProjectWithMedia, limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_WITH_MEDIA_SELECT)
    .eq("published", true)
    .eq("category", project.category ?? "")
    .neq("id", project.id)
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ProjectWithMedia[];
}

export async function getProjectCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("category")
    .eq("published", true)
    .not("category", "is", null);

  if (error) throw error;
  const set = new Set((data ?? []).map((r) => r.category as string));
  return Array.from(set);
}

export async function getSiteStats() {
  const supabase = await createClient();

  const [{ count: projectsCompleted }, { data: clients }, settingsRes] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("published", true)
        .eq("status", "completed"),
      supabase.from("projects").select("client").eq("published", true).not("client", "is", null),
      supabase.from("settings").select("stats_years_experience, stats_awards").eq("id", 1).maybeSingle(),
    ]);

  const uniqueClients = new Set((clients ?? []).map((c) => c.client)).size;

  return {
    projectsCompleted: projectsCompleted ?? 0,
    happyClients: uniqueClients,
    yearsExperience: settingsRes.data?.stats_years_experience ?? 0,
    awards: settingsRes.data?.stats_awards ?? 0,
  };
}
