import { Suspense } from "react";
import { DemoThankYouClient } from "@/components/forms/demo-thank-you-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Thank You | Demo Booking Received",
  description:
    "Thanks for booking a Mobility Station demonstration. We will be in touch shortly.",
  path: "/book-a-demo/thank-you",
  noIndex: true,
});

export default function DemoThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-20 text-center text-muted">
          Loading confirmation…
        </div>
      }
    >
      <DemoThankYouClient />
    </Suspense>
  );
}
