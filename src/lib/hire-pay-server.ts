import { resolveReturnOrigin } from "@/lib/checkout-server";
import { buildHireQuote, type HireDeliveryMode } from "@/lib/hire-quote";
import type { HirePricingCategoryId } from "@/lib/hire-pricing";
import { lookupCoverage } from "@/lib/service-area";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
}

export type HireCheckoutBody = {
  hireType: "short" | "flex";
  categoryId: HirePricingCategoryId;
  startDate: string;
  endDate?: string;
  delivery: HireDeliveryMode;
  userHeight: string;
  userWeight: string;
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  notes?: string;
  vatRelief: boolean;
  termsAccepted: boolean;
  signedName: string;
  company_website?: string;
  bookingRef?: string;
};

export async function resolveDeliveryMiles(
  delivery: HireDeliveryMode,
  postcode: string,
) {
  if (delivery !== "deliver") return null;
  const coverage = await lookupCoverage(postcode);
  if (coverage.kind === "not-found") {
    throw new Error("Please enter a valid UK postcode for delivery");
  }
  if (coverage.kind === "error") {
    throw new Error("We couldn’t check that postcode. Please try again.");
  }
  if (coverage.kind === "out-of-range") {
    throw new Error(
      `That postcode is outside our hire delivery area (about ${coverage.miles.toFixed(0)} miles from ${coverage.workshop.name}). Please choose free branch collection, or call us.`,
    );
  }
  return { miles: coverage.miles, workshopId: coverage.workshop.id, postcode: coverage.postcode };
}

/**
 * Create a hire booking and start DNA hosted checkout.
 * Amounts are recalculated server-side from the published price card.
 */
export async function startHireDnaCheckout(
  body: HireCheckoutBody,
  request: Request,
) {
  if (!body.termsAccepted) {
    throw new Error("Please accept the hire terms to continue");
  }
  if (!body.signedName.trim()) {
    throw new Error("Please type your name to sign the hire agreement");
  }

  const deliveryMeta = await resolveDeliveryMiles(body.delivery, body.postcode);
  const quote = buildHireQuote({
    hireType: body.hireType,
    categoryId: body.categoryId,
    startDate: body.startDate,
    endDate: body.endDate,
    delivery: body.delivery,
    deliveryMiles: deliveryMeta?.miles,
    vatRelief: body.vatRelief,
  });

  const bookingRef =
    body.bookingRef?.trim() ||
    `HIRE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  const returnOrigin = resolveReturnOrigin(request);
  const description =
    body.hireType === "flex"
      ? `Flex hire — ${quote.category.label} from ${quote.startDate}`
      : `Short-term hire — ${quote.category.label} ${quote.startDate} to ${quote.endDate}`;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLIC_SITE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Hire checkout is not configured");
    }
    console.info("Hire DNA checkout (dev fallback):", {
      bookingRef,
      quote,
      body,
    });
    // Dev cannot open real DNA without the edge function.
    throw new Error(
      "Hire card payment needs the Lovable edge function website-hire-checkout. Booking totals calculated correctly — deploy that function to take payment.",
    );
  }

  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/functions/v1/website-hire-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      Origin: returnOrigin,
    },
    body: JSON.stringify({
      bookingRef,
      amount: quote.total,
      currency: "GBP",
      description,
      enquiryType: "hire",
      hireType: body.hireType,
      categoryId: body.categoryId,
      categoryLabel: quote.category.label,
      startDate: quote.startDate,
      endDate: quote.endDate,
      days: quote.days,
      quote: {
        hireChargeExVat: quote.hireChargeExVat,
        deliveryOrSetupExVat: quote.deliveryOrSetupExVat,
        deliveryOrSetupLabel: quote.deliveryOrSetupLabel,
        deposit: quote.deposit,
        depositLabel: quote.depositLabel,
        vatAmount: quote.vatAmount,
        vatRelief: body.vatRelief,
        total: quote.total,
        lineItems: quote.lineItems,
      },
      delivery: body.delivery,
      preferredBranch:
        body.delivery === "collect_ferndown"
          ? "ferndown"
          : body.delivery === "collect_heathrow"
            ? "heathrow"
            : deliveryMeta?.workshopId,
      customer: {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        firstName: body.name.trim().split(" ")[0] || body.name.trim(),
        lastName:
          body.name.trim().split(" ").slice(1).join(" ") || body.name.trim(),
      },
      address: {
        addressLine1: body.addressLine1.trim(),
        addressLine2: body.addressLine2?.trim() || "",
        city: body.city.trim(),
        postcode: (deliveryMeta?.postcode || body.postcode).trim().toUpperCase(),
      },
      userHeight: body.userHeight.trim(),
      userWeight: body.userWeight.trim(),
      notes: body.notes?.trim() || undefined,
      termsAccepted: true,
      signedName: body.signedName.trim(),
      signedAt: new Date().toISOString(),
      returnUrl: `${returnOrigin}/hire/thank-you?payment=success&ref=${encodeURIComponent(bookingRef)}&provider=dna`,
      failureReturnUrl: `${returnOrigin}/hire/thank-you?payment=failed&ref=${encodeURIComponent(bookingRef)}&provider=dna`,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
    paymentData?: Record<string, unknown>;
    bookingId?: string;
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
    bookingRef,
    bookingId: data.bookingId || bookingRef,
    orderNumber: data.orderNumber || bookingRef,
    quote,
  };
}
