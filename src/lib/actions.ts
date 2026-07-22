"use server";

import { redirect } from "next/navigation";
import { enquirySchema } from "@/lib/schema";
import { getSupabase, hasSupabase } from "@/lib/supabase";

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitEnquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = {
    ...parsed.data,
    source: "public-website",
    created_at: new Date().toISOString(),
  };

  if (hasSupabase()) {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        success: false,
        message: "Unable to submit right now. Please call 0800 772 3870.",
      };
    }

    const { error } = await supabase.from("enquiries").insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      postcode: payload.postcode,
      interest: payload.interest,
      preferred_branch: payload.preferred_branch,
      preferred_date: payload.preferred_date || null,
      message: payload.message || null,
      product_slug: payload.product_slug || null,
      enquiry_type: payload.enquiry_type,
      source: payload.source,
    });

    if (error) {
      console.error("Enquiry insert failed", error);
      return {
        success: false,
        message: "Something went wrong. Please call 0800 772 3870.",
      };
    }
  } else if (process.env.NODE_ENV === "production") {
    return {
      success: false,
      message: "Enquiry service is not configured. Please call 0800 772 3870.",
    };
  } else {
    console.info("Enquiry (dev fallback):", payload);
  }

  const thankYouPaths: Record<typeof payload.enquiry_type, string> = {
    demo: "/book-a-demo/thank-you",
    service: "/book-a-service/thank-you",
    contact: "/contact?sent=1",
    hire: "/contact?sent=1",
    "trade-in": "/contact?sent=1",
  };

  redirect(thankYouPaths[payload.enquiry_type]);
}
