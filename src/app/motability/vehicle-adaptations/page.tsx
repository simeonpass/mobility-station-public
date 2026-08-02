import Link from "next/link";
import { BadgeCheck, CarFront, Home, Wallet } from "lucide-react";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  getAdaptationProducts,
  type ProductListItem,
} from "@/lib/products";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Motability Vehicle Adaptations",
  description:
    "Motability driving, access and stowage adaptations — including £0 advance payment options. Assessed and fitted at Heathrow & Ferndown.",
  path: "/motability/vehicle-adaptations",
});

function isMotabilityAdaptation(p: ProductListItem) {
  return p.motability_price != null;
}

const BENEFITS = [
  {
    icon: Wallet,
    title: "Advance payment, not a shop price",
    body: "On Motability adaptations you may see a £0 or contribution advance payment — not the private retail fitting price.",
  },
  {
    icon: BadgeCheck,
    title: "Quoted against your car",
    body: "Compatibility matters. We check your vehicle before confirming what can be fitted on the scheme.",
  },
  {
    icon: CarFront,
    title: "Fitted by our engineers",
    body: "Hand controls, access aids and stowage solutions are assessed and fitted from Heathrow and Ferndown.",
  },
] as const;

const FAQS = [
  {
    q: "What does advance payment mean?",
    a: "It’s the Motability contribution figure for that adaptation on the scheme — not the private purchase price. Many popular adaptations are £0 advance payment where you are eligible.",
  },
  {
    q: "Are Motability adaptation demos free?",
    a: "Branch visits are free. Adaptation home demonstrations carry a £100 visit fee, refunded if you go ahead with us or where the order is placed via a dealership. We’ll confirm when we book.",
  },
  {
    q: "Can any car be adapted on Motability?",
    a: "Not always. We assess your vehicle first and only quote once we’ve confirmed compatibility and scheme eligibility.",
  },
  {
    q: "Do you also supply Motability scooters and wheelchairs?",
    a: "Yes — those use weekly allowance pricing on a separate Motability catalogue.",
  },
] as const;

export default async function MotabilityAdaptationsPage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getAdaptationProducts({ limit: 300 });
    products = all
      .filter(isMotabilityAdaptation)
      .sort((a, b) => {
        const ap = a.motability_price ?? 99999;
        const bp = b.motability_price ?? 99999;
        return ap - bp;
      });
  } catch (error) {
    console.error("Motability adaptations catalogue error:", error);
  }

  const freeOnScheme = products.filter((p) => p.motability_price === 0);
  const withContribution = products.filter(
    (p) => p.motability_price != null && p.motability_price > 0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <CatalogIntro
        title="Motability vehicle adaptations"
        subtitle="Driving, access and stowage adaptations on the Motability Scheme — including £0 advance payment options where eligible. Assessed and fitted by our engineers."
        primary={{
          href: "/book-a-demo?type=adaptation",
          label: "Book an adaptation demo",
        }}
        secondary={{
          href: "/contact?interest=motability#callback",
          label: "Request a callback",
        }}
      />

      <section className="border-b border-border bg-white">
        <div className="container-site py-8 md:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <MotabilityLogo height={28} />
            <p className="text-sm font-semibold text-primary">
              Adaptations on the Motability Scheme
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-bold text-primary">{title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Looking for Motability scooters or wheelchairs instead?{" "}
            <Link
              href="/motability"
              className="font-semibold text-primary underline underline-offset-2"
            >
              View weekly Motability packages
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-soft/40 py-10 md:py-12">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              How Motability adaptations work
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Scheme pricing for adaptations is about advance payment and
              eligibility — we confirm the right figure against your car before
              any work is booked.
            </p>
          </div>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tell us about your vehicle",
                body: "Make, model and what you need help with — driving, getting in and out, or stowing a chair.",
              },
              {
                step: "2",
                title: "Assessment & demonstration",
                body: "We’ll check compatibility and show suitable options. Branch visits are free; home adaptation demos have a clear £100 fee with refund terms.",
              },
              {
                step: "3",
                title: "Fitted by our team",
                body: "Once you’re happy and the scheme paperwork is in place, our engineers fit and support the adaptation.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-primary">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary/90">
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent" aria-hidden />
              Accredited dealer
            </li>
            <li className="flex items-center gap-2">
              <Home className="h-4 w-4 text-accent" aria-hidden />
              Heathrow &amp; Ferndown workshops
            </li>
            <li className="flex items-center gap-2">
              <CarFront className="h-4 w-4 text-accent" aria-hidden />
              Quoted against your car
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site pt-10 md:pt-12">
          {products.length ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                  Motability adaptations catalogue
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {products.length} products · Motability advance payment figures
                  · quotation before fitting
                </p>
              </div>

              {freeOnScheme.length ? (
                <div id="free" className="mb-14 scroll-under-header">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <MotabilityLogo height={22} />
                    <h3 className="text-xl font-extrabold text-primary">
                      £0 advance payment
                    </h3>
                  </div>
                  <p className="mb-5 text-sm text-muted">
                    Subject to eligibility and assessment.
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {freeOnScheme.map((p) => (
                      <AdaptationCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}

              {withContribution.length ? (
                <div id="contribution" className="scroll-under-header">
                  <h3 className="mb-5 text-xl font-extrabold text-primary">
                    With Motability contribution
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {withContribution.map((p) => (
                      <AdaptationCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
              Motability adaptations will appear here when available.{" "}
              <Link
                href="/contact?interest=motability#callback"
                className="font-semibold text-primary underline"
              >
                Request a callback
              </Link>{" "}
              for advice, or browse the full{" "}
              <Link
                href="/vehicle-adaptations"
                className="font-semibold text-primary underline"
              >
                adaptations catalogue
              </Link>
              .
            </p>
          )}

          <p className="mt-10 text-sm text-muted">
            Prefer the full private adaptations range?{" "}
            <Link
              href="/vehicle-adaptations"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Browse all vehicle adaptations
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Motability adaptations FAQs
          </h2>
          <dl className="mt-8 space-y-6">
            {FAQS.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-primary">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.a}
                  {item.q.includes("scooters and wheelchairs") ? (
                    <>
                      {" "}
                      <Link
                        href="/motability"
                        className="font-semibold text-primary underline underline-offset-2"
                      >
                        Motability scooters &amp; wheelchairs
                      </Link>
                      .
                    </>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaFooter
        title="Talk to us about Motability adaptations"
        subtitle="We’ll check your vehicle, explain advance payment figures, and book a demonstration if you want to try options."
        primary={{
          href: "/book-a-demo?type=adaptation",
          label: "Book a demonstration",
        }}
        secondary={{
          href: "/contact?interest=motability#callback",
          label: "Request a callback",
        }}
      />
    </>
  );
}
