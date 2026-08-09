import {
  buildDemoEnquiryMessage,
  calculateDemoFee,
  createBookingRef,
  dnaLineDescription,
  type DemoBookingPayload,
  type DemoFeeResult,
  type PaymentStatus,
} from "@/lib/demo-booking";
import { resolveReturnOrigin } from "@/lib/checkout-server";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
}

export function resolveDemoPaymentStatus(fee: DemoFeeResult): PaymentStatus {
  if (fee.amountGbp === 0) {
    return fee.waived ? "WAIVED" : "FREE";
  }
  return "PENDING";
}

export async function submitDemoEnquiry(opts: {
  booking: DemoBookingPayload;
  fee: DemoFeeResult;
  paymentStatus: PaymentStatus;
  bookingRef: string;
  dnaRef?: string;
}) {
  const { booking, fee, paymentStatus, bookingRef, dnaRef } = opts;
  const message = [
    buildDemoEnquiryMessage(booking, fee, paymentStatus, dnaRef),
    `Booking Ref: ${bookingRef}`,
  ].join("\n");

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLIC_SITE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Enquiry service is not configured");
    }
    console.info("Demo enquiry (dev fallback):", {
      bookingRef,
      paymentStatus,
      fee,
      message,
      booking,
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
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      message,
      enquiryType: "demo",
      productName: booking.productName,
      postcode: booking.postcode,
      addressLine1: booking.addressLine1,
      addressLine2: booking.addressLine2 || undefined,
      city: booking.city,
      vehicleMake: booking.vehicleMake || undefined,
      vehicleModel: booking.vehicleModel || undefined,
      vehicleReg: booking.vehicleReg || undefined,
      bookingRef,
      demoFee: fee.amountGbp,
      paymentStatus,
      company_website: booking.company_website || "",
    }),
  });

  const result = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
    paymentData?: Record<string, unknown>;
    orderNumber?: string;
  };

  if (!res.ok || result.success === false) {
    throw new Error(
      result.error ||
        "Something went wrong. Please try again or call us on 0800 772 3870.",
    );
  }

  return {
    success: true as const,
    bookingRef,
    paymentData: result.paymentData,
    orderNumber: result.orderNumber,
  };
}

/**
 * Start DNA hosted checkout for the £195 home demonstration fee.
 * Prefers a dedicated edge function; never fabricates payment data locally.
 */
export async function startDemoDnaCheckout(opts: {
  booking: DemoBookingPayload;
  bookingRef: string;
  request: Request;
}) {
  const { booking, bookingRef, request } = opts;
  const fee = calculateDemoFee(booking);
  if (fee.amountGbp <= 0) {
    throw new Error("No payment is required for this demonstration");
  }

  const { url, key } = getSupabaseConfig();
  const returnOrigin = resolveReturnOrigin(request);
  const description = dnaLineDescription(booking.preferredDate);

  const res = await fetch(`${url}/functions/v1/website-demo-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      Origin: returnOrigin,
    },
    body: JSON.stringify({
      bookingRef,
      amount: fee.amountGbp,
      description,
      lineItemDescription: description,
      enquiryType: "demo",
      customer: {
        email: booking.email,
        firstName: booking.name.split(" ")[0] || booking.name,
        lastName: booking.name.split(" ").slice(1).join(" ") || booking.name,
        phone: booking.phone,
      },
      address: {
        addressLine1: booking.addressLine1,
        addressLine2: booking.addressLine2,
        city: booking.city,
        postcode: booking.postcode,
      },
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      productName: booking.productName,
      returnUrl: `${returnOrigin}/book-a-demo/thank-you?payment=success&ref=${encodeURIComponent(bookingRef)}&provider=dna`,
      failureReturnUrl: `${returnOrigin}/book-a-demo/thank-you?payment=failed&ref=${encodeURIComponent(bookingRef)}&provider=dna`,
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
      data.error ||
        "Could not start card payment. Please try again or call 0800 772 3870.",
    );
  }

  return {
    paymentData: data.paymentData,
    orderNumber: data.orderNumber || bookingRef,
    bookingRef,
  };
}

export function newBookingRef() {
  return createBookingRef();
}
