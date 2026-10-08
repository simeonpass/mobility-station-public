import { z } from "zod";
import { isLikelyUkPhone } from "@/lib/spam";

const ukPostcode =
  /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;

const ukPhoneShape = /^[\d\s+()-]{10,20}$/;

const phoneField = z
  .string()
  .trim()
  .min(10, "Please enter a valid UK phone number")
  .regex(ukPhoneShape, "Please enter a valid UK phone number")
  .refine((value) => isLikelyUkPhone(value), {
    message: "Please enter a valid UK phone number (starting with 0 or +44)",
  });

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name"),
    phone: phoneField,
    email: z.string().trim().optional(),
    postcode: z.string().trim().optional(),
    interest: z
      .string()
      .trim()
      .min(2, "Please tell us what you are interested in"),
    preferred_branch: z.enum(["heathrow", "ferndown", "mobile", "either"]),
    preferred_date: z.string().optional(),
    message: z.string().trim().max(2000).optional(),
    product_slug: z.string().optional(),
    enquiry_type: z.enum([
      "demo",
      "service",
      "contact",
      "hire",
      "trade-in",
      "callback",
    ]),
    /** Honeypot — must stay empty. Not shown to users. */
    website: z.string().optional(),
    /** Client-set timestamp for timing checks. */
    form_started_at: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enquiry_type !== "callback") {
      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Please enter a valid email address",
        });
      }
      if (!data.postcode || !ukPostcode.test(data.postcode)) {
        ctx.addIssue({
          code: "custom",
          path: ["postcode"],
          message: "Please enter a valid UK postcode",
        });
      }
    } else if (data.email && data.email.length > 0) {
      if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Please enter a valid email address",
        });
      }
    }
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: phoneField,
  email: z.string().trim().email("Please enter a valid email address"),
  message: z.string().trim().max(2000).optional(),
  enquiry_type: z.literal("contact").default("contact"),
  interest: z.string().default("General enquiry"),
  preferred_branch: z
    .enum(["heathrow", "ferndown", "mobile", "either"])
    .default("either"),
  postcode: z.string().trim().optional(),
});
