import { NextResponse } from "next/server";

/** @deprecated Use /api/checkout/stripe — kept so old clients fail clearly. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Revolut checkout has been replaced by Stripe. Use /api/checkout/stripe.",
    },
    { status: 410 },
  );
}
