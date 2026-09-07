import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveReturnOrigin } from "@/lib/checkout-server";

const checkoutSchema = z.object({
  planKey: z.enum(["essential", "complete", "total-care"]),
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  postcode: z.string().trim().min(3).max(12),
  equipment: z.string().trim().min(2).max(200),
  notes: z.string().trim().max(2000).optional(),
  website: z.string().trim().max(0).optional(),
});
const verifySchema = z.object({ sessionId: z.string().regex(/^cs_[a-zA-Z0-9_]+$/).max(255) });

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (action !== "checkout" && action !== "verify") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    return NextResponse.json({ error: "Please use the form on our website." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = (action === "checkout" ? checkoutSchema : verifySchema).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Care Plans are temporarily unavailable. Please call 0800 772 3870." }, { status: 503 });
  }
  try {
    const upstream = await fetch(`${url.replace(/\/$/, "")}/functions/v1/care-plan-${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}`, Origin: resolveReturnOrigin(request) },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => null);
    if (!upstream.ok || !data) {
      return NextResponse.json({ error: "We couldn’t complete that request. Please try again or call 0800 772 3870." }, { status: 502 });
    }
    // Return only the existing client contract, never upstream diagnostics or credentials.
    return NextResponse.json(action === "checkout"
      ? { url: data.url, subscriptionId: data.subscriptionId, error: data.error }
      : { status: data.status, planKey: data.planKey, planName: data.planName, error: data.error },
      { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The connection took too long. Please try again or call 0800 772 3870." }, { status: 502 });
  }
}
