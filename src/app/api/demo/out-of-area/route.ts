import { NextResponse } from "next/server";
import { outOfAreaDemoRequestSchema } from "@/lib/demo-booking";
import {
  newBookingRef,
  submitOutOfAreaDemoRequest,
} from "@/lib/demo-server";
import { lookupCoverage } from "@/lib/service-area";

/**
 * Accept a home-demo request from outside standard coverage.
 * No online payment is taken — the team follows up manually.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = outOfAreaDemoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Never return a fake success solely because an off-screen field was filled.
    // Autofill tools can populate honeypots; the shared enquiry service applies
    // its own content-based spam checks without risking a lost genuine lead.

    const coverage = await lookupCoverage(data.postcode);
    if (coverage.kind === "not-found") {
      return NextResponse.json(
        { error: "Please enter a valid UK postcode." },
        { status: 400 },
      );
    }
    if (coverage.kind === "covered") {
      return NextResponse.json(
        {
          error:
            "Good news — that postcode is inside our home demonstration area. Please continue with the standard home demo booking instead.",
          coveredBy: coverage.workshop.id,
        },
        { status: 400 },
      );
    }

    const bookingRef =
      (typeof body.bookingRef === "string" && body.bookingRef.trim()) ||
      newBookingRef();

    await submitOutOfAreaDemoRequest({
      request: data,
      bookingRef,
    });

    return NextResponse.json({
      success: true,
      bookingRef,
      outOfArea: true,
      requiresPayment: false,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not send your demonstration request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
