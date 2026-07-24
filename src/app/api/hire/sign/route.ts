import { NextResponse } from "next/server";
import { updateHireBooking, uploadHireSignature } from "@/lib/hire-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      bookingId?: string;
      signedName?: string;
      signatureDataUrl?: string;
    };
    if (!body.bookingId || !body.signedName?.trim() || !body.signatureDataUrl) {
      return NextResponse.json(
        { error: "Signature details required" },
        { status: 400 },
      );
    }
    const path = await uploadHireSignature(
      body.bookingId,
      body.signatureDataUrl,
    );
    await updateHireBooking(body.bookingId, {
      terms_signature_url: path,
      terms_signed_at: new Date().toISOString(),
      terms_signed_name: body.signedName.trim(),
    });
    return NextResponse.json({ success: true, path });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
