"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";

export async function createTestimonial(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    client_name: String(formData.get("client_name") ?? ""),
    company: String(formData.get("company") ?? "") || null,
    image: String(formData.get("image") ?? "") || null,
    quote: String(formData.get("quote") ?? ""),
    display_order: Number(formData.get("display_order") ?? 0),
    published: formData.get("published") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}
