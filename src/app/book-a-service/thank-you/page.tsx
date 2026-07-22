import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Thank You | Service Booking Received",
  description:
    "Thanks for your Mobility Station service request. Our team will be in touch soon.",
  path: "/book-a-service/thank-you",
});

export default function ServiceThankYouPage() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Service request received</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
        Thanks — our service team will review your details and contact you to
        arrange the next step.
      </p>
      <p className="mt-3 text-muted">
        Urgent help? Call{" "}
        <a href={SITE.phoneHref} className="font-semibold text-primary">
          {SITE.phone}
        </a>
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Back to homepage
      </Link>
    </div>
  );
}
