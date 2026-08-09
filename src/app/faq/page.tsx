import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { KNOWLEDGE_FAQ_CATEGORIES } from "@/data/knowledge-faqs";
import { getKnowledgeFaqs } from "@/lib/data";
import { createMetadata, jsonLdScript } from "@/lib/seo";

/** Operational questions about how we work — kept short and actionable. */
const operationalFaqs: {
  q: string;
  a: string;
  href?: string;
  hrefLabel?: string;
}[] = [
  {
    q: "Do you offer home demonstrations?",
    a: "Yes. Branch demonstrations at Heathrow and Ferndown are always free, and we bring equipment to your home across our service area.",
    href: "/book-a-demo",
    hrefLabel: "Book a demonstration",
  },
  {
    q: "What does a home demonstration cost?",
    a: "Branch demonstrations at Heathrow and Ferndown are free. Home demonstrations are £195 flat everywhere — deducted in full from your price if you go ahead. The fee is waived for the Motability Powered Wheelchair & Scooter Scheme (PWSS).",
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
    a: "Yes. We are a Motability Scheme accredited dealer, with live weekly prices on our Motability catalogue and demonstrations from Heathrow and Ferndown.",
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
    "Answers to real customer questions about boot hoists, Motability, demos, VAT relief and vehicle adaptations — written for search and AI assistants, without personal details.",
  path: "/faq",
});

export const revalidate = 300;

export default async function FaqPage() {
  const knowledge = await getKnowledgeFaqs();
  const byCategory = KNOWLEDGE_FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: knowledge.filter((f) => f.category === cat.id),
  })).filter((cat) => cat.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...operationalFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
      ...knowledge.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    ],
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
        subtitle="Practical answers from the questions customers ask us every day — demos, Motability, hoists and more."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

          <p className="mb-10 text-sm leading-relaxed text-muted">
            Advice pages use anonymised question themes only. We never publish
            names, addresses, phone numbers or other personal details from calls
            or jobs.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-primary">
              Booking &amp; how we work
            </h2>
            {operationalFaqs.map((faq) => (
              <div key={faq.q} className="border-t border-border pt-5">
                <h3 className="text-xl font-bold">{faq.q}</h3>
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

          {byCategory.map((cat) => (
            <div key={cat.id} className="mt-14 space-y-6">
              <h2 className="text-2xl font-extrabold text-primary">{cat.label}</h2>
              {cat.items.map((faq) => (
                <div key={faq.slug} className="border-t border-border pt-5">
                  <h3 className="text-xl font-bold">
                    <Link
                      href={`/faq/${faq.slug}`}
                      className="hover:text-primary hover:underline underline-offset-4"
                    >
                      {faq.question}
                    </Link>
                  </h3>
                  <p className="mt-2 leading-relaxed text-foreground/85">
                    {faq.answer}
                  </p>
                  <Link
                    href={`/faq/${faq.slug}`}
                    className="mt-2 inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
                  >
                    Read full answer →
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <CtaFooter />
    </>
  );
}
