import { createBrowserClient } from "@supabase/ssr";

/**
 * NOTE: intentionally untyped (no <Database> generic here).
 * The installed @supabase/postgrest-js version's select-string type
 * parser does not correctly infer row types from this project's schema
 * shape (a known upstream inference limitation, not a runtime issue).
 * Row/insert shapes are enforced instead via the interfaces in
 * @/types/database and explicit `as` casts at each call site.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
