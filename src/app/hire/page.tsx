import { HireFleet } from "@/components/hire/hire-fleet";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import {
  FLEX_MIN_MONTHS,
  FLEX_ZONE_MILES,
  HIRE_RATE_CARD,
  SHORT_TERM_MAX_DAYS,
} from "@/lib/hire";
import { formatGBP, getHireProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Hire scooters & wheelchairs | Short-term & Flex",
  description:
    "Short-term hire and Flex monthly hire from Heathrow and Ferndown. Coverage-area delivery only. Month 1 + deposit upfront on Flex.",
  path: "/hire",
});

export default async function HirePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: modeParam } = await searchParams;
  const initialMode = modeParam === "flex" ? "flex" : "short";

  let products: Awaited<ReturnType<typeof getHireProducts>> = [];
  try {
    products = await getHireProducts();
  } catch (error) {
    console.error("Hire fleet error:", error);
  }

  return (
    <>
      <Hero
        compact
        title="Hire a scooter or wheelchair"
        subtitle="Short-term for a few days or weeks — or Flex Hire for ongoing monthly use. Coverage area only. Delivery and servicing included on Flex."
        primaryHref="#fleet"
        primaryLabel="Browse the fleet"
        secondaryHref="/contact?interest=hire"
        secondaryLabel="Ask us first"
      />

      <section className="border-b border-border bg-soft py-10 md:py-12">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Short-term
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              From a few days up to {SHORT_TERM_MAX_DAYS}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Fixed dates, package pricing, branch pickup free. Local delivery
              and collection charged at our call-out band (both ways).
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>· Min 3 days · max {SHORT_TERM_MAX_DAYS} days</li>
              <li>· Refundable deposit held on the card</li>
              <li>· Longer than a month? Choose Flex instead</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-white p-6 ring-1 ring-primary/20">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Flex Hire
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              Flat monthly · {FLEX_MIN_MONTHS}-month minimum
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pay month one + deposit today. We bill each month after that.
              After {FLEX_MIN_MONTHS} months, cancel any time with 14 days’
              notice. Delivery, collection and fault call-outs are free inside
              the Flex zone.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>
                · Flex zone: Heathrow {FLEX_ZONE_MILES.heathrow} mi · Ferndown{" "}
                {FLEX_ZONE_MILES.ferndown} mi
              </li>
              <li>· Batteries, servicing &amp; maintenance included</li>
              <li>· Punctures extra (we fit solids where we can)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container-site">
          <h2 className="text-xl font-extrabold text-primary">
            Guide monthly prices
          </h2>
          <p className="mt-1 text-sm text-muted">
            One price per machine — no new/used split. Exact figure is shown on
            each fleet item.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.values(HIRE_RATE_CARD).map((tier) => (
              <div
                key={tier.id}
                className="rounded-xl border border-border bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-primary">{tier.label}</p>
                <p className="mt-1 text-lg font-extrabold text-primary">
                  {formatGBP(tier.monthly)}
                  <span className="text-sm font-medium text-muted"> / mo</span>
                </p>
                <p className="text-xs text-muted">
                  Week from {formatGBP(tier.weekly)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fleet" className="scroll-mt-28 pb-16 md:pb-20">
        <div className="container-site">
          <HireFleet products={products} initialMode={initialMode} />
        </div>
      </section>
      <CtaFooter
        title="Not sure which option fits?"
        subtitle="Tell us how long you need it and your postcode — we’ll confirm Flex zone or short-term call-out before you book."
      />
    </>
  );
}
