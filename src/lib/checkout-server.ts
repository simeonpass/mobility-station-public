import type { CheckoutPayload } from "@/lib/cart";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
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

  const res = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
      Origin: returnOrigin,
    },
    body: JSON.stringify(body),
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
