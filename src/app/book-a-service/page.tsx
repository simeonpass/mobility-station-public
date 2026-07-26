import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Book a Service | Repairs & Support",
  description:
    "Book a mobility scooter or wheelchair service with Mobility Station. Heathrow & Ferndown support, plus collection options.",
  path: "/book-a-service",
});

export default function BookAServicePage() {
  return (
    <>
      <Hero
        compact
        title="Book a service or repair"
        subtitle="Tell us about your scooter, wheelchair or adaptation and we will arrange support from Heathrow or Ferndown."
        primaryHref="#form"
        primaryLabel="Book service"
      />
      <section id="form" className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl">
          <div className="rounded-2xl bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="service"
              title="Service booking request"
              defaultInterest="Service / repair"
            />
          </div>
          <p className="mt-6 text-sm text-muted">
            Not a service enquiry?{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Contact the team
            </Link>{" "}
            or{" "}
            <Link
              href="/book-a-demo"
              className="font-semibold text-primary underline underline-offset-2"
            >
              book a demonstration
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
