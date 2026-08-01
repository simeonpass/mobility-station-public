import { NextResponse } from "next/server";

/**
 * Online hire card payment (hire-checkout-pay) is not deployed on the live
 * Supabase project. Public hire is enquiry-led via send-hire-enquiry.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Online hire card payment isn’t available on this site yet. Please call us or send a hire enquiry and we’ll take payment when we confirm your booking.",
    },
    { status: 501 },
  );
}
