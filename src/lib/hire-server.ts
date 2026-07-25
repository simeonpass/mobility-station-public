function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY");
  }
  return { url, key };
}

export async function invokeHireFunction(
  functionName:
    | "create-hire-booking"
    | "hire-update-fulfilment"
    | "hire-checkout-pay"
    | "hire-revolut-checkout",
  body: Record<string, unknown>,
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

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    throw new Error(
      (typeof data.error === "string" && data.error) ||
        `Hire request failed (${res.status})`,
    );
  }

  if (typeof data.error === "string" && data.error) {
    throw new Error(data.error);
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

export async function getHireBooking(id: string) {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/get_hire_booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify({ _id: id }),
  });
  if (!res.ok) return null;
  return (await res.json()) as Record<string, unknown> | null;
}

export async function updateHireBooking(
  id: string,
  patch: Record<string, unknown>,
) {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(
    `${url}/rest/v1/hire_bookings?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        apikey: key,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(patch),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update booking (${res.status})`);
  }
}

export async function uploadHireSignature(bookingId: string, pngBase64: string) {
  const { url, key } = getSupabaseConfig();
  const binary = Buffer.from(
    pngBase64.replace(/^data:image\/png;base64,/, ""),
    "base64",
  );
  const path = `${bookingId}/signature-${Date.now()}.png`;
  const res = await fetch(
    `${url}/storage/v1/object/hire-documents/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "image/png",
        "x-upsert": "true",
      },
      body: binary,
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Signature upload failed");
  }
  return path;
}
