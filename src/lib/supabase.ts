import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return client;
}

export function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLIC_SITE_KEY);
}
