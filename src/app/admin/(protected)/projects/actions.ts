"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import type { ProjectStatus } from "@/types/database";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProject(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  const slug = slugify(slugInput || title);

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      description: String(formData.get("description") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      client: String(formData.get("client") ?? "") || null,
      architect: String(formData.get("architect") ?? "") || null,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      area: String(formData.get("area") ?? "") || null,
      status: (String(formData.get("status") ?? "draft") as ProjectStatus) || "draft",
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      cover_image: String(formData.get("cover_image") ?? "") || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "");
  const slugInput = String(formData.get("slug") ?? "");
  const slug = slugify(slugInput || title);

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      slug,
      description: String(formData.get("description") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      client: String(formData.get("client") ?? "") || null,
      architect: String(formData.get("architect") ?? "") || null,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      area: String(formData.get("area") ?? "") || null,
      status: (String(formData.get("status") ?? "draft") as ProjectStatus) || "draft",
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      cover_image: String(formData.get("cover_image") ?? "") || null,
    })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  return { error: null };
}

export async function deleteProject(projectId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return { error: null };
}

export async function toggleProjectField(
  projectId: string,
  field: "published" | "featured",
  value: boolean
) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", projectId);
  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return { error: null };
}

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  kind: string,
  displayOrder: number
) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    image_url: imageUrl,
    kind,
    display_order: displayOrder,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { error: null };
}

export async function deleteProjectImage(imageId: string, projectId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("project_images").delete().eq("id", imageId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { error: null };
}

export async function reorderProjectImages(
  projectId: string,
  orderedIds: string[]
) {
  await requireStaff();
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("project_images").update({ display_order: index }).eq("id", id)
    )
  );

  revalidatePath(`/admin/projects/${projectId}`);
  return { error: null };
}

export async function addProjectVideo(
  projectId: string,
  videoUrl: string,
  thumbnail: string | null,
  title: string | null,
  displayOrder: number
) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("project_videos").insert({
    project_id: projectId,
    video_url: videoUrl,
    thumbnail,
    title,
    display_order: displayOrder,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/");
  return { error: null };
}

export async function deleteProjectVideo(videoId: string, projectId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("project_videos").delete().eq("id", videoId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { error: null };
}
