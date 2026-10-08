import { NextResponse } from "next/server";
import { updateHireBooking } from "@/lib/hire-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      bookingId?: string;
      billing_address_line1?: string;
      billing_address_city?: string;
      billing_address_postcode?: string;
      delivery_address?: string | null;
    };
    if (!body.bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }
    await updateHireBooking(body.bookingId, {
      billing_address_line1: body.billing_address_line1?.trim(),
      billing_address_city: body.billing_address_city?.trim(),
      billing_address_postcode: body.billing_address_postcode
        ?.trim()
        .toUpperCase(),
      delivery_address: body.delivery_address ?? null,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save address";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
