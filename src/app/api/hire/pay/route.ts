import { NextResponse } from "next/server";
import {
  invokeHireFunction,
  resolveReturnOrigin,
} from "@/lib/hire-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string };
    if (!body.bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }
    const data = await invokeHireFunction(
      "hire-checkout-pay",
      { bookingId: body.bookingId },
      resolveReturnOrigin(request),
    );
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start payment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
