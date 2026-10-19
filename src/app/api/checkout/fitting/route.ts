import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/cart";
import { requestMultimacFitting } from "@/lib/multimac-server";

/**
 * Multimac fitting booking request. No card payment is taken online: the
 * workshop confirms the date and takes the fee by phone.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    if (!body.fittingBooking) {
      return NextResponse.json(
        { error: "No fitting booking details were supplied." },
        { status: 400 },
      );
    }
    if (!body.customer?.email || !body.customer?.firstName) {
      return NextResponse.json(
        { error: "Please fill in your contact details." },
        { status: 400 },
      );
    }
    const { bookingRef } = await requestMultimacFitting(body);
    return NextResponse.json({ success: true, orderNumber: bookingRef });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Booking request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
