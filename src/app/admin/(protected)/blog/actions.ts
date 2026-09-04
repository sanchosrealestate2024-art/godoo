"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlog(formData: FormData) {
  const { profile } = await requireStaff();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "");
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const published = formData.get("published") === "on";

  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title,
      slug,
      cover_image: String(formData.get("cover_image") ?? "") || null,
      excerpt: String(formData.get("excerpt") ?? "") || null,
      content: String(formData.get("content") ?? "") || null,
      author: profile.full_name ?? "GODOO Studio",
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlog(id: string, formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "");
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const published = formData.get("published") === "on";

  const { data: existing } = await supabase.from("blogs").select("published_at").eq("id", id).maybeSingle();

  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      slug,
      cover_image: String(formData.get("cover_image") ?? "") || null,
      excerpt: String(formData.get("excerpt") ?? "") || null,
      content: String(formData.get("content") ?? "") || null,
      published,
      published_at: published ? existing?.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { error: null };
}

export async function deleteBlog(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { error: null };
}
