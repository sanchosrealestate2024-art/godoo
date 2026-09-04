"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

export async function createTeamMember(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("team").insert({
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? "") || null,
    photo: String(formData.get("photo") ?? "") || null,
    bio: String(formData.get("bio") ?? "") || null,
    display_order: Number(formData.get("display_order") ?? 0),
    published: formData.get("published") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");
  return { error: null };
}

export async function updateTeamMember(id: string, formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("team")
    .update({
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? "") || null,
      photo: String(formData.get("photo") ?? "") || null,
      bio: String(formData.get("bio") ?? "") || null,
      display_order: Number(formData.get("display_order") ?? 0),
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");
  return { error: null };
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("team").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/team");
  return { error: null };
}
