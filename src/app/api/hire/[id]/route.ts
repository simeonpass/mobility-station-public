import { NextResponse } from "next/server";
import { getHireBooking } from "@/lib/hire-server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const booking = await getHireBooking(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
