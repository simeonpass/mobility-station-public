/** Browser-side helpers for Care Plan Stripe checkout / verify. */

function supabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Care Plans need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return { url, key };
}

export type CarePlanCheckoutPayload = {
  planKey: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  equipment: string;
  notes?: string;
  /** Honeypot — leave empty for real users. */
  website?: string;
};

export async function startCarePlanCheckout(payload: CarePlanCheckoutPayload) {
  // Silent bot trap — do not call Stripe if honeypot filled.
  if (payload.website?.trim()) {
    return { url: `${window.location.origin}/care-plan/success?bot=1` };
  }

  const { url, key } = supabasePublicConfig();
  const res = await fetch(`${url}/functions/v1/care-plan-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      planKey: payload.planKey,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      postcode: payload.postcode.trim(),
      equipment: payload.equipment.trim(),
      notes: payload.notes?.trim() || undefined,
      website: "",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
    subscriptionId?: string;
  };

  if (!res.ok || !data.url) {
    throw new Error(
      data.error ||
        "Could not start Care Plan checkout. Please try again or call 0800 772 3870.",
    );
  }

  return { url: data.url, subscriptionId: data.subscriptionId };
}

export type CarePlanVerifyResult = {
  status: string;
  planKey?: string;
  planName?: string;
  customerEmail?: string;
  error?: string;
};

/**
 * Poll care-plan-verify until active (or attempts exhausted).
 * Success page receives Stripe session as `?sid=` — API expects POST { sessionId }.
 */
export async function pollCarePlanVerify(
  sessionId: string,
  attempts = 8,
  delayMs = 1500,
): Promise<CarePlanVerifyResult> {
  const { url, key } = supabasePublicConfig();
  let last: CarePlanVerifyResult = { status: "pending" };

  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${url}/functions/v1/care-plan-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    last = (await res.json().catch(() => ({}))) as CarePlanVerifyResult;
    if (last.status === "active") return last;
    if (last.error && last.status !== "pending") return last;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return last;
}
