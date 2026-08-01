import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Delivery — local heavy equipment & UK lightweight shipping",
  description:
    "Over 30 kg: local delivery from Heathrow & Ferndown. Under 30 kg: free tracked UK shipping. Home demos and fitting across Greater London and the South.",
  path: "/delivery",
});

export default function DeliveryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Local delivery & service area",
        item: `${SITE.url}/delivery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <Hero
        compact
        title="Local delivery from Heathrow & Ferndown"
        subtitle="Heavy equipment (over 30 kg) is delivered locally from our two workshops across Greater London and the South / South West. Lightweight items under 30 kg can ship nationwide by tracked courier."
        primaryHref="/service-area"
        primaryLabel="Check your postcode"
        secondaryHref="/book-a-demo"
        secondaryLabel="Book a home demo"
      />

      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-4xl space-y-10">
          <DeliveryChecker />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Two local workshops",
                desc: "Heathrow covers west London & the Thames Valley (~30 miles). Ferndown covers Dorset, Hampshire & the south coast (~60 miles).",
              },
              {
                icon: Truck,
                title: "Local delivery & setup",
                desc: "Inside our service area we bring scooters and wheelchairs to you — large equipment set up in person where needed.",
              },
              {
                icon: Home,
                title: "Home demonstrations",
                desc: "Try before you buy at home or in branch. Motability demos free; private & adaptation visits £100 (refundable on order).",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-white p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-1 font-bold text-primary">{item.title}</h2>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <PolicyBlock
            icon={Truck}
            title="How delivery works"
            body="Lightweight accessories and folding products under 30 kg ship free by tracked courier anywhere in mainland UK — easy to return in a box if needed. Scooters, powerchairs and other equipment over 30 kg are delivered from Heathrow or Ferndown inside our local service area only."
            bullets={[
              "Under 30 kg — free tracked UK courier",
              "Over 30 kg — free local delivery inside our service area",
              "Large equipment set up in person where needed",
              "Branch collection always available at Heathrow or Ferndown",
            ]}
          />

          <PolicyBlock
            icon={Clock}
            title="Typical timescales"
            body="Local heavy deliveries are usually within 3–5 working days once a slot is booked. Lightweight courier parcels are typically next working day or 2–3 days. Items ordered in for you may take longer — we'll confirm before you commit."
            bullets={[
              "Heavy / local — usually 3–5 working days",
              "Lightweight courier — usually 1–3 working days",
              "Ordered in / made to order — usually 1–2 weeks",
              "Vehicle adaptations — fitting date agreed after quotation",
            ]}
          />

          <section className="rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-bold text-primary">
                  Why over 30 kg stays local
                </h2>
                <p className="mb-4 text-muted">
                  Full-size scooters and powerchairs are awkward to ship on a
                  pallet and even harder to collect if something goes wrong. We
                  only deliver them where our vans can reach you from Heathrow
                  or Ferndown — so we can set up properly and support you after
                  sale.
                </p>
                <ul className="mb-4 space-y-2 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <strong className="text-primary">Heathrow</strong> —
                      West Drayton and roughly 30 miles (west London, Middlesex,
                      Berkshire, parts of Surrey &amp; Bucks)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <strong className="text-primary">Ferndown</strong> —
                      Wimborne and roughly 60 miles (Dorset, Hampshire, south
                      coast &amp; nearby)
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-muted">
                  Check your postcode on our{" "}
                  <Link
                    href="/service-area"
                    className="font-semibold text-primary underline"
                  >
                    service area page
                  </Link>
                  , or{" "}
                  <Link
                    href="/contact?interest=callback#callback"
                    className="font-semibold text-primary underline"
                  >
                    request a callback
                  </Link>{" "}
                  if you&apos;re close to the edge of a ring.
                </p>
              </div>
            </div>
          </section>

          <PolicyBlock
            icon={Wrench}
            title="Vehicle adaptations (different journey)"
            body="Adaptations aren’t shop deliveries. They’re quoted and fitted at Heathrow or Ferndown — or mobile where the product allows. Vehicle collection uses our published call-out bands. Browse adaptations separately from scooter/wheelchair checkout."
            bullets={[
              "Get a quotation before any work is booked",
              "Fitting at workshop (or mobile where possible)",
              "Collection call-out bands on the service area page",
            ]}
          />

          <PolicyBlock
            icon={ShieldCheck}
            title="Warranty & aftercare"
            body="On-site warranty and servicing within our local rings around Heathrow and Ferndown. Outside those areas we can still help with back-to-base repairs if you can bring equipment to a branch."
            bullets={[]}
          />

          <PolicyBlock
            icon={RotateCcw}
            title="Returns"
            body="Under the Consumer Contracts Regulations 2013 you have 14 days from delivery to cancel, provided the product is unused and in original packaging. Made-to-order items and fitted adaptations are excluded."
            bullets={[]}
          />

          <div className="rounded-xl bg-soft p-6 text-center">
            <Phone className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="font-semibold text-primary">
              Not sure if we cover you?
            </p>
            <Link
              href="/contact?interest=callback#callback"
              className="mt-1 inline-block text-lg font-bold text-accent-foreground hover:underline"
            >
              Request a callback
            </Link>
          </div>
        </div>
      </section>
      <CtaFooter title="Book a home demonstration" />
    </>
  );
}

function PolicyBlock({
  icon: Icon,
  title,
  body,
  bullets,
}: {
  icon: typeof Truck;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="mb-2 text-xl font-bold text-primary">{title}</h2>
          <p className="mb-4 text-muted">{body}</p>
          {bullets.length ? (
            <ul className="space-y-2 text-sm text-muted">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
