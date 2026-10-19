import { NextResponse } from "next/server";
import {
  invokeCheckoutFunction,
  resolveReturnOrigin,
} from "@/lib/checkout-server";

/**
 * Called by the order-confirmation page when the customer returns from
 * Stripe. Confirms the Checkout Session with Stripe server-side and, if it is
 * paid, makes sure the order is recorded as paid even if the webhook is late.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderNumber?: string;
      sessionId?: string;
    };
    const orderNumber = String(body.orderNumber || "").trim();
    const sessionId = String(body.sessionId || "").trim();
    if (!orderNumber || !sessionId) {
      return NextResponse.json(
        { error: "Missing order reference" },
        { status: 400 },
      );
    }

    const data = await invokeCheckoutFunction(
      "website-stripe-verify",
      { orderNumber, sessionId },
      resolveReturnOrigin(request),
    );

    return NextResponse.json({
      paid: data.paid === true,
      status: data.status || (data.paid ? "paid" : "unknown"),
      orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not confirm payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
