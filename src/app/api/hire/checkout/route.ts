import { NextResponse } from "next/server";
import { z } from "zod";
import {
  startHireDnaCheckout,
  type HireCheckoutBody,
} from "@/lib/hire-pay-server";
import { HIRE_PRICING_CATEGORIES } from "@/lib/hire-pricing";
import { buildHireQuote } from "@/lib/hire-quote";

const categoryIds = HIRE_PRICING_CATEGORIES.map((c) => c.id) as [
  (typeof HIRE_PRICING_CATEGORIES)[number]["id"],
  ...(typeof HIRE_PRICING_CATEGORIES)[number]["id"][],
];

const ukPostcode =
  /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
const ukPhoneShape = /^[\d\s+()-]{10,20}$/;

function isLikelyUkPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("44") && digits.length >= 12) return true;
  if (digits.startsWith("0") && digits.length >= 10) return true;
  return false;
}

const schema = z
  .object({
    hireType: z.enum(["short", "flex"]),
    categoryId: z.enum(categoryIds),
    startDate: z.string().min(1),
    endDate: z.string().optional(),
    delivery: z.enum([
      "collect_heathrow",
      "collect_ferndown",
      "deliver",
    ]),
    userHeight: z.string().trim().min(1),
    userWeight: z.string().trim().min(1),
    name: z.string().trim().min(2),
    phone: z
      .string()
      .trim()
      .min(10)
      .regex(ukPhoneShape)
      .refine(isLikelyUkPhone),
    email: z.string().trim().email(),
    addressLine1: z.string().trim().min(2),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    postcode: z
      .string()
      .trim()
      .refine((v) => ukPostcode.test(v)),
    notes: z.string().trim().max(2000).optional(),
    vatRelief: z.boolean(),
    termsAccepted: z.boolean(),
    signedName: z.string().trim().min(2),
    company_website: z.string().optional(),
    bookingRef: z.string().optional(),
    /** When true, only return the calculated quote — no payment. */
    quoteOnly: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hireType === "short" && !data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Please choose an end date",
      });
    }
  });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.company_website?.trim()) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (data.quoteOnly) {
      const { resolveDeliveryMiles } = await import("@/lib/hire-pay-server");
      const deliveryMeta = await resolveDeliveryMiles(
        data.delivery,
        data.postcode,
      );
      const quote = buildHireQuote({
        hireType: data.hireType,
        categoryId: data.categoryId,
        startDate: data.startDate,
        endDate: data.endDate,
        delivery: data.delivery,
        deliveryMiles: deliveryMeta?.miles,
        vatRelief: data.vatRelief,
      });
      return NextResponse.json({ success: true, quote });
    }

    const checkout = await startHireDnaCheckout(
      data as HireCheckoutBody,
      request,
    );

    return NextResponse.json({
      success: true,
      paymentData: checkout.paymentData,
      bookingRef: checkout.bookingRef,
      bookingId: checkout.bookingId,
      orderNumber: checkout.orderNumber,
      quote: checkout.quote,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Hire checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
