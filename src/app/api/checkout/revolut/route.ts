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
      "website-checkout",
      body,
      resolveReturnOrigin(request),
    );

    const url = data.checkoutUrl ?? data.url;
    if (!url) {
      return NextResponse.json(
        { error: data.error || "No Revolut checkout URL returned" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url,
      orderNumber: data.orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Revolut checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
