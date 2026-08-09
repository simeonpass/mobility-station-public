import { NextResponse } from "next/server";
import {
  invokeHireFunction,
  resolveReturnOrigin,
} from "@/lib/hire-server";

/**
 * Retry DNA payment for an existing hire booking id (legacy checkout path).
 * New bookings should use POST /api/hire/checkout (category self-serve).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bookingId?: string };
    if (!body.bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 },
      );
    }

    const data = await invokeHireFunction(
      "hire-checkout-pay",
      { bookingId: body.bookingId },
      resolveReturnOrigin(request),
    );

    const paymentData = data.paymentData as Record<string, unknown> | undefined;
    if (!paymentData) {
      return NextResponse.json(
        { error: (data.error as string) || "No DNA payment data returned" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      paymentData,
      orderNumber: data.orderNumber ?? body.bookingId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Hire payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
