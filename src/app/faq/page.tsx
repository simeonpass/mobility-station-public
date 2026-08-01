import Link from "next/link";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript } from "@/lib/seo";

const faqs: {
  q: string;
  a: string;
  href?: string;
  hrefLabel?: string;
  lane?: "adaptations" | "mobility" | "shared";
}[] = [
  {
    lane: "shared",
    q: "Do you offer home demonstrations?",
    a: "Yes. Branch demonstrations at Heathrow and Ferndown are always free, and we bring equipment to your home across our service area.",
    href: "/book-a-demo",
    hrefLabel: "Book a demonstration",
  },
  {
    lane: "shared",
    q: "What does a home demonstration cost?",
    a: "Motability scooter and wheelchair home demos are free. Private scooter, wheelchair and vehicle adaptation home visits carry a £100 fee, fully refundable if you place an order.",
    href: "/book-a-demo#demo-terms",
    hrefLabel: "Full demo terms",
  },
  {
    lane: "shared",
    q: "Do you cover my area?",
    a: "Home demos, fitting and equipment over 30 kg are local to Heathrow (~30 miles) and Ferndown (~60 miles). Lightweight items under 30 kg can ship UK-wide. Check your postcode for coverage.",
    href: "/service-area",
    hrefLabel: "Check your postcode",
  },
  {
    lane: "adaptations",
    q: "Can I buy vehicle adaptations online?",
    a: "No — every adaptation is checked against your vehicle first, so we quote before any work is booked. Prices shown are indicative supplied and fitted figures. Call-out / collection bands apply when we collect your vehicle.",
    href: "/quote?interest=adaptation",
    hrefLabel: "Request a quotation",
  },
  {
    lane: "adaptations",
    q: "Do you do Motability vehicle adaptations?",
    a: "Yes. Many driving, access and stowage adaptations are available on Motability, including £0 advance payment where eligible. We quote and fit from Heathrow and Ferndown.",
    href: "/motability/vehicle-adaptations",
    hrefLabel: "Motability adaptations",
  },
  {
    lane: "mobility",
    q: "Do you supply Motability scooters and wheelchairs?",
    a: "Yes. We are a Motability Scheme accredited dealer, with live weekly prices and free Motability home demonstrations for scooters and wheelchairs.",
    href: "/motability/scooters-wheelchairs",
    hrefLabel: "Motability scooters & wheelchairs",
  },
  {
    lane: "mobility",
    q: "Can I get free UK delivery on a scooter?",
    a: "Items under 30 kg can ship UK-wide by tracked courier. Equipment over 30 kg (most full-size scooters and powerchairs) is local delivery only from Heathrow or Ferndown — or collect from a branch.",
    href: "/delivery",
    hrefLabel: "Delivery policy",
  },
  {
    lane: "mobility",
    q: "Can I claim VAT relief?",
    a: "Many customers with a long-term illness or disability can buy eligible products without VAT. You declare eligibility at checkout.",
    href: "/vat-relief",
    hrefLabel: "How VAT relief works",
  },
];

export const metadata = createMetadata({
  title: "FAQ | Mobility Station",
  description:
    "Answers about home demos, Motability adaptations vs scooters, delivery over 30 kg, quotations and VAT relief.",
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

  const shared = faqs.filter((f) => f.lane === "shared");
  const adaptations = faqs.filter((f) => f.lane === "adaptations");
  const mobility = faqs.filter((f) => f.lane === "mobility");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Frequently asked questions"
        subtitle="Split by what you need — shared answers first, then adaptations vs scooters & wheelchairs."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-12">
          <FaqGroup title="For everyone" items={shared} />
          <FaqGroup title="Vehicle adaptations" items={adaptations} />
          <FaqGroup title="Scooters & wheelchairs" items={mobility} />
        </div>
      </section>
      <CtaFooter
        title="Still not sure which path you need?"
        subtitle="Request a callback — we’ll point you to adaptations or scooters & wheelchairs."
      />
    </>
  );
}

function FaqGroup({
  title,
  items,
}: {
  title: string;
  items: typeof faqs;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <div className="mt-4 space-y-6">
        {items.map((faq) => (
          <div key={faq.q} className="border-t border-border pt-5">
            <h3 className="text-xl font-bold text-primary">{faq.q}</h3>
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
    </div>
  );
}
