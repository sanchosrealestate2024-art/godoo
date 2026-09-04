"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

export async function createService(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    icon: String(formData.get("icon") ?? "") || null,
    image: String(formData.get("image") ?? "") || null,
    display_order: Number(formData.get("display_order") ?? 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { error: null };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
  return { error: null };
}
