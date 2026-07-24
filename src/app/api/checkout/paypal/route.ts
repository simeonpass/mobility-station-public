import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/cart";
import {
  invokeCheckoutFunction,
  resolveReturnOrigin,
} from "@/lib/checkout-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const data = await invokeCheckoutFunction(
      "website-paypal-checkout",
      body,
      resolveReturnOrigin(request),
    );

    if (!data.url) {
      return NextResponse.json(
        { error: data.error || "No PayPal checkout URL returned" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: data.url,
      orderNumber: data.orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PayPal checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
