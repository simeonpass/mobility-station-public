import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free UK Delivery on Everything",
  description:
    "Free delivery on every order — tracked courier for small items, free kerbside pallet for large equipment. Heathrow & Ferndown local setup.",
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
        name: "Delivery Information",
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
        title="Free UK delivery on everything"
        subtitle="Free tracked courier on smaller items · Free kerbside pallet on large equipment · Full manufacturer warranty included."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-4xl space-y-10">
          <DeliveryChecker />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Next-day delivery",
                desc: "In-stock items dispatched same day via FedEx for next-day delivery.",
              },
              {
                icon: Clock,
                title: "Manufacturer direct",
                desc: "Items shipped from the manufacturer typically arrive within 3–5 working days.",
              },
              {
                icon: MapPin,
                title: "Local delivery",
                desc: "Large mobility equipment delivered and set up within our local service area.",
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
            icon={Package}
            title="Stocked items — next-day delivery"
            body="Products held in our warehouse are dispatched the same working day (orders before 2pm) via FedEx for next-day delivery. You'll receive a tracking number by email."
            bullets={[
              "Free delivery on all stocked items",
              "Orders before 2pm dispatched same day (Mon–Fri)",
              "Full tracking provided via FedEx",
              "Signature required on delivery",
            ]}
          />

          <PolicyBlock
            icon={Clock}
            title="Manufacturer-shipped items — 3 to 5 working days"
            body="Some products ship directly from the manufacturer so you receive fresh stock with full warranty. These typically arrive within 3–5 working days."
            bullets={[
              "Free delivery included",
              "Shipped direct from the manufacturer",
              "We'll keep you updated on the expected date",
              "Full manufacturer warranty from day one",
            ]}
          />

          <section className="rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-bold text-primary">
                  Large items — free UK pallet delivery
                </h2>
                <p className="mb-4 text-muted">
                  Mobility scooters, powered wheelchairs and other large
                  equipment ship <strong>free on a kerbside pallet</strong>{" "}
                  anywhere in mainland UK. Inside our local{" "}
                  <Link
                    href="/service-area"
                    className="font-semibold text-primary underline"
                  >
                    service area
                  </Link>{" "}
                  around Heathrow and Ferndown we&apos;ll deliver and set up in
                  person at no extra cost.
                </p>
                <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <p className="text-sm text-primary">
                      <strong>Please note:</strong> pallet deliveries are
                      kerbside and require a signature. Highlands &amp; Islands,
                      Northern Ireland, Isle of Man and Channel Islands may
                      incur a surcharge — contact us before ordering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PolicyBlock
            icon={ShieldCheck}
            title="Warranty & back-to-base service"
            body="On-site warranty service within ~30 miles of Heathrow and ~60 miles of Ferndown. Outside those areas, repairs are back-to-base — you arrange return to us; we cover the repaired return delivery."
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
            <p className="font-semibold text-primary">Questions about delivery?</p>
            <a
              href="tel:08007723870"
              className="mt-1 inline-block text-lg font-bold text-accent-foreground hover:underline"
            >
              0800 772 3870
            </a>
          </div>
        </div>
      </section>
      <CtaFooter title="Book a free home demonstration" />
    </>
  );
}

function PolicyBlock({
  icon: Icon,
  title,
  body,
  bullets,
}: {
  icon: typeof Package;
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
