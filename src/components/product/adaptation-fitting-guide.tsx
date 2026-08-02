import Link from "next/link";
import { MapPin, Wrench, Car } from "lucide-react";

/**
 * Shared explanations for adaptation PDPs — why quotes vary, workshop vs
 * mobile fitting, and where we cover.
 */
export function AdaptationFittingGuide() {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Car className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">
              Why prices are quoted for your vehicle
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              Modern cars differ a lot — steering systems, electronics, airbags,
              dashboards and mounting points. What fits one model may need
              different parts, programming or labour on another. The figures on
              this page are a starting point for supplied &amp; fitted work; we
              confirm a firm price once we know your make, model and year, and
              have checked compatibility.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wrench className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-bold text-primary">
              Workshop fitting vs mobile
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              Most adaptations are fitted at our Heathrow or Ferndown workshops,
              where we have the tools, lifts and diagnostic equipment to do the
              job properly. Some simpler fittings can still be done at your home
              or a dealership when the product and vehicle allow — we&apos;ll
              say so when we quote. We never force a mobile fit where workshop
              conditions are safer or required by the manufacturer.
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
              Area we cover
            </h3>
            <p className="mt-2 leading-relaxed text-foreground/85">
              We focus on local service from our two workshops — roughly within
              about 30 miles of Heathrow (West Drayton) and about 60 miles of
              Ferndown (Wimborne). Collection and return of your vehicle, home
              visits and mobile work (where suitable) sit inside those bands.
              Outside the area you can usually still bring the vehicle to us, or
              ask about options when you request a quote.
            </p>
            <p className="mt-3">
              <Link
                href="/service-area"
                className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                Check your postcode and call-out bands →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
