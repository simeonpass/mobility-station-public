import { z } from "zod";

const ukPostcode =
  /^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;

const ukPhone = /^[\d\s+()-]{10,20}$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid UK phone number")
    .regex(ukPhone, "Please enter a valid UK phone number")
    .refine((value) => value.replace(/\D/g, "").length >= 10, {
      message: "Please enter a valid UK phone number",
    }),
  email: z.string().trim().email("Please enter a valid email address"),
  postcode: z
    .string()
    .trim()
    .regex(ukPostcode, "Please enter a valid UK postcode"),
  interest: z.string().trim().min(2, "Please tell us what you are interested in"),
  preferred_branch: z.enum(["heathrow", "ferndown", "mobile", "either"]),
  preferred_date: z.string().optional(),
  message: z.string().trim().max(2000).optional(),
  product_slug: z.string().optional(),
  enquiry_type: z.enum(["demo", "service", "contact", "hire", "trade-in"]),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const contactSchema = enquirySchema.pick({
  name: true,
  phone: true,
  email: true,
  message: true,
}).extend({
  enquiry_type: z.literal("contact").default("contact"),
  interest: z.string().default("General enquiry"),
  preferred_branch: z.enum(["heathrow", "ferndown", "mobile", "either"]).default("either"),
  postcode: z.string().trim().optional(),
});
