import Link from "next/link";
import { MapPin, Receipt, Settings, Truck } from "lucide-react";

/**
 * Buying explanations for scooter / wheelchair PDPs — delivery, setup,
 * takeaway credit and VAT relief.
 */
export function ShopBuyingGuide() {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">
              Delivery &amp; getting it to you
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              Order online for delivery or branch collection. Within our local
              service area we can often deliver and set up at home. Further
              afield we use free mainland UK courier or kerbside pallet delivery
              for larger machines — you&apos;ll see the options at checkout once
              we have your postcode.
            </p>
            <p className="mt-3">
              <Link
                href="/delivery"
                className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                How delivery works →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">
              Area we cover &amp; setup
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              Local home delivery, demonstrations and setup are focused around
              our Heathrow (West Drayton) and Ferndown (Wimborne) workshops —
              roughly 30 miles and 60 miles respectively. In that area we can
              usually bring the scooter or wheelchair to you, help with
              controls and show you how it works. Outside the area, collection
              from a branch or courier delivery are still available.
            </p>
            <p className="mt-3">
              <Link
                href="/service-area"
                className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                Check your postcode →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Settings className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">
              Old scooter takeaway
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              Buying a scooter or wheelchair from us? We can take your old one
              away and knock a fixed credit off the order — not a trade-in
              valuation, just a straightforward gesture. Credit is available
              when you collect from a branch, or when we deliver inside our
              local service area. Tick the option at checkout if you qualify.
            </p>
            <p className="mt-3">
              <Link
                href="/trade-in"
                className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                See the credit bands →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Receipt className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">VAT relief</h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              If you have a long-term illness or disability and the product is
              for your personal use, you may buy eligible scooters and
              wheelchairs without VAT. Prices on this page default to the VAT
              relief figure where applicable — use the toggle to see the price
              including VAT. You confirm eligibility at checkout.
            </p>
            <p className="mt-3">
              <Link
                href="/vat-relief"
                className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                How VAT relief works →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
