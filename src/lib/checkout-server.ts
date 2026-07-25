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
    orderNumber?: string;
    error?: string;
    status?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || `Checkout failed (${res.status})`);
  }

  return data;
}

export function resolveReturnOrigin(request: Request) {
  const fromHeader = request.headers.get("origin");
  if (fromHeader) return fromHeader;

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, "");

  return "http://localhost:3000";
}
