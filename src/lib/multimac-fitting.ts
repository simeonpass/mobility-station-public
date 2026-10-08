import { z } from "zod";
import {
  TIME_WINDOWS,
  earliestPreferredDate,
  formatPreferredDate,
  isWeekday,
  parseIsoDate,
  toIsoDate,
} from "@/lib/demo-booking";

/** Professional Multimac installation — customer-facing total, including VAT. */
export const MULTIMAC_FITTING_PRICE_GBP = 225;
export const MULTIMAC_FITTING_SKU = "multimac-fitting";
export const MULTIMAC_FITTING_PATH = "/vehicle-adaptations/multimac-fitting";
export const MULTIMAC_FITTING_NAME = "Multimac professional fitting";
export const MULTIMAC_FITTING_IMAGE = "/images/multimac/1320-4seater.png";
export const MULTIMAC_SITE_URL = "https://www.multimac.com/";
export const MULTIMAC_FITTING_KIT_URL =
  "https://www.multimac.com/product/standard-fitting-kit/";
export const MULTIMAC_QUOTE_URL = "https://www.multimac.com/";

/** Clear intervening weekdays before the requested fitting date. */
export const MULTIMAC_FITTING_LEAD_CLEAR_DAYS = 5;

export const MULTIMAC_FITTING_TIME_WINDOWS = TIME_WINDOWS;

export type MultimacSeatSource = "have_seat" | "delivered_to_us";
export type MultimacFittingBranch = "heathrow" | "ferndown";

export function isFittingServiceProduct(product: {
  product_type?: string | null;
  id?: string;
  stockItemId?: string;
  slug?: string | null;
}) {
  return (
    product.product_type === "fitting_service" ||
    product.id === MULTIMAC_FITTING_SKU ||
    product.stockItemId === MULTIMAC_FITTING_SKU ||
    product.slug === MULTIMAC_FITTING_SKU
  );
}

export function seatSourceLabel(source: MultimacSeatSource) {
  return source === "delivered_to_us"
    ? "Multimac delivering the seat to Mobility Station"
    : "Customer already has the Multimac";
}

export function fittingBranchLabel(branch: MultimacFittingBranch) {
  return branch === "ferndown"
    ? "Ferndown (Wimborne)"
    : "Heathrow (West Drayton)";
}

export function fittingBranchCheckoutValue(branch: MultimacFittingBranch) {
  return branch === "ferndown" ? "Ferndown" : "Heathrow";
}

export function fittingOptionSummary(booking: MultimacFittingBooking) {
  return [
    formatPreferredDate(booking.preferredDate),
    TIME_WINDOWS.find((t) => t.id === booking.preferredTime)?.label,
    fittingBranchLabel(booking.branch),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function cartProductFromFittingBooking(
  booking: MultimacFittingBookingPayload,
) {
  return {
    id: MULTIMAC_FITTING_SKU,
    stockItemId: MULTIMAC_FITTING_SKU,
    name: MULTIMAC_FITTING_NAME,
    slug: MULTIMAC_FITTING_SKU,
    image_url: MULTIMAC_FITTING_IMAGE,
    unit_price: MULTIMAC_FITTING_PRICE_GBP,
    sale_price: null,
    category: "Multimac Fitting",
    weight: null,
    condition: "new" as const,
    product_type: "fitting_service",
    optionSummary: fittingOptionSummary(booking),
    priceIncludesVat: true,
    fittingBooking: booking,
  };
}

export function earliestFittingDate(from = new Date()) {
  return earliestPreferredDate(MULTIMAC_FITTING_LEAD_CLEAR_DAYS, from);
}

const ukReg = /^[A-Z0-9 ]{0,10}$/i;

export const multimacFittingBookingSchema = z
  .object({
    seatSource: z.enum(["have_seat", "delivered_to_us"]),
    hasFittingKit: z.boolean().refine((v) => v === true, {
      message:
        "You need the vehicle-specific fitting kit before we can book this",
    }),
    orderedFitting: z.boolean().refine((v) => v === true, {
      message:
        "Please confirm you have ordered the Multimac — this booking is for fitting only",
    }),
    branch: z.enum(["heathrow", "ferndown"]),
    preferredDate: z.string().trim().min(1, "Please choose a preferred date"),
    preferredTime: z.enum(["morning", "afternoon", "late"]),
    vehicleMake: z.string().trim().min(2, "Please enter the vehicle make"),
    vehicleModel: z.string().trim().min(2, "Please enter the vehicle model"),
    vehicleYear: z
      .string()
      .trim()
      .regex(/^(19|20)\d{2}$/, "Please enter the vehicle year (e.g. 2021)"),
    vehicleReg: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || ukReg.test(v), "Please enter a valid registration"),
    notes: z.string().trim().max(2000).optional(),
    company_website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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
    const min = earliestFittingDate();
    if (preferred < min) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredDate"],
        message: `Fittings need at least ${MULTIMAC_FITTING_LEAD_CLEAR_DAYS} days’ notice. Earliest date: ${formatPreferredDate(toIsoDate(min))}.`,
      });
    }
  });

export type MultimacFittingBookingPayload = z.infer<
  typeof multimacFittingBookingSchema
>;
export type MultimacFittingBooking = MultimacFittingBookingPayload;

export function buildFittingEnquiryMessage(
  booking: MultimacFittingBooking,
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  },
  bookingRef: string,
) {
  const timeLabel =
    TIME_WINDOWS.find((t) => t.id === booking.preferredTime)?.label ??
    booking.preferredTime;

  const lines = [
    "Enquiry Type: Multimac professional fitting",
    `Booking Ref: ${bookingRef}`,
    `Product: ${MULTIMAC_FITTING_NAME}`,
    `Fee: £${MULTIMAC_FITTING_PRICE_GBP.toFixed(2)} including VAT`,
    `Payment: PENDING — not booked until card payment completes`,
    `Preferred Date: ${formatPreferredDate(booking.preferredDate)}`,
    `Preferred Time: ${timeLabel}`,
    `Fitting Branch: ${fittingBranchLabel(booking.branch)}`,
    `Seat: ${seatSourceLabel(booking.seatSource)}`,
    "Fitting kit: Customer confirmed they have the vehicle-specific kit (or it is coming with the Multimac delivery)",
    "Ordered from Multimac: Yes — fitting only (we are not supplying the seat)",
    `Vehicle: ${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleYear})`,
  ];

  if (booking.vehicleReg?.trim()) {
    lines.push(`Vehicle Reg: ${booking.vehicleReg.trim().toUpperCase()}`);
  }

  lines.push(
    `Customer: ${customer.firstName} ${customer.lastName}`,
    `Email: ${customer.email}`,
  );
  if (customer.phone?.trim()) {
    lines.push(`Phone: ${customer.phone.trim()}`);
  }

  lines.push(
    "Note: requested date is a preference only — we will confirm the appointment after payment.",
  );

  if (booking.notes?.trim()) {
    lines.push("", booking.notes.trim());
  }

  return lines.join("\n");
}

export function createFittingBookingRef() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `MMFIT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `MMFIT-${Date.now().toString(36).toUpperCase()}`;
}

export function dnaFittingDescription(preferredDateIso: string) {
  return `Multimac fitting — ${formatPreferredDate(preferredDateIso)}`;
}
