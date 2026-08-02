import Link from "next/link";
import {
  Accessibility,
  Bike,
  FoldHorizontal,
  Phone,
  Truck,
} from "lucide-react";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { formatGBP } from "@/lib/products";
import { createMetadata, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Hire scooters & wheelchairs | Short-term & Flex",
  description:
    "Indicative hire prices for scooters and wheelchairs from Heathrow and Ferndown. Call us to check availability and book.",
  path: "/hire",
});

/** Interim public rate bands until live hire stock is listed in admin. */
const HIRE_BANDS = [
  {
    id: "folding",
    label: "Folding / travel scooters",
    blurb: "Boot-friendly models for holidays and short trips.",
    icon: FoldHorizontal,
    fromWeekly: 85,
    fromMonthly: 79,
  },
  {
    id: "small",
    label: "Small scooters",
    blurb: "Compact pavement scooters for everyday local use.",
    icon: Bike,
    fromWeekly: 95,
    fromMonthly: 89,
  },
  {
    id: "medium",
    label: "Medium scooters",
    blurb: "Stable mid-size hire machines with a comfortable ride.",
    icon: Bike,
    fromWeekly: 125,
    fromMonthly: 115,
  },
  {
    id: "large",
    label: "Large / road scooters",
    blurb: "Bigger, more powerful scooters for longer distances.",
    icon: Truck,
    fromWeekly: 145,
    fromMonthly: 135,
  },
  {
    id: "wheelchair",
    label: "Wheelchairs",
    blurb: "Manual and powered wheelchairs — tell us what you need.",
    icon: Accessibility,
    fromWeekly: 65,
    fromMonthly: 59,
  },
] as const;

export default function HirePage() {
  return (
    <>
      <CatalogIntro
        title="Hire a scooter or wheelchair"
        subtitle="Short-term and Flex monthly hire from Heathrow and Ferndown. Guide prices below — call us to check what’s available and book."
        primary={{ href: SITE.phoneHref, label: `Call ${SITE.phone}` }}
        secondary={{
          href: "/contact?interest=hire#callback",
          label: "Request a callback",
        }}
      />

      <div className="border-b border-border bg-soft/70">
        <div className="container-site py-3 text-sm text-muted">
          <strong className="font-semibold text-primary">Guide prices only.</strong>{" "}
          Exact model, dates and delivery depend on availability — we’ll confirm
          when you call.
        </div>
      </div>

      <section className="border-b border-border py-10 md:py-12">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              Hire from these prices
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Weekly rates for short-term hire. Flex is a monthly rate with a
              3-month minimum — useful if you need something longer term.
            </p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIRE_BANDS.map(
              ({ id, label, blurb, icon: Icon, fromWeekly, fromMonthly }) => (
                <li
                  key={id}
                  className="flex flex-col rounded-2xl border border-border bg-white p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-primary">
                    {label}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                    {blurb}
                  </p>
                  <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-muted">Short-term from</dt>
                      <dd className="font-extrabold tabular-nums text-primary">
                        {formatGBP(fromWeekly)}
                        <span className="text-xs font-semibold text-muted">
                          /week
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-muted">Flex from</dt>
                      <dd className="font-bold tabular-nums text-primary">
                        {formatGBP(fromMonthly)}
                        <span className="text-xs font-semibold text-muted">
                          /month
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <a
                    href={SITE.phoneHref}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "mt-4 w-full rounded-full",
                    )}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call to book
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-soft py-10 md:py-12">
        <div className="container-site grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-primary">
              Short-term hire
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A few days or a couple of weeks — holidays, recovery, or trying
              before you buy. Collect from Heathrow or Ferndown, or ask about
              local delivery.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>· From 3 days</li>
              <li>· Refundable deposit</li>
              <li>· We’ll match you to an available machine</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-primary">Flex Hire</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Monthly hire if you need something longer. 3-month minimum, then
              cancel with notice. Free delivery and collection inside our Flex
              zone.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
              <li>· Heathrow ~10 miles · Ferndown ~20 miles</li>
              <li>· Servicing and batteries included on Flex</li>
              <li>· Call us to check zone and start date</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10 md:py-12">
        <div className="container-site max-w-3xl">
          <h2 className="text-xl font-extrabold text-primary">How to hire</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/85">
            <li>Pick the type that fits — folding, small, medium, large or wheelchair.</li>
            <li>
              Call{" "}
              <a
                href={SITE.phoneHref}
                className="font-semibold text-primary underline underline-offset-2"
              >
                {SITE.phone}
              </a>{" "}
              or{" "}
              <Link
                href="/contact?interest=hire#callback"
                className="font-semibold text-primary underline underline-offset-2"
              >
                request a callback
              </Link>{" "}
              with your dates and postcode.
            </li>
            <li>We’ll confirm availability, price and delivery or collection.</li>
            <li>Collect from Heathrow or Ferndown, or arrange local delivery.</li>
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
      </section>

      <CtaFooter
        title="Ready to hire?"
        subtitle="Call us with your dates and postcode — we’ll confirm what’s free and the exact weekly or Flex price."
        primary={{ href: SITE.phoneHref, label: `Call ${SITE.phone}` }}
        secondary={{
          href: "/contact?interest=hire#callback",
          label: "Request a callback",
        }}
      />
    </>
  );
}
