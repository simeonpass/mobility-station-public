import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/cart";
import {
  invokeCheckoutFunction,
  resolveReturnOrigin,
} from "@/lib/checkout-server";
import { isFittingServiceProduct } from "@/lib/multimac-fitting";
import { startMultimacFittingCheckout } from "@/lib/multimac-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const isMultimacFitting =
      Boolean(body.fittingBooking) ||
      (body.items ?? []).some((item) =>
        isFittingServiceProduct({
          stockItemId: item.stockItemId,
          id: item.stockItemId,
        }),
      );

    if (isMultimacFitting) {
      const data = await startMultimacFittingCheckout(body, request);
      if ("skipped" in data && data.skipped) {
        return NextResponse.json({
          skipped: true,
          orderNumber: data.bookingRef,
        });
      }
      if (!("paymentData" in data) || !data.paymentData) {
        return NextResponse.json(
          { error: "No DNA payment data returned" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        paymentData: data.paymentData,
        orderNumber: data.orderNumber,
      });
    }

    const data = await invokeCheckoutFunction(
      "website-checkout",
      body,
      resolveReturnOrigin(request),
    );

    if (!data.paymentData) {
      return NextResponse.json(
        { error: data.error || "No DNA payment data returned" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      paymentData: data.paymentData,
      orderNumber: data.orderNumber,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "DNA checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
