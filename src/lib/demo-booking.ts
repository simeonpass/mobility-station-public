import { z } from "zod";

/** Flat home demonstration fee — single source of truth. */
export const HOME_DEMO_FEE_GBP = 195;

/** Clear intervening days required before the preferred date. */
export const HOME_DEMO_LEAD_CLEAR_DAYS = 5;
export const BRANCH_DEMO_LEAD_CLEAR_DAYS = 2;

export const DEMO_PRICING_STRIP =
  "Free demonstrations at our Heathrow and Ferndown branches. Home demonstrations are £195 — deducted in full from your price if you go ahead. Waived for the Motability Powered Wheelchair & Scooter Scheme.";

export const HOME_DEMO_LEAD_COPY =
  "Home demos need at least 5 days' notice so we can get the product in. We'll do our best to hit your requested day but can't guarantee it.";

export const PWSS_LABEL =
  "Motability Powered Wheelchair & Scooter Scheme (PWSS) — tick this if your scooter or powered wheelchair is being supplied through PWSS. The £195 home demonstration fee is waived.";

export const TIME_WINDOWS = [
  { id: "morning", label: "Morning (9am – 12pm)" },
  { id: "afternoon", label: "Afternoon (12pm – 3pm)" },
  { id: "late", label: "Late afternoon (3pm – 5pm)" },
] as const;

export type TimeWindowId = (typeof TIME_WINDOWS)[number]["id"];

export type DemoProductCategory = "vehicle_adaptation" | "scooter_wheelchair";
export type DemoLocation = "branch" | "home";
export type DemoBranch = "heathrow" | "ferndown";
export type CustomerType = "private" | "motability";
export type ScooterWheelchairKind =
  | "scooter"
  | "powered_wheelchair"
  | "manual_wheelchair";

export type DemoBookingInput = {
  productCategory: DemoProductCategory;
  /** Required when productCategory is scooter_wheelchair */
  scooterWheelchairKind?: ScooterWheelchairKind;
  location: DemoLocation;
  branch?: DemoBranch;
  customerType: CustomerType;
  /** Only valid for Motability + scooter/powered wheelchair */
  pwss: boolean;
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  productName: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleReg?: string;
  notes?: string;
  preferredDate: string;
  preferredTime: TimeWindowId;
  /** Covering workshop from postcode check (home demos) */
  coveredBy?: DemoBranch;
  /** Honeypot — must stay empty */
  company_website?: string;
};

const ukPostcode =
  /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
const ukPhoneShape = /^[\d\s+()-]{10,20}$/;

function isLikelyUkPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("44") && digits.length >= 12) return true;
  if (digits.startsWith("0") && digits.length >= 10) return true;
  return false;
}

export function isPwssEligible(input: {
  productCategory: DemoProductCategory;
  customerType: CustomerType;
  scooterWheelchairKind?: ScooterWheelchairKind;
}) {
  if (input.productCategory !== "scooter_wheelchair") return false;
  if (input.customerType !== "motability") return false;
  return (
    input.scooterWheelchairKind === "scooter" ||
    input.scooterWheelchairKind === "powered_wheelchair"
  );
}

export type DemoFeeResult = {
  amountGbp: number;
  waived: boolean;
  explanation: string;
  label: string;
};

export function calculateDemoFee(input: {
  location: DemoLocation;
  productCategory: DemoProductCategory;
  customerType: CustomerType;
  scooterWheelchairKind?: ScooterWheelchairKind;
  pwss: boolean;
}): DemoFeeResult {
  if (input.location === "branch") {
    return {
      amountGbp: 0,
      waived: false,
      explanation: "Branch demonstration at Heathrow / Ferndown",
      label: "Free / waived — Branch demonstration",
    };
  }

  if (
    input.pwss &&
    isPwssEligible({
      productCategory: input.productCategory,
      customerType: input.customerType,
      scooterWheelchairKind: input.scooterWheelchairKind,
    })
  ) {
    return {
      amountGbp: 0,
      waived: true,
      explanation:
        "Motability Powered Wheelchair & Scooter Scheme (PWSS)",
      label: "Free / waived — Motability PWSS",
    };
  }

  return {
    amountGbp: HOME_DEMO_FEE_GBP,
    waived: false,
    explanation:
      "Home demonstration fee — deducted in full from the purchase price if you go ahead",
    label: `£${HOME_DEMO_FEE_GBP}`,
  };
}

/** Start of local calendar day. */
export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Earliest selectable preferred date: `clearDays` complete intervening
 * calendar days after today, then the next weekday (Mon–Fri).
 */
export function earliestPreferredDate(
  clearDays: number,
  from = new Date(),
): Date {
  const d = startOfDay(from);
  d.setDate(d.getDate() + clearDays + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function leadClearDaysForLocation(location: DemoLocation) {
  return location === "home"
    ? HOME_DEMO_LEAD_CLEAR_DAYS
    : BRANCH_DEMO_LEAD_CLEAR_DAYS;
}

export function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatPreferredDate(iso: string) {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeWindowLabel(id: TimeWindowId) {
  return TIME_WINDOWS.find((t) => t.id === id)?.label ?? id;
}

export function productCategoryLabel(category: DemoProductCategory) {
  return category === "vehicle_adaptation"
    ? "Vehicle Adaptation"
    : "Scooter / Wheelchair";
}

export function demoProductLabel(input: {
  productCategory: DemoProductCategory;
  scooterWheelchairKind?: ScooterWheelchairKind;
}) {
  if (input.productCategory === "vehicle_adaptation") {
    return "Vehicle adaptation";
  }
  switch (input.scooterWheelchairKind) {
    case "scooter":
      return "Scooter";
    case "powered_wheelchair":
      return "Powered wheelchair";
    case "manual_wheelchair":
      return "Manual wheelchair";
    default:
      return "Scooter / wheelchair";
  }
}

export function demoLocationLabel(
  location: DemoLocation,
  branch?: DemoBranch,
) {
  if (location === "home") return "Mobile / Home Demonstration";
  if (branch === "ferndown") return "At Our Branch (Ferndown)";
  return "At Our Branch (Heathrow)";
}

export function customerTypeLabel(input: {
  customerType: CustomerType;
  pwss: boolean;
  productCategory: DemoProductCategory;
  scooterWheelchairKind?: ScooterWheelchairKind;
}) {
  if (input.customerType === "private") return "Private";
  if (
    input.pwss &&
    isPwssEligible({
      productCategory: input.productCategory,
      customerType: input.customerType,
      scooterWheelchairKind: input.scooterWheelchairKind,
    })
  ) {
    return "Motability Scheme — PWSS (scooter / powered wheelchair)";
  }
  return "Motability Scheme";
}

export type PaymentStatus = "PAID" | "WAIVED" | "PENDING" | "FREE";

export function paymentLine(
  status: PaymentStatus,
  dnaRef?: string,
): string {
  switch (status) {
    case "PAID":
      return dnaRef ? `PAID (DNA ref ${dnaRef})` : "PAID";
    case "WAIVED":
      return "WAIVED (PWSS)";
    case "PENDING":
      return "PENDING";
    case "FREE":
      return "N/A — branch demonstration (no fee)";
  }
}

export function buildDemoEnquiryMessage(
  input: DemoBookingInput,
  fee: DemoFeeResult,
  paymentStatus: PaymentStatus,
  dnaRef?: string,
) {
  const address = [
    input.addressLine1,
    input.addressLine2,
    input.city,
    input.postcode,
  ]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(", ");

  const lines = [
    `Enquiry Type: Book a Demonstration (${productCategoryLabel(input.productCategory)})`,
    `Product: ${input.productName.trim()}`,
    `Demo Address: ${address}`,
    `Demo Product: ${demoProductLabel(input)}`,
    `Preferred Date: ${formatPreferredDate(input.preferredDate)}`,
    `Preferred Time: ${timeWindowLabel(input.preferredTime)}`,
    `Demo Location: ${demoLocationLabel(input.location, input.branch)}`,
  ];

  if (input.location === "home" && input.coveredBy) {
    lines.push(
      `Coverage: Within ${input.coveredBy === "ferndown" ? "Ferndown" : "Heathrow"} home demonstration area`,
    );
  }

  lines.push(
    `Customer Type: ${customerTypeLabel(input)}`,
    `Demo Fee: ${fee.label}${fee.amountGbp === 0 ? ` — ${fee.explanation}` : ""}`,
    `Payment: ${paymentLine(paymentStatus, dnaRef)}`,
    "Note: requested date is a preference only — home demos need at least 5 days' notice.",
  );

  if (input.vehicleMake?.trim()) {
    lines.push(`Vehicle Make: ${input.vehicleMake.trim()}`);
  }
  if (input.vehicleModel?.trim()) {
    lines.push(`Vehicle Model: ${input.vehicleModel.trim()}`);
  }
  if (input.vehicleReg?.trim()) {
    lines.push(`Vehicle Reg: ${input.vehicleReg.trim()}`);
  }
  if (input.notes?.trim()) {
    lines.push("", input.notes.trim());
  }

  return lines.join("\n");
}

export function dnaLineDescription(preferredDateIso: string) {
  return `Home Demonstration Fee — ${formatPreferredDate(preferredDateIso)}`;
}

export const demoBookingSchema = z
  .object({
    productCategory: z.enum(["vehicle_adaptation", "scooter_wheelchair"]),
    scooterWheelchairKind: z
      .enum(["scooter", "powered_wheelchair", "manual_wheelchair"])
      .optional(),
    location: z.enum(["branch", "home"]),
    branch: z.enum(["heathrow", "ferndown"]).optional(),
    customerType: z.enum(["private", "motability"]),
    pwss: z.boolean().default(false),
    name: z.string().trim().min(2, "Please enter your name"),
    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid UK phone number")
      .regex(ukPhoneShape, "Please enter a valid UK phone number")
      .refine(isLikelyUkPhone, {
        message: "Please enter a valid UK phone number (starting with 0 or +44)",
      }),
    email: z.string().trim().email("Please enter a valid email address"),
    addressLine1: z.string().trim().min(2, "Please enter your address"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2, "Please enter your town / city"),
    postcode: z
      .string()
      .trim()
      .refine((v) => ukPostcode.test(v), "Please enter a valid UK postcode"),
    productName: z.string().trim().min(2, "Please tell us the product of interest"),
    vehicleMake: z.string().trim().optional(),
    vehicleModel: z.string().trim().optional(),
    vehicleReg: z.string().trim().optional(),
    notes: z.string().trim().max(2000).optional(),
    preferredDate: z.string().trim().min(1, "Please choose a preferred date"),
    preferredTime: z.enum(["morning", "afternoon", "late"]),
    coveredBy: z.enum(["heathrow", "ferndown"]).optional(),
    company_website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.productCategory === "scooter_wheelchair" && !data.scooterWheelchairKind) {
      ctx.addIssue({
        code: "custom",
        path: ["scooterWheelchairKind"],
        message: "Please choose scooter or wheelchair type",
      });
    }

    if (data.location === "branch" && !data.branch) {
      ctx.addIssue({
        code: "custom",
        path: ["branch"],
        message: "Please choose Heathrow or Ferndown",
      });
    }

    if (data.productCategory === "vehicle_adaptation") {
      if (!data.vehicleMake?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicleMake"],
          message: "Please enter the vehicle make",
        });
      }
      if (!data.vehicleModel?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicleModel"],
          message: "Please enter the vehicle model",
        });
      }
    }

    const preferred = parseIsoDate(data.preferredDate);
    if (!preferred) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredDate"],
        message: "Please choose a valid date",
      });
      return;
    }

    if (!isWeekday(preferred)) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredDate"],
        message: "Please choose a weekday (Monday–Friday)",
      });
    }

    const min = earliestPreferredDate(leadClearDaysForLocation(data.location));
    if (preferred < min) {
      const lead = leadClearDaysForLocation(data.location);
      ctx.addIssue({
        code: "custom",
        path: ["preferredDate"],
        message:
          data.location === "home"
            ? `Home demos need at least ${lead} days' notice. Earliest date: ${formatPreferredDate(toIsoDate(min))}.`
            : `Branch demos need at least ${lead} days' notice. Earliest date: ${formatPreferredDate(toIsoDate(min))}.`,
      });
    }

    if (
      data.pwss &&
      !isPwssEligible({
        productCategory: data.productCategory,
        customerType: data.customerType,
        scooterWheelchairKind: data.scooterWheelchairKind,
      })
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["pwss"],
        message: "PWSS only applies to Motability scooters and powered wheelchairs",
      });
    }
  });

export type DemoBookingPayload = z.infer<typeof demoBookingSchema>;

/** Lighter schema for out-of-area home demo requests (no payment). */
export const outOfAreaDemoRequestSchema = z
  .object({
    productCategory: z.enum(["vehicle_adaptation", "scooter_wheelchair"]),
    scooterWheelchairKind: z
      .enum(["scooter", "powered_wheelchair", "manual_wheelchair"])
      .optional(),
    customerType: z.enum(["private", "motability"]).default("private"),
    name: z.string().trim().min(2, "Please enter your name"),
    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid UK phone number")
      .regex(ukPhoneShape, "Please enter a valid UK phone number")
      .refine(isLikelyUkPhone, {
        message: "Please enter a valid UK phone number (starting with 0 or +44)",
      }),
    email: z.string().trim().email("Please enter a valid email address"),
    addressLine1: z.string().trim().min(2, "Please enter your address"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2, "Please enter your town / city"),
    postcode: z
      .string()
      .trim()
      .refine((v) => ukPostcode.test(v), "Please enter a valid UK postcode"),
    productName: z.string().trim().min(2, "Please tell us the product of interest"),
    vehicleMake: z.string().trim().optional(),
    vehicleModel: z.string().trim().optional(),
    vehicleReg: z.string().trim().optional(),
    notes: z.string().trim().max(2000).optional(),
    preferredDate: z.string().trim().optional(),
    company_website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.productCategory === "scooter_wheelchair" &&
      !data.scooterWheelchairKind
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["scooterWheelchairKind"],
        message: "Please choose scooter or wheelchair type",
      });
    }
    if (data.productCategory === "vehicle_adaptation") {
      if (!data.vehicleMake?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicleMake"],
          message: "Please enter the vehicle make",
        });
      }
      if (!data.vehicleModel?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicleModel"],
          message: "Please enter the vehicle model",
        });
      }
    }
  });

export type OutOfAreaDemoRequest = z.infer<typeof outOfAreaDemoRequestSchema>;

export function buildOutOfAreaDemoMessage(
  input: OutOfAreaDemoRequest,
  meta?: { nearestBranch?: string; miles?: number },
) {
  const address = [
    input.addressLine1,
    input.addressLine2,
    input.city,
    input.postcode,
  ]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(", ");

  const lines = [
    `Enquiry Type: Out-of-area Home Demonstration Request (${productCategoryLabel(input.productCategory)})`,
    `Product: ${input.productName.trim()}`,
    `Demo Address: ${address}`,
    `Demo Product: ${demoProductLabel({
      productCategory: input.productCategory,
      scooterWheelchairKind: input.scooterWheelchairKind,
    })}`,
    `Demo Location: Mobile / Home Demonstration (OUTSIDE standard coverage)`,
    `Customer Type: ${input.customerType === "motability" ? "Motability Scheme" : "Private"}`,
    "Demo Fee: Not taken online — out-of-area request (team to advise)",
    "Payment: N/A — out-of-area request (no online payment)",
    "Note: customer is outside our standard home demonstration area and has asked us to consider a visit.",
  ];

  if (meta?.nearestBranch) {
    lines.push(
      `Nearest branch: ${meta.nearestBranch}${
        typeof meta.miles === "number"
          ? ` (about ${meta.miles.toFixed(0)} miles)`
          : ""
      }`,
    );
  }
  if (input.preferredDate?.trim()) {
    const formatted = parseIsoDate(input.preferredDate)
      ? formatPreferredDate(input.preferredDate)
      : input.preferredDate.trim();
    lines.push(`Preferred Date (optional): ${formatted}`);
  }
  if (input.vehicleMake?.trim()) {
    lines.push(`Vehicle Make: ${input.vehicleMake.trim()}`);
  }
  if (input.vehicleModel?.trim()) {
    lines.push(`Vehicle Model: ${input.vehicleModel.trim()}`);
  }
  if (input.vehicleReg?.trim()) {
    lines.push(`Vehicle Reg: ${input.vehicleReg.trim()}`);
  }
  if (input.notes?.trim()) {
    lines.push("", input.notes.trim());
  }

  return lines.join("\n");
}

export const DEMO_RETRY_STORAGE_KEY = "ms-demo-booking-retry";

export function createBookingRef() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `DEMO-${Date.now().toString(36).toUpperCase()}`;
}
