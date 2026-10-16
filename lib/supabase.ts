import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser/server Supabase client built from the public env keys.
// Returns null when env is not configured — every caller must fall back to
// the local data layer, so the store never breaks before setup is finished.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && key ? createClient(url, key) : null;
  return cached;
}

export interface SupabaseStatus {
  configured: boolean;
  reachable: boolean;
  tablesReady: boolean;
  phonesCount: number | null;
  message: string;
}

/** Live status check used by the admin dashboard: verifies the project
    answers, and whether the migration has been run yet. */
export async function checkSupabase(): Promise<SupabaseStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { configured: false, reachable: false, tablesReady: false, phonesCount: null,
      message: "Not configured — NEXT_PUBLIC_SUPABASE_* keys are missing." };
  }
  try {
    const res = await fetch(`${url}/rest/v1/phones?select=id`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
    });
    if (res.status === 200) {
      const rows = (await res.json()) as unknown[];
      return { configured: true, reachable: true, tablesReady: true, phonesCount: rows.length,
        message: `Connected — phones table is live (${rows.length} rows visible to the public key).` };
    }
    const body = await res.text();
    if (body.includes("PGRST205") || res.status === 404) {
      return { configured: true, reachable: true, tablesReady: false, phonesCount: null,
        message: "Connected to your Supabase project, but the tables do not exist yet — run supabase/migrations/001_initial_schema.sql, then supabase/seed.sql in the SQL Editor." };
    }
    return { configured: true, reachable: true, tablesReady: false, phonesCount: null,
      message: `Project answered with HTTP ${res.status} — check keys and RLS policies.` };
  } catch {
    return { configured: true, reachable: false, tablesReady: false, phonesCount: null,
      message: "Could not reach the Supabase project from this browser — check the URL and your connection." };
  }
}
