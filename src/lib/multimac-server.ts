import type { CheckoutPayload } from "@/lib/cart";
import {
  buildFittingEnquiryMessage,
  createFittingBookingRef,
  multimacFittingBookingSchema,
  type MultimacFittingBooking,
} from "@/lib/multimac-fitting";
import { SITE } from "@/lib/seo";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
}

function bookingFromPayload(
  body: CheckoutPayload,
): MultimacFittingBooking {
  const raw = body.fittingBooking;
  const parsed = multimacFittingBookingSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      "Fitting booking details are incomplete. Please start again from the Multimac fitting page.",
    );
  }
  return parsed.data;
}

export async function submitMultimacFittingEnquiry(opts: {
  booking: MultimacFittingBooking;
  customer: CheckoutPayload["customer"];
  bookingRef: string;
}) {
  const { booking, customer, bookingRef } = opts;
  const message = buildFittingEnquiryMessage(booking, customer, bookingRef);
  const name = `${customer.firstName} ${customer.lastName}`.trim();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLIC_SITE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Enquiry service is not configured");
    }
    console.info("Multimac fitting enquiry (dev fallback):", {
      bookingRef,
      message,
      booking,
      customer,
    });
    return { success: true as const, bookingRef };
  }

  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/functions/v1/send-contact-enquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify({
      name,
      email: customer.email,
      phone: customer.phone,
      message,
      enquiryType: "service",
      productName: "Multimac professional fitting",
      bookingRef,
      company_website: "",
    }),
  });

  const result = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
  };

  if (!res.ok || result.success === false) {
    throw new Error(
      result.error ||
        `Something went wrong. Please try again or call us on ${SITE.phone}.`,
    );
  }

  return { success: true as const, bookingRef };
}

/**
 * Multimac fitting bookings are requested online and paid by phone: the
 * workshop confirms the date, then takes the fee. No card session is created.
 */
export async function requestMultimacFitting(body: CheckoutPayload) {
  const booking = bookingFromPayload(body);
  // Always mint the reference here. A value typed into order notes must not
  // collide with another fitting.
  const bookingRef = createFittingBookingRef();
  await submitMultimacFittingEnquiry({
    booking: { ...booking, company_website: "" },
    customer: body.customer,
    bookingRef,
  });
  return { bookingRef };
}
