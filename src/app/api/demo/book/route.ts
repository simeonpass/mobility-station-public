import { NextResponse } from "next/server";
import {
  calculateDemoFee,
  demoBookingSchema,
} from "@/lib/demo-booking";
import {
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

    // Honeypot — backend spam filter + silent discard for bots.
    if (booking.company_website?.trim()) {
      return NextResponse.json({
        success: true,
        bookingRef: newBookingRef(),
        feeGbp: 0,
        requiresPayment: false,
      });
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
      // Some Lovable deployments may return DNA data from the enquiry function.
      paymentData: enquiry.paymentData,
      orderNumber: enquiry.orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not submit demonstration booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
