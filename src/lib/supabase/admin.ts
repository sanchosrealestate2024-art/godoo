import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. NEVER import this into client components.
 * Used only in server actions / route handlers that must bypass RLS
 * (e.g. creating auth users for new admin accounts).
 *
 * NOTE: intentionally untyped (no <Database> generic). See client.ts for why.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
