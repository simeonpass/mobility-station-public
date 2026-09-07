/** Same-origin Care Plan requests use the site's existing server configuration. */

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
  const res = await fetch("/api/care-plan/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      planKey: payload.planKey,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      postcode: payload.postcode.trim(),
      equipment: payload.equipment.trim(),
      notes: payload.notes?.trim() || undefined,
      website: payload.website || "",
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
  let last: CarePlanVerifyResult = { status: "pending" };

  for (let i = 0; i < attempts; i++) {
    const res = await fetch("/api/care-plan/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });
    last = (await res.json().catch(() => ({}))) as CarePlanVerifyResult;
    if (!res.ok) return { status: "error", error: last.error || "We couldn’t confirm your plan. Please try again or call us." };
    if (last.status === "active") return last;
    if (last.error && last.status !== "pending") return last;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return last;
}
