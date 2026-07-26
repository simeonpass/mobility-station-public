import Link from "next/link";
import { HireFleet } from "@/components/hire/hire-fleet";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import {
  FLEX_MIN_MONTHS,
  FLEX_ZONE_MILES,
  HIRE_RATE_CARD,
  SHORT_TERM_MAX_DAYS,
} from "@/lib/hire";
import {
  DUMMY_HIRE_PRODUCTS,
  formatGBP,
  getHireProducts,
} from "@/lib/products";
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
  const usingDummyFleet = products.length === 0;
  if (usingDummyFleet) {
    products = DUMMY_HIRE_PRODUCTS;
  }

  const tiers = Object.values(HIRE_RATE_CARD);

  return (
    <>
      <Hero
        compact
        title="Hire a scooter or wheelchair"
        subtitle="Short-term for a few days or weeks — or Flex Hire for ongoing monthly use. Local coverage only."
        primaryHref="#fleet"
        primaryLabel="Browse the fleet"
        secondaryHref="/contact?interest=callback#callback"
        secondaryLabel="Request a callback"
      />

      <section className="border-b border-border bg-soft py-10 md:py-12">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Short-term hire
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              A few days up to {SHORT_TERM_MAX_DAYS}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Fixed dates and package pricing. Collect free from a branch, or we
              can deliver and collect for a call-out charge both ways.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>· Minimum 3 days</li>
              <li>· Refundable deposit on the card</li>
              <li>· Need it longer? Switch to Flex</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-white p-6 ring-1 ring-primary/20">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Flex Hire
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              Monthly · {FLEX_MIN_MONTHS}-month minimum
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pay the first month and deposit today, then the same monthly rate
              after that. After {FLEX_MIN_MONTHS} months you can cancel with 14
              days’ notice.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>
                · Flex zone: Heathrow {FLEX_ZONE_MILES.heathrow} mi · Ferndown{" "}
                {FLEX_ZONE_MILES.ferndown} mi
              </li>
              <li>· Free delivery, collection and fault call-outs in zone</li>
              <li>· Batteries, servicing and maintenance included</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-12">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-primary">
              What’s included
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">The equipment</strong> — scooter
                or wheelchair, charger, and a quick how-to when we hand it over.
              </li>
              <li>
                <strong className="text-primary">Deposit</strong> — held against
                loss, theft or damage beyond fair wear and tear, then returned
                when the hire ends cleanly.
              </li>
              <li>
                <strong className="text-primary">Standard hire cover</strong> —
                we supply insured hire stock; you look after it while it’s with
                you. Full responsibilities are in the hire terms.
              </li>
              <li>
                <strong className="text-primary">Flex extras</strong> — batteries,
                servicing, maintenance, and free delivery / collection / fault
                call-outs inside the Flex zone.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-primary">How it works</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/85">
              <li>Choose short-term or Flex and pick a machine below.</li>
              <li>
                Confirm dates (or start date for Flex) and your postcode or
                branch.
              </li>
              <li>
                Pay online — short-term hire + deposit, or Flex month one +
                deposit.
              </li>
              <li>We deliver, or you collect from Heathrow or Ferndown.</li>
              <li>
                Return it on the end date, or end Flex with notice after the
                minimum term.
              </li>
            </ol>
            <p className="mt-5 text-sm text-muted">
              Full hire agreement:{" "}
              <Link
                href="/hire/terms"
                className="font-semibold text-primary underline underline-offset-2"
              >
                hire terms &amp; conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-soft py-10 md:py-12">
        <div className="container-site">
          <h2 className="text-xl font-extrabold text-primary">Guide prices</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Short-term is priced by the week (or shorter packages). Flex is a
            flat monthly rate. Exact price for each machine is shown in the
            fleet below.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-border bg-soft/80 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Machine type</th>
                  <th className="px-4 py-3 font-semibold">Short-term / week</th>
                  <th className="px-4 py-3 font-semibold">Flex / month</th>
                  <th className="px-4 py-3 font-semibold">Deposit</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-primary">
                      {tier.label}
                    </td>
                    <td className="px-4 py-3">{formatGBP(tier.weekly)}</td>
                    <td className="px-4 py-3">{formatGBP(tier.monthly)}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatGBP(tier.deposit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Short-term also has 3-day and 2-week packages — shown when you pick
            dates.
          </p>
        </div>
      </section>

      <section id="fleet" className="scroll-mt-28 pb-16 md:pb-20 pt-10 md:pt-12">
        <div className="container-site">
          <h2 className="mb-6 text-xl font-extrabold text-primary">
            Choose a machine
          </h2>
          <HireFleet
            products={products}
            initialMode={initialMode}
            preview={usingDummyFleet}
          />
        </div>
      </section>
      <CtaFooter
        title="Not sure which option fits?"
        subtitle="Tell us how long you need it and your postcode — we’ll confirm Flex zone or short-term call-out before you book."
      />
    </>
  );
}
