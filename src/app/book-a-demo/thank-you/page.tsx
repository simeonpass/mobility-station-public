import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Thank You | Demo Booking Received",
  description:
    "Thanks for booking a Mobility Station demonstration. We will be in touch shortly.",
  path: "/book-a-demo/thank-you",
});

export default function DemoThankYouPage() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Thank you</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/80">
        Your demonstration request is with our team. We will contact you shortly
        to confirm timing with Heathrow or Ferndown.
      </p>
      <p className="mt-3 text-muted">
        Need us sooner? Call{" "}
        <a href={SITE.phoneHref} className="font-semibold text-primary">
          {SITE.phone}
        </a>
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to homepage
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse scooters &amp; wheelchairs
        </Link>
      </div>
    </div>
  );
}
