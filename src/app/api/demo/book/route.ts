import { NextResponse } from "next/server";
import {
  calculateDemoFee,
  demoBookingSchema,
} from "@/lib/demo-booking";
import {
  assertHomeDemoInArea,
  newBookingRef,
  resolveDemoPaymentStatus,
  submitDemoEnquiry,
} from "@/lib/demo-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = demoBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const booking = parsed.data;

    // Do not silently discard bookings based only on the legacy honeypot field.
    // Browser/password-manager autofill can populate off-screen fields. The shared
    // enquiry service still applies its content-based spam checks server-side.

    if (booking.location === "home") {
      const coverage = await assertHomeDemoInArea(booking.postcode);
      booking.coveredBy = coverage.workshop.id;
      booking.postcode = coverage.postcode;
    }

    const fee = calculateDemoFee(booking);
    const paymentStatus = resolveDemoPaymentStatus(fee);
    const bookingRef =
      (typeof body.bookingRef === "string" && body.bookingRef.trim()) ||
      newBookingRef();

    const enquiry = await submitDemoEnquiry({
      booking,
      fee,
      paymentStatus,
      bookingRef,
    });

    return NextResponse.json({
      success: true,
      bookingRef,
      feeGbp: fee.amountGbp,
      feeLabel: fee.label,
      feeExplanation: fee.explanation,
      requiresPayment: fee.amountGbp > 0,
      paymentStatus,
      coveredBy: booking.coveredBy,
      // Some Lovable deployments may return DNA data from the enquiry function.
      paymentData: enquiry.paymentData,
      orderNumber: enquiry.orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not submit demonstration booking";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
