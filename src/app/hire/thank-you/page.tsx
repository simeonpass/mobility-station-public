import { Suspense } from "react";
import { HireThankYouClient } from "@/components/hire/hire-thank-you-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Thank You | Hire Booking",
  description:
    "Thanks for your Mobility Station hire booking or enquiry.",
  path: "/hire/thank-you",
  noIndex: true,
});

export default function HireThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-20 text-center text-muted">
          Loading confirmation…
        </div>
      }
    >
      <HireThankYouClient />
    </Suspense>
  );
}
