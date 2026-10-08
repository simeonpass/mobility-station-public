import { resolveReturnOrigin } from "@/lib/checkout-server";
import type { CheckoutPayload } from "@/lib/cart";
import {
  MULTIMAC_FITTING_PRICE_GBP,
  buildFittingEnquiryMessage,
  createFittingBookingRef,
  dnaFittingDescription,
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

async function startDnaCheckout(opts: {
  functionName: "website-service-checkout" | "website-demo-checkout";
  booking: MultimacFittingBooking;
  customer: CheckoutPayload["customer"];
  bookingRef: string;
  request: Request;
}) {
  const { functionName, booking, customer, bookingRef, request } = opts;
  const { url, key } = getSupabaseConfig();
  const returnOrigin = resolveReturnOrigin(request);
  const description = dnaFittingDescription(booking.preferredDate);

  const res = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      Origin: returnOrigin,
    },
    body: JSON.stringify({
      bookingRef,
      amount: MULTIMAC_FITTING_PRICE_GBP,
      description,
      lineItemDescription: description,
      enquiryType: "multimac-fitting",
      customer: {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
      },
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      productName: "Multimac professional fitting",
      returnUrl: `${returnOrigin}/order-confirmation?payment=success&order=${encodeURIComponent(bookingRef)}&provider=dna&service=multimac`,
      failureReturnUrl: `${returnOrigin}/order-confirmation?payment=failed&order=${encodeURIComponent(bookingRef)}&provider=dna&service=multimac`,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
    paymentData?: Record<string, unknown>;
    orderNumber?: string;
  };

  if (!res.ok || !data.paymentData) {
    throw new Error(
      data.error || `Could not start card payment (${functionName})`,
    );
  }

  return {
    paymentData: data.paymentData,
    orderNumber: data.orderNumber || bookingRef,
    bookingRef,
  };
}

/**
 * Take £225 inc VAT for a Multimac fitting via DNA hosted checkout.
 * Prefer a dedicated service function; fall back to the demo checkout
 * function which already accepts an arbitrary amount + return URLs.
 */
export async function startMultimacFittingCheckout(
  body: CheckoutPayload,
  request: Request,
) {
  const booking = bookingFromPayload(body);
  // Always mint the reference here. A value typed into order notes must not
  // collide with another fitting.
  const bookingRef = createFittingBookingRef();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLIC_SITE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Checkout is not configured");
    }
    console.info("Multimac fitting DNA checkout (dev fallback):", {
      bookingRef,
      amount: MULTIMAC_FITTING_PRICE_GBP,
      booking,
    });
    throw new Error(
      "Card payment for Multimac fitting needs the DNA checkout function in this environment. The booking details were logged locally.",
    );
  }

  let payment: Awaited<ReturnType<typeof startDnaCheckout>>;
  try {
    payment = await startDnaCheckout({
      functionName: "website-service-checkout",
      booking,
      customer: body.customer,
      bookingRef,
      request,
    });
  } catch (serviceError) {
    try {
      payment = await startDnaCheckout({
        functionName: "website-demo-checkout",
        booking,
        customer: body.customer,
        bookingRef,
        request,
      });
    } catch {
      throw new Error(
        serviceError instanceof Error
          ? serviceError.message
          : `Could not start card payment. Please try again or call ${SITE.phone}.`,
      );
    }
  }

  // Tell the workshop only after a card session exists, and still mark it
  // unpaid. A filled honeypot is ignored — password managers hit that field.
  try {
    await submitMultimacFittingEnquiry({
      booking: { ...booking, company_website: "" },
      customer: body.customer,
      bookingRef,
    });
  } catch (error) {
    console.error("Multimac fitting enquiry failed after card session:", error);
  }

  return payment;
}
