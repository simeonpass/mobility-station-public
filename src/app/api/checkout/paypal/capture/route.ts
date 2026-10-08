import { NextResponse } from "next/server";
import {
  invokeCheckoutFunction,
  resolveReturnOrigin,
} from "@/lib/checkout-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderNumber?: string };
    if (!body.orderNumber) {
      return NextResponse.json(
        { error: "Missing orderNumber" },
        { status: 400 },
      );
    }

    const data = await invokeCheckoutFunction(
      "website-paypal-capture",
      { orderNumber: body.orderNumber },
      resolveReturnOrigin(request),
    );

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PayPal capture failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
