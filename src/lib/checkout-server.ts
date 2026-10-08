import type { CheckoutPayload } from "@/lib/cart";
import { checkDeliveryZone } from "@/lib/delivery-zone";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
}

/**
 * Takeaway credit only for branch collection or local-service-area delivery.
 * Clears the flag when ineligible so the edge function never applies credit.
 */
export async function withTakeawayEligibility(
  body: CheckoutPayload,
): Promise<CheckoutPayload> {
  if (!body.takeawayRequested) return body;

  if (body.fulfillmentMethod === "collection") {
    return body;
  }

  if (body.fulfillmentMethod === "delivery" && body.deliveryPostcode) {
    const zone = await checkDeliveryZone(body.deliveryPostcode);
    if (zone.status === "local") return body;
  }

  return { ...body, takeawayRequested: false };
}

export async function invokeCheckoutFunction(
  functionName:
    | "website-checkout"
    | "website-stripe-checkout"
    | "website-paypal-checkout"
    | "website-paypal-capture",
  body: CheckoutPayload | { orderNumber: string },
  returnOrigin: string,
) {
  const { url, key } = getSupabaseConfig();
  const payload =
    "items" in body ? await withTakeawayEligibility(body) : body;

  const res = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      Origin: returnOrigin,
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    url?: string;
    checkoutUrl?: string;
    paymentData?: Record<string, unknown>;
    orderNumber?: string;
    error?: string;
    status?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || `Checkout failed (${res.status})`);
  }

  return data;
}

function isPublicOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "[::1]" &&
      !hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
}

/**
 * Origin passed to Supabase checkout functions for DNA/PayPal return URLs.
 * DNA hosted checkout rejects localhost hosts, so local/dev falls back to the
 * public site URL.
 */
export function resolveReturnOrigin(request: Request) {
  const fromHeader = request.headers.get("origin");
  if (fromHeader && isPublicOrigin(fromHeader)) return fromHeader;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site && isPublicOrigin(site)) return site;

  return "https://mobilitystation.co.uk";
}
