import Link from "next/link";
import { BadgeCheck, Home, Phone, Wallet } from "lucide-react";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { MotabilityProductCard } from "@/components/product/motability-product-card";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { getPublishedProducts, type ProductListItem } from "@/lib/products";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Motability Scooters & Wheelchairs",
  description:
    "Motability-accredited scooters and wheelchairs with weekly allowance prices. Free home demonstrations from Heathrow & Ferndown.",
  path: "/motability",
});

const WHEELCHAIR_CATS = new Set([
  "Manual Wheelchairs",
  "Powered Wheelchairs",
  "Folding Powered Wheelchairs",
  "Wheelchairs",
]);

function isMotabilityProduct(p: ProductListItem) {
  return (
    (p.motability_weekly_price != null && p.motability_weekly_price > 0) ||
    p.motability_price != null
  );
}

function isWheelchair(p: ProductListItem) {
  return WHEELCHAIR_CATS.has(p.category || "");
}

const WEEKLY_BENEFITS = [
  {
    icon: Wallet,
    title: "Pay weekly from your allowance",
    body: "Exchange qualifying mobility allowance for a scooter or wheelchair package — no large retail purchase price.",
  },
  {
    icon: BadgeCheck,
    title: "Accredited Motability dealer",
    body: "We guide you through eligibility, choice and paperwork in plain English.",
  },
  {
    icon: Home,
    title: "Free home demonstration",
    body: "Try suitable models at home from Heathrow or Ferndown before you decide.",
  },
] as const;

const FAQS = [
  {
    q: "Are you Motability accredited?",
    a: "Yes. Mobility Station is a Motability Scheme accredited dealer. We guide you through scooter and wheelchair options in plain English.",
  },
  {
    q: "What do the weekly prices mean?",
    a: "Weekly figures shown are indicative Motability scheme amounts from our live catalogue — not a retail shop price. Final eligibility, allowance and payments are confirmed during your Motability assessment. Contact us to talk through any model.",
  },
  {
    q: "Why don’t you show a purchase price?",
    a: "On Motability you typically exchange your mobility allowance rather than buying outright at a retail price. That’s why we highlight the weekly figure and ask you to contact us to arrange a demo or assessment.",
  },
  {
    q: "Do you also do Motability vehicle adaptations?",
    a: "Yes. Many driving, access and stowage adaptations are available on the scheme, including £0 advance payment where eligible.",
  },
] as const;

export default async function MotabilityPage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getPublishedProducts({ limit: 500, shopOnly: true });
    products = all
      .filter(isMotabilityProduct)
      .sort((a, b) => {
        const aw = a.motability_weekly_price ?? (a.motability_price === 0 ? 0 : 999);
        const bw = b.motability_weekly_price ?? (b.motability_price === 0 ? 0 : 999);
        return aw - bw;
      });
  } catch (error) {
    console.error("Motability catalogue error:", error);
  }

  const scooters = products.filter((p) => !isWheelchair(p));
  const wheelchairs = products.filter(isWheelchair);

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
        title="Motability scooters & wheelchairs"
        subtitle="Weekly figures from your mobility allowance — not retail purchase prices. Free home demonstrations from Heathrow and Ferndown."
        primary={{
          href: "/book-a-demo",
          label: "Book a free Motability demo",
        }}
        secondary={{
          href: "/contact?interest=callback#callback",
          label: "Request a callback",
        }}
      />

      <section className="border-b border-border bg-white">
        <div className="container-site py-8 md:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <MotabilityLogo height={28} />
            <p className="text-sm font-semibold text-primary">
              Why weekly Motability pricing matters
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {WEEKLY_BENEFITS.map(({ icon: Icon, title, body }) => (
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
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary/90">
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent" aria-hidden />
              Accredited dealer
            </li>
            <li className="flex items-center gap-2">
              <Home className="h-4 w-4 text-accent" aria-hidden />
              Free home demos
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              Heathrow &amp; Ferndown
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-soft/40 py-10 md:py-12">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              How Motability works
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              You don’t buy these models at a shop price on the scheme — you
              exchange allowance for a weekly package. We help you choose and
              handle the paperwork.
            </p>
          </div>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Check your allowance",
                body: "If you receive a qualifying mobility allowance, you may exchange it for a scooter or wheelchair package.",
              },
              {
                step: "2",
                title: "Try before you decide",
                body: "Book a free Motability home demonstration and we’ll bring suitable models to you.",
              },
              {
                step: "3",
                title: "We handle the paperwork",
                body: "As an accredited dealer we guide you through assessment, choice and ongoing support.",
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
          <p className="mt-6 text-sm text-muted">
            Looking for vehicle adaptations on Motability?{" "}
            <Link
              href="/motability/vehicle-adaptations"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Motability vehicle adaptations
            </Link>
            . Or{" "}
            <Link
              href="/brochure/scooters-wheelchairs"
              className="font-semibold text-primary underline underline-offset-2"
            >
              download the scooters &amp; wheelchairs brochure
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site pt-10 md:pt-12">
          {products.length ? (
            <>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                    Live Motability catalogue
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {products.length} products · weekly Motability figures only
                    · contact us to arrange a demo
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scooters.length ? (
                    <a
                      href="#scooters"
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                    >
                      Scooters ({scooters.length})
                    </a>
                  ) : null}
                  {wheelchairs.length ? (
                    <a
                      href="#wheelchairs"
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                    >
                      Wheelchairs ({wheelchairs.length})
                    </a>
                  ) : null}
                </div>
              </div>

              {scooters.length ? (
                <div id="scooters" className="mb-14 scroll-under-header">
                  <h3 className="mb-5 text-xl font-extrabold text-primary">
                    Scooters
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {scooters.map((p) => (
                      <MotabilityProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}

              {wheelchairs.length ? (
                <div id="wheelchairs" className="scroll-under-header">
                  <h3 className="mb-5 text-xl font-extrabold text-primary">
                    Wheelchairs
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {wheelchairs.map((p) => (
                      <MotabilityProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
              Motability products will appear here when available.{" "}
              <Link
                href="/contact?interest=callback#callback"
                className="font-semibold text-primary underline"
              >
                Request a callback
              </Link>{" "}
              for advice.
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Motability FAQs
          </h2>
          <dl className="mt-8 space-y-6">
            {FAQS.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-primary">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.a}
                  {item.q.includes("vehicle adaptations") ? (
                    <>
                      {" "}
                      <Link
                        href="/motability/vehicle-adaptations"
                        className="font-semibold text-primary underline underline-offset-2"
                      >
                        Motability vehicle adaptations
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
        title="Book a Motability demonstration"
        subtitle="Free Motability scooter and wheelchair home demos from Heathrow and Ferndown — no obligation. We’ll confirm weekly figures at assessment."
      />
    </>
  );
}
