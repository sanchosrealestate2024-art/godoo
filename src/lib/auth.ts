import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

/** Fetches the signed-in user's profile, redirecting to login if absent. */
export async function requireStaff(): Promise<{ userId: string; profile: Profile }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/admin/login");

  return { userId: user.id, profile };
}

/** Redirects non-admins away from admin-only pages (e.g. Settings, Users). */
export async function requireAdmin(): Promise<{ userId: string; profile: Profile }> {
  const result = await requireStaff();
  if (result.profile.role !== "admin" && result.profile.role !== "super_admin") {
    redirect("/admin");
  }
  return result;
}
