import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Read-only client for public catalog data (the `cars` table), usable from
// both server and client components without cookie/session plumbing.
// Auth persistence is disabled since this client never signs in — it would
// otherwise race the real auth client (utils/supabase/client.ts) over the
// same storage key on pages that use both.
export const supabasePublic = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } }
);
