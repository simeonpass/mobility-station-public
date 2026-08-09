import Link from "next/link";
import { DemoBookingForm } from "@/components/forms/demo-booking-form";
import { Hero } from "@/components/sections/hero";
import { DEMO_PRICING_STRIP, HOME_DEMO_FEE_GBP } from "@/lib/demo-booking";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Book a Demo | Home Demonstrations",
  description:
    "Book a free branch demonstration or a £195 home demonstration for scooters, wheelchairs or vehicle adaptations. Fee deducted if you buy; waived for Motability PWSS.",
  path: "/book-a-demo",
});

export default async function BookADemoPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; type?: string }>;
}) {
  const { product, type } = await searchParams;
  const productSlug = product?.trim() || undefined;
  const defaultProductName = productSlug
    ? productSlug.replace(/-/g, " ")
    : "";
  const defaultCategory =
    type === "adaptation" ? ("vehicle_adaptation" as const) : undefined;

  return (
    <>
      <Hero
        compact
        title="Book a demonstration"
        subtitle={DEMO_PRICING_STRIP}
        primaryHref="#form"
        primaryLabel="Start booking"
      />
      <section id="form" className="pb-10 md:pb-12">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-extrabold">Demo options</h2>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">Branch demonstration:</strong>{" "}
                always free at Heathrow or Ferndown.
              </li>
              <li>
                <strong className="text-primary">Home demonstration:</strong>{" "}
                £{HOME_DEMO_FEE_GBP} flat everywhere — vehicle adaptations,
                scooters, powered and manual wheelchairs, private or Motability.
                Non-refundable, but deducted in full from your purchase price if
                you go ahead.
              </li>
              <li>
                <strong className="text-primary">PWSS waiver:</strong> waived
                for the Motability Powered Wheelchair &amp; Scooter Scheme when
                you tick the PWSS box at booking.
              </li>
              <li>
                We come to you so you can try equipment where you live, park and
                get around every day. Enter your postcode when booking a home
                demo so we can confirm coverage before any payment. Home demos
                need at least 5 days&apos; notice.
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Need something else?{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Contact the team
              </Link>{" "}
              or{" "}
              <Link
                href="/book-a-service"
                className="font-semibold text-primary underline underline-offset-2"
              >
                book a service
              </Link>
              .
            </p>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <DemoBookingForm
              defaultProductName={defaultProductName}
              defaultCategory={defaultCategory}
            />
          </div>
        </div>
      </section>

      <section
        id="demo-terms"
        className="border-t border-border bg-soft py-10 md:py-12"
      >
        <div className="container-site max-w-3xl">
          <h2 className="text-lg font-extrabold text-primary">
            Home demonstration terms
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p>{DEMO_PRICING_STRIP}</p>
            <p>
              The £{HOME_DEMO_FEE_GBP} home demonstration fee is{" "}
              <strong className="text-foreground">non-refundable</strong>. If
              you go ahead with a purchase, it is{" "}
              <strong className="text-foreground">
                deducted in full from the purchase price
              </strong>
              — it is not a refund.
            </p>
            <p>
              Call-out distance bands do{" "}
              <strong className="text-foreground">not</strong> apply to
              demonstrations. Bands still apply to service call-outs and hire
              deliveries only.
            </p>
            <p>
              Branch demonstrations at Heathrow and Ferndown remain free. See
              also our{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
