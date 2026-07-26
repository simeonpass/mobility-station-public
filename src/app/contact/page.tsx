import Link from "next/link";
import { CalendarCheck, MessageSquare, Wrench } from "lucide-react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { BRANCHES } from "@/data/content";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Mobility Station",
  description:
    "Contact Mobility Station for scooters, wheelchairs and vehicle adaptations. Call 0800 772 3870 or message Heathrow & Ferndown.",
  path: "/contact",
});

/** Preset enquiry subjects so other pages can deep-link, e.g. /contact?interest=adaptation */
const INTEREST_PRESETS: Record<string, string> = {
  adaptation: "Vehicle adaptation quotation",
  adaptations: "Vehicle adaptation quotation",
  scooter: "Mobility scooter",
  wheelchair: "Wheelchair",
  motability: "Motability enquiry",
  service: "Service / repair",
  "trade-in": "Trade-in valuation",
};

const ROUTES = [
  {
    icon: MessageSquare,
    title: "Send an enquiry",
    body: "Questions, quotations and product advice — we reply by phone or email.",
    href: "#enquire",
    label: "Use the form below",
  },
  {
    icon: CalendarCheck,
    title: "Book a demonstration",
    body: "Try equipment at home or at a branch. Motability demos are free.",
    href: "/book-a-demo",
    label: "Book a demo",
  },
  {
    icon: Wrench,
    title: "Book a service or repair",
    body: "Servicing and repairs for scooters, wheelchairs and adaptations.",
    href: "/book-a-service",
    label: "Book a service",
  },
] as const;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; interest?: string }>;
}) {
  const { sent, interest } = await searchParams;
  const presetInterest = interest
    ? INTEREST_PRESETS[interest.toLowerCase()] ?? interest
    : "General enquiry";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Mobility Station",
    url: `${SITE.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: SITE.name,
      telephone: SITE.phone,
      email: SITE.email,
      url: SITE.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Contact us"
        subtitle="Call us, message the team, or book a demonstration or service — whichever suits you best."
        primaryHref="#enquire"
        primaryLabel="Send a message"
      />

      <section className="py-12 md:py-14">
        <div className="container-site">
          <ul className="grid gap-6 md:grid-cols-3">
            {ROUTES.map(({ icon: Icon, title, body, href, label }) => (
              <li
                key={title}
                className="flex flex-col rounded-2xl border border-border bg-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-primary">{title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {body}
                </p>
                <Link
                  href={href}
                  className="mt-4 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
                >
                  {label} →
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Branch demonstrations are free. Home visits are free for Motability
            scooters and wheelchairs, and £100 for private or adaptation visits —
            refundable if you place an order.{" "}
            <Link
              href="/book-a-demo#demo-terms"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Full demo terms
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-24 pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              Branches &amp; phone
            </h2>
            <p className="mt-3 text-lg font-semibold text-primary">
              <a
                href={SITE.phoneHref}
                className="text-accent hover:text-accent-hover"
              >
                {SITE.phone}
              </a>
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 inline-block text-sm font-medium text-primary hover:text-primary-dark"
            >
              {SITE.email}
            </a>

            <ul className="mt-8 space-y-6">
              {BRANCHES.map((branch) => (
                <li key={branch.id} className="border-t border-border pt-4">
                  <h3 className="text-xl font-bold">{branch.name}</h3>
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

            <p className="mt-6 text-sm text-muted">
              Opening hours and maps are on our{" "}
              <Link
                href="/locations"
                className="font-semibold text-primary underline underline-offset-2"
              >
                locations page
              </Link>
              .
            </p>
          </div>

          <div className="rounded-2xl bg-soft p-6 md:p-8">
            {sent ? (
              <p className="mb-6 rounded-md bg-white px-4 py-3 text-sm font-medium text-primary">
                Thanks — your message has been sent. We will reply shortly.
              </p>
            ) : null}
            <EnquiryForm
              enquiryType="contact"
              title="Send a message"
              defaultInterest={presetInterest}
            />
          </div>
        </div>
      </section>
    </>
  );
}
