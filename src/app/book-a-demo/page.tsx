import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Book a Demo | Home Demonstrations",
  description:
    "Book a home or branch demonstration for scooters, wheelchairs or vehicle adaptations. Motability scooter/wheelchair home demos free; private & adaptation home visits £100 — see terms.",
  path: "/book-a-demo",
});

export default async function BookADemoPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const productSlug = product?.trim() || undefined;

  return (
    <>
      <Hero
        compact
        title="Book a demonstration"
        subtitle="Try scooters, wheelchairs or adaptations at home or at our Heathrow and Ferndown branches."
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
                <strong className="text-primary">
                  Motability home demonstration:
                </strong>{" "}
                free for Motability scooter and wheelchair packages.
              </li>
              <li>
                <strong className="text-primary">
                  Private / adaptation home demonstration:
                </strong>{" "}
                £100 visit fee
                <a
                  href="#demo-terms"
                  className="font-semibold text-primary"
                  aria-describedby="demo-terms"
                >
                  *
                </a>
                . Private scooter/wheelchair fees are deducted if you buy;
                adaptation fees are refunded if the order goes ahead (including
                via a dealership).
              </li>
              <li>
                We come to you so you can try equipment where you live, park and
                get around every day.
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
            <EnquiryForm
              enquiryType="demo"
              title="Request your demonstration"
              defaultInterest={
                productSlug ? productSlug.replace(/-/g, " ") : ""
              }
              productSlug={productSlug}
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
            * Home demonstration terms
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-foreground">Free home demonstrations</strong>{" "}
              apply to Motability scooter and wheelchair assessments.
            </p>
            <p>
              Home demonstrations for{" "}
              <strong className="text-foreground">vehicle adaptations</strong>{" "}
              and{" "}
              <strong className="text-foreground">
                private (non-Motability) scooters and wheelchairs
              </strong>{" "}
              carry a <strong className="text-foreground">£100</strong> visit
              fee. For private scooter and wheelchair purchases, this is deducted
              from the price if you buy from us. For vehicle adaptations, it is
              refunded if you go ahead with us, or where the adaptation order is
              placed via a dealership. We&apos;ll confirm the arrangement when we
              book your visit.
            </p>
            <p>
              Branch demonstrations at Heathrow and Ferndown remain free — a
              good option if you prefer to try equipment with no visit fee.
              We&apos;ll confirm the right option when we book your visit.
            </p>
            <p>
              See also our{" "}
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
