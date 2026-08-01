import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript } from "@/lib/seo";

const faqs: { q: string; a: string; href?: string; hrefLabel?: string }[] = [
  {
    q: "Do you offer home demonstrations?",
    a: "Yes. Branch demonstrations at Heathrow and Ferndown are always free, and we bring equipment to your home across our service area.",
    href: "/book-a-demo",
    hrefLabel: "Book a demonstration",
  },
  {
    q: "What does a home demonstration cost?",
    a: "Motability scooter and wheelchair home demos are free. Private scooter, wheelchair and vehicle adaptation home visits carry a £100 fee, fully refundable if you place an order.",
    href: "/book-a-demo#demo-terms",
    hrefLabel: "Full demo terms",
  },
  {
    q: "Do you cover my area?",
    a: "Check your postcode to see which workshop covers you, the local call-out band and whether we can deliver locally. Large equipment ships nationwide on a pallet.",
    href: "/service-area",
    hrefLabel: "Check your postcode",
  },
  {
    q: "Can I buy adaptations online?",
    a: "No — every adaptation is checked against your vehicle first, so we quote before any work is booked. Prices shown are indicative supplied and fitted figures.",
    href: "/contact?interest=adaptation",
    hrefLabel: "Request a quotation",
  },
  {
    q: "Do you supply Motability scooters and wheelchairs?",
    a: "Yes. We are a Motability Scheme accredited dealer, with live weekly prices on our Motability catalogue and free home demonstrations.",
    href: "/motability",
    hrefLabel: "See Motability options",
  },
  {
    q: "Can I claim VAT relief?",
    a: "Many customers with a long-term illness or disability can buy eligible products without VAT. You declare eligibility at checkout.",
    href: "/vat-relief",
    hrefLabel: "How VAT relief works",
  },
];

export const metadata = createMetadata({
  title: "FAQ | Mobility Station",
  description:
    "Answers about home demonstrations and fees, Motability, service area, adaptation quotes and VAT relief.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Frequently asked questions"
        subtitle="Quick answers about demonstrations, Motability, branches and bookings."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-t border-border pt-5">
              <h2 className="text-xl font-bold">{faq.q}</h2>
              <p className="mt-2 leading-relaxed text-foreground/85">{faq.a}</p>
              {faq.href ? (
                <Link
                  href={faq.href}
                  className="mt-2 inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
                >
                  {faq.hrefLabel} →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      <CtaFooter />
    </>
  );
}
