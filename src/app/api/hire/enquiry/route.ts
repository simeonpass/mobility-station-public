import { NextResponse } from "next/server";
import { z } from "zod";
import { createBookingRef } from "@/lib/demo-booking";
import { hireCategoryById, VAT_RELIEF_DECLARATION } from "@/lib/hire-pricing";
import { hasSupabase } from "@/lib/supabase";

const ukPostcode =
  /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
const ukPhoneShape = /^[\d\s+()-]{10,20}$/;

function isLikelyUkPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("44") && digits.length >= 12) return true;
  if (digits.startsWith("0") && digits.length >= 10) return true;
  return false;
}

const hireEnquirySchema = z
  .object({
    hireType: z.enum(["short", "flex"]),
    categoryId: z.string().min(1),
    categoryLabel: z.string().optional(),
    startDate: z.string().min(1, "Please choose a start date"),
    endDate: z.string().optional(),
    userHeight: z.string().trim().min(1, "Please enter user height"),
    userWeight: z.string().trim().min(1, "Please enter user weight"),
    delivery: z.enum([
      "collect_heathrow",
      "collect_ferndown",
      "deliver",
    ]),
    name: z.string().trim().min(2, "Please enter your name"),
    phone: z
      .string()
      .trim()
      .min(10)
      .regex(ukPhoneShape)
      .refine(isLikelyUkPhone, {
        message: "Please enter a valid UK phone number (starting with 0 or +44)",
      }),
    email: z.string().trim().email(),
    addressLine1: z.string().trim().optional(),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().optional(),
    postcode: z
      .string()
      .trim()
      .refine((v) => ukPostcode.test(v), "Please enter a valid UK postcode"),
    notes: z.string().trim().max(2000).optional(),
    vatRelief: z.boolean().optional(),
    company_website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hireType === "short" && !data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Please choose an end date",
      });
    }
    if (data.delivery === "deliver") {
      if (!data.addressLine1?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["addressLine1"],
          message: "Please enter the delivery address",
        });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["city"],
          message: "Please enter the town / city",
        });
      }
    }
  });

function deliveryLabel(
  delivery: z.infer<typeof hireEnquirySchema>["delivery"],
  postcode: string,
) {
  if (delivery === "collect_heathrow") return "Collect from Heathrow";
  if (delivery === "collect_ferndown") return "Collect from Ferndown";
  return `Deliver to ${postcode}`;
}

function buildHireMessage(data: z.infer<typeof hireEnquirySchema>) {
  const category =
    data.categoryLabel ||
    hireCategoryById(data.categoryId)?.label ||
    data.categoryId;
  const endOrTerm =
    data.hireType === "flex"
      ? "Flex — 3 month minimum"
      : data.endDate || "";

  const lines = [
    "Enquiry Type: Hire",
    `Hire Type: ${data.hireType === "flex" ? "Flex (long term)" : "Short-term"}`,
    `Category: ${category}`,
    `Start Date: ${data.startDate}`,
    `End Date / Term: ${endOrTerm}`,
    `User Height / Weight: ${data.userHeight.trim()} / ${data.userWeight.trim()}`,
    `Delivery: ${deliveryLabel(data.delivery, data.postcode.trim().toUpperCase())}`,
    `VAT relief: ${data.vatRelief ? "Yes — declaration confirmed" : "No / not claimed"}`,
  ];

  if (data.vatRelief) {
    lines.push(`VAT declaration: ${VAT_RELIEF_DECLARATION}`);
  }
  if (data.notes?.trim()) {
    lines.push(`Notes: ${data.notes.trim()}`);
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = hireEnquirySchema.safeParse(body);

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
    const bookingRef = createBookingRef().replace(/^DEMO-/, "HIRE-");

    // Do not silently discard a genuine hire enquiry if browser autofill fills
    // the legacy off-screen honeypot. The shared enquiry service performs its
    // own content-based spam filtering server-side.

    const message = `${buildHireMessage(data)}\nBooking Ref: ${bookingRef}`;

    if (!hasSupabase()) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Enquiry service is not configured." },
          { status: 500 },
        );
      }
      console.info("Hire enquiry (dev fallback):", { bookingRef, data, message });
      return NextResponse.json({ success: true, bookingRef });
    }

    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLIC_SITE_KEY!;
    const res = await fetch(`${url}/functions/v1/send-contact-enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message,
        enquiryType: "hire",
        productName: data.categoryLabel || data.categoryId,
        postcode: data.postcode.trim().toUpperCase(),
        addressLine1: data.addressLine1 || undefined,
        addressLine2: data.addressLine2 || undefined,
        city: data.city || undefined,
        bookingRef,
      }),
    });

    const result = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      error?: string;
    };

    if (!res.ok || result.success === false) {
      return NextResponse.json(
        {
          error:
            result.error ||
            "Something went wrong. Please try again or call 0800 772 3870.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, bookingRef });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send hire enquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
