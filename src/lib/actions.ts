"use server";

import { redirect } from "next/navigation";
import { enquirySchema } from "@/lib/schema";
import { hasSupabase } from "@/lib/supabase";

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function buildEnquiryMessage(data: {
  enquiry_type: string;
  interest: string;
  preferred_branch: string;
  preferred_date?: string;
  message?: string;
  product_slug?: string;
}) {
  const lines: string[] = [];

  if (data.enquiry_type === "callback") {
    lines.push("Enquiry Type: Request a Callback");
  } else if (data.enquiry_type === "demo") {
    lines.push("Enquiry Type: Book a demonstration");
  } else if (data.enquiry_type === "service") {
    lines.push("Enquiry Type: Request a service");
  } else {
    lines.push(`Enquiry Type: ${data.enquiry_type}`);
  }

  lines.push(`Interest: ${data.interest}`);
  lines.push(`Preferred branch: ${data.preferred_branch}`);
  if (data.preferred_date) lines.push(`Preferred date: ${data.preferred_date}`);
  if (data.product_slug) lines.push(`Product: ${data.product_slug}`);
  if (data.message?.trim()) {
    lines.push("", data.message.trim());
  }

  return lines.join("\n");
}

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

  const data = parsed.data;
  const email = data.email?.trim() || "not provided";
  const message = buildEnquiryMessage({
    enquiry_type: data.enquiry_type,
    interest: data.interest,
    preferred_branch: data.preferred_branch,
    preferred_date: data.preferred_date,
    message: data.message,
    product_slug: data.product_slug,
  });

  if (!hasSupabase()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        message: "Enquiry service is not configured. Please try again shortly.",
      };
    }
    console.info("Enquiry (dev fallback):", { ...data, email, message });
  } else {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLIC_SITE_KEY!;

    try {
      const res = await fetch(`${url}/functions/v1/send-contact-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          apikey: key,
        },
        body: JSON.stringify({
          name: data.name,
          email,
          phone: data.phone,
          message,
          enquiryType: data.enquiry_type,
          productName: data.interest || undefined,
          productId: undefined,
          postcode: data.postcode?.trim() || undefined,
        }),
      });

      const result = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || result.success === false) {
        console.error("Enquiry submit failed", {
          status: res.status,
          result,
        });
        return {
          success: false,
          message:
            "Something went wrong. Please try again or call us on 0800 772 3870.",
        };
      }
    } catch (error) {
      console.error("Enquiry submit failed", error);
      return {
        success: false,
        message:
          "Something went wrong. Please try again or call us on 0800 772 3870.",
      };
    }
  }

  const thankYouPaths: Record<typeof data.enquiry_type, string> = {
    demo: "/book-a-demo/thank-you",
    service: "/book-a-service/thank-you",
    contact: "/contact?sent=1",
    hire: "/contact?sent=1",
    "trade-in": "/contact?sent=1",
    callback: "/contact?sent=callback#callback",
  };

  redirect(thankYouPaths[data.enquiry_type]);
}
