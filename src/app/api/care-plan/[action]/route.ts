import { NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  planKey: z.enum(["essential", "complete", "total-care"]),
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30),
  postcode: z.string().trim().max(20),
  equipment: z.string().trim().max(1000),
  notes: z.string().trim().max(2000).optional(),
  website: z.literal("").optional(),
});
const verifySchema = z.object({
  sessionId: z.string().startsWith("cs_").max(255),
});

/** Use the existing server connection; never ship its key to the browser. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (action !== "checkout" && action !== "verify") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") && request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const schema = action === "checkout" ? checkoutSchema : verifySchema;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your Care Plan details." }, { status: 400 });
  }
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Care Plans are temporarily unavailable. Please call 0800 772 3870." }, { status: 503 });
  }
  try {
    const response = await fetch(`${url}/functions/v1/care-plan-${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}`, Origin: origin },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not contact the Care Plan service. Please try again or call 0800 772 3870." }, { status: 502 });
  }
}
