import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let projectRef: string | null = null;

  try {
    if (rawUrl) {
      const host = new URL(rawUrl).hostname;
      projectRef = host.endsWith(".supabase.co") ? host.split(".")[0] : host;
    }
  } catch {
    projectRef = null;
  }

  return NextResponse.json({
    ok: Boolean(rawUrl),
    projectRef,
    serverKeyConfigured: Boolean(process.env.SUPABASE_PUBLIC_SITE_KEY),
    browserUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    browserKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
}
