import { NextResponse } from "next/server";
import {
  invokeHireFunction,
  resolveReturnOrigin,
} from "@/lib/hire-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = await invokeHireFunction(
      "create-hire-booking",
      body,
      resolveReturnOrigin(request),
    );

    // Prefer our Next path regardless of edge function path heuristics
    const bookingId = String(data.bookingId ?? "");
    const origin = resolveReturnOrigin(request);
    const redirectUrl = bookingId
      ? `${origin}/hire/checkout/${bookingId}`
      : String(data.redirectUrl ?? "");

    return NextResponse.json({ ...data, redirectUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create hire booking";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
