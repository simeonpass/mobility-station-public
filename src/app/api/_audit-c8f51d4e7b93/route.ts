import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEST_EMAIL = "checkout-audit-20260823@mobilitystation.co.uk";
const payload = {
  customer: {
    email: TEST_EMAIL,
    firstName: "Checkout",
    lastName: "Audit",
    phone: "07000000000",
  },
  items: [
    {
      stockItemId: "7a536600-a786-4d57-95a5-c8d1af9fb94b",
      productName: "test product",
      quantity: 1,
      unitPrice: 1,
      isUsed: false,
    },
  ],
  fulfillmentMethod: "collection",
  collectionBranch: "heathrow",
  isVatExempt: false,
  notes: "Automated checkout audit 2026-08-23 — do not fulfil",
};

async function call(path: string) {
  const res = await fetch(`https://mobilitystation.co.uk${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

export async function GET() {
  const paypal = await call("/api/checkout/paypal");
  const dna = await call("/api/checkout/dna");

  return NextResponse.json(
    {
      paypal: {
        status: paypal.status,
        ok: paypal.ok,
        orderNumber: paypal.data?.orderNumber ?? null,
        hasApprovalUrl: typeof paypal.data?.url === "string" && paypal.data.url.length > 0,
        error: paypal.data?.error ?? null,
      },
      dna: {
        status: dna.status,
        ok: dna.ok,
        orderNumber: dna.data?.orderNumber ?? null,
        hasPaymentData: !!dna.data?.paymentData,
        amount: dna.data?.paymentData?.amount ?? null,
        currency: dna.data?.paymentData?.currency ?? null,
        error: dna.data?.error ?? null,
      },
      testEmail: TEST_EMAIL,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
