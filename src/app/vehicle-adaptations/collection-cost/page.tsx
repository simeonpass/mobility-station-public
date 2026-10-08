import Link from "next/link";
import { ArrowRight, CarFront, MapPin, Phone } from "lucide-react";
import { VehicleCollectionChecker } from "@/components/service-area/vehicle-collection-checker";
import { CtaFooter } from "@/components/sections/cta-footer";
import { WORKSHOPS } from "@/lib/service-area";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Vehicle Collection Cost Checker | Adaptation Fitting",
  description:
    "Enter a postcode to estimate the charge for collecting and returning your car for vehicle adaptation work at Heathrow or Ferndown.",
  path: "/vehicle-adaptations/collection-cost",
});

export default function VehicleCollectionCostPage() {
  return (
    <>
      <section className="ms-page-intro border-b border-border bg-white">
        <div className="container-site py-14 md:py-20 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Vehicle adaptations · Collection &amp; return
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-primary md:text-6xl lg:text-7xl">
            What will it cost to collect your car?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            We can collect your vehicle, bring it to our Heathrow or Ferndown workshop
            for adaptation fitting, then return it to you. Check the postcode for an
            estimated round-trip charge.
          </p>
        </div>
      </section>

      <section className="bg-soft/45 py-14 md:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <VehicleCollectionChecker />

          <aside className="rounded-lg bg-primary p-7 text-white md:p-8">
            <CarFront className="h-7 w-7 text-accent-on-dark" aria-hidden />
            <h2 className="mt-5 text-2xl font-extrabold text-white">What the charge covers</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/75">
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                Collection of your vehicle from your address
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                Transport to the most suitable Mobility Station workshop
              </li>
              <li className="flex gap-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-on-dark" aria-hidden />
                Return of the vehicle after the agreed adaptation work
              </li>
            </ul>
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="text-sm text-white/65">Prefer to talk it through?</p>
              <a href="tel:08007723870" className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-white hover:text-accent-on-dark">
                <Phone className="h-4 w-4" aria-hidden /> 0800 772 3870
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Published collection bands</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Charges from each workshop
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              The checker compares both workshops and uses the lowest available band for the postcode.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {WORKSHOPS.map((workshop) => (
              <article key={workshop.id} className="rounded-lg border border-border bg-white p-6 md:p-8">
                <MapPin className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="mt-4 text-2xl font-extrabold text-primary">{workshop.name}</h3>
                <p className="mt-1 text-sm font-semibold text-muted">{workshop.postcode}</p>
                <ul className="mt-6 divide-y divide-border text-sm">
                  {workshop.bands.map((band) => (
                    <li key={band.range} className="flex items-center justify-between gap-4 py-3">
                      <span className="text-muted">{band.range}</span>
                      <span className="font-bold text-primary">{band.fee === 0 ? "Free" : `£${band.fee}`}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-muted">
                  Maximum standard collection radius: {workshop.maxRadiusMiles} miles.
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-soft/55 p-5 text-sm leading-relaxed text-muted md:p-6">
            Central London postcodes (EC, WC, W1 and SW1) have a minimum £150 charge because
            of the additional travel time and city charges. Outside the standard area,
            please <Link href="/contact?interest=adaptation" className="font-semibold text-primary underline underline-offset-2">ask us for options</Link>.
          </div>
        </div>
      </section>

      <CtaFooter
        title="Ready to arrange an adaptation?"
        subtitle="Tell us about the customer, vehicle and adaptation required. We’ll confirm compatibility, fitting and collection details."
        primary={{ href: "/contact?interest=adaptation", label: "Request a quotation" }}
        secondary={{ href: "/vehicle-adaptations", label: "Browse adaptations" }}
      />
    </>
  );
}
