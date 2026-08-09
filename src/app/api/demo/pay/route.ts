import { NextResponse } from "next/server";
import {
  calculateDemoFee,
  demoBookingSchema,
} from "@/lib/demo-booking";
import {
  assertHomeDemoInArea,
  newBookingRef,
  startDemoDnaCheckout,
} from "@/lib/demo-server";

/**
 * Start (or retry) DNA hosted checkout for a £195 home demonstration fee.
 * Booking details are re-validated so retry links cannot invent a lower fee.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = demoBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Booking details are incomplete. Please start again.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const booking = parsed.data;

    if (booking.company_website?.trim()) {
      return NextResponse.json({
        success: true,
        bookingRef: newBookingRef(),
        skipped: true,
      });
    }

    // Never take payment outside the home demonstration area.
    if (booking.location !== "home") {
      return NextResponse.json(
        { error: "Payment is only required for home demonstrations." },
        { status: 400 },
      );
    }
    const coverage = await assertHomeDemoInArea(booking.postcode);
    booking.coveredBy = coverage.workshop.id;
    booking.postcode = coverage.postcode;

    const fee = calculateDemoFee(booking);
    if (fee.amountGbp <= 0) {
      return NextResponse.json(
        { error: "No payment is required for this demonstration." },
        { status: 400 },
      );
    }

    const bookingRef =
      (typeof body.bookingRef === "string" && body.bookingRef.trim()) ||
      newBookingRef();

    const checkout = await startDemoDnaCheckout({
      booking,
      bookingRef,
      request,
    });

    return NextResponse.json({
      success: true,
      paymentData: checkout.paymentData,
      orderNumber: checkout.orderNumber,
      bookingRef: checkout.bookingRef,
      feeGbp: fee.amountGbp,
      coveredBy: booking.coveredBy,
      description: `Home Demonstration Fee — ${booking.preferredDate}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "DNA checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
