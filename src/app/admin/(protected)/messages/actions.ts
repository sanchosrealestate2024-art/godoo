"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireAdmin } from "@/lib/auth";
import type { Contact } from "@/types/database";

export async function updateContactStatus(id: string, status: Contact["status"]) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { error: null };
}

export async function deleteContact(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { error: null };
}
