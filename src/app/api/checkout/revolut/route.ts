import { NextResponse } from "next/server";

/** @deprecated Use /api/checkout/dna — kept so old clients fail clearly. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Revolut checkout has been replaced by DNA Payments. Use /api/checkout/dna.",
    },
    { status: 410 },
  );
}
