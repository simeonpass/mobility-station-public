import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Quotation request received",
  description: "Thanks — we’ve received your quotation request and will reply shortly.",
  path: "/quote/thank-you",
  noIndex: true,
});

export default function QuoteThankYouPage() {
  return (
    <div className="container-site py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/55">
        Quotation
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        Thanks — we’ve got your request
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted">
        Our team will review the product you asked about and come back with a
        clear quotation. For adaptations we’ll confirm vehicle compatibility
        before any work is booked.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
          Browse the shop
        </Link>
        <Link
          href="/vehicle-adaptations"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full",
          )}
        >
          View adaptations
        </Link>
      </div>
      <p className="mt-6 text-sm text-muted">
        Need us sooner?{" "}
        <Link
          href="/contact?interest=callback#callback"
          className="font-semibold text-primary underline"
        >
          Request a callback
        </Link>
        .
      </p>
    </div>
  );
}
