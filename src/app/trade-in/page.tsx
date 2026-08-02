import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { takeawayCreditBands } from "@/lib/takeaway-credit";
import { formatGBP } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Old scooter takeaway | Fixed credit off your new purchase",
  description:
    "Buying a new mobility scooter or wheelchair? We’ll take your old one away and knock a fixed credit off your order — based on the price of what you’re buying, not a trade-in valuation.",
  path: "/trade-in",
});

const BANDS = takeawayCreditBands(6);

export default function TradeInPage() {
  return (
    <>
      <Hero
        compact
        title="We’ll take your old scooter away"
        subtitle="Not a trade-in valuation — a simple fixed credit off your new purchase when we collect and dispose of (or keep) your old scooter or wheelchair."
        primaryHref="/shop"
        primaryLabel="Browse scooters"
        secondaryHref="/checkout"
        secondaryLabel="Go to checkout"
      />

      <section className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              How the credit works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              When you buy a scooter or wheelchair from us, tick the takeaway
              option at checkout. The credit is available when you{" "}
              <strong className="font-semibold text-primary">
                collect from Heathrow or Ferndown
              </strong>
              , or when we deliver in our{" "}
              <strong className="font-semibold text-primary">
                local service area
              </strong>
              . Outside that area, call us about a boxed return — the online
              credit isn&apos;t available with nationwide courier alone.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">Fixed bands</strong> — credit
                depends on the price of the scooter or wheelchair you’re buying,
                not the age or condition of your old one.
              </li>
              <li>
                <strong className="text-primary">One credit per order</strong> —
                based on the main scooter or wheelchair in your basket.
              </li>
              <li>
                <strong className="text-primary">We keep or dispose</strong> —
                once collected, the old machine is ours to reuse, recycle or
                scrap. This isn’t a part-exchange valuation.
              </li>
              <li>
                <strong className="text-primary">Coverage area</strong> —
                collection with a local delivery or branch handover. Ask if
                you’re unsure.
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Prefer to ask first?{" "}
              <Link
                href="/contact?interest=Old%20scooter%20takeaway"
                className="font-semibold text-primary underline"
              >
                Send us a message
              </Link>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-primary">
              Credit off your new purchase
            </h2>
            <p className="mt-2 text-sm text-muted">
              Based on the catalogue price (ex VAT) of the scooter or wheelchair
              you’re buying.
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-soft text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-primary">
                      New purchase
                    </th>
                    <th className="px-4 py-3 font-semibold text-primary">
                      Takeaway credit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BANDS.map((band) => (
                    <tr key={band.upTo} className="border-t border-border">
                      <td className="px-4 py-3 text-foreground/85">
                        {band.label}
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">
                        {formatGBP(band.credit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted">
              Example: buy a £2,450 scooter → under £3,000 band →{" "}
              {formatGBP(300)} off at checkout.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
            >
              Choose a scooter or wheelchair
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
