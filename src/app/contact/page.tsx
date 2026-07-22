import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { buttonVariants } from "@/components/ui/button";
import { BRANCHES } from "@/data/content";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Mobility Station",
  description:
    "Contact Mobility Station for scooters, wheelchairs and vehicle adaptations. Call 0800 772 3870 or message Heathrow & Ferndown.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <>
      <Hero
        compact
        title="Contact us"
        subtitle="Speak to our team, visit Heathrow or Ferndown, or send a quick enquiry."
        primaryHref="/book-a-demo"
        primaryLabel="Book a Demo"
        secondaryHref="/book-a-service"
        secondaryLabel="Book a Service"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            {sent ? (
              <p className="mb-6 rounded-md bg-soft px-4 py-3 text-sm font-medium text-primary">
                Thanks — your message has been sent. We will reply shortly.
              </p>
            ) : null}
            <p className="text-lg font-semibold text-primary">
              Call{" "}
              <a href={SITE.phoneHref} className="text-accent hover:text-accent-hover">
                {SITE.phone}
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/book-a-demo" className={buttonVariants()}>
                Book a Demo
              </Link>
              <Link href="/book-a-service" className={buttonVariants({ variant: "outline" })}>
                Book a Service
              </Link>
            </div>
            <ul className="mt-10 space-y-6">
              {BRANCHES.map((branch) => (
                <li key={branch.id} className="border-t border-border pt-4">
                  <h2 className="text-xl font-bold">{branch.name}</h2>
                  <p className="mt-2 text-sm text-muted">
                    {branch.addressLine1}, {branch.addressLocality},{" "}
                    {branch.postalCode}
                  </p>
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, "")}`}
                    className="mt-2 inline-block text-sm font-semibold"
                  >
                    {branch.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="contact"
              title="Send a message"
              defaultInterest="General enquiry"
            />
          </div>
        </div>
      </section>
    </>
  );
}
