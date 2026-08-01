import Link from "next/link";
import { ServiceAreaChecker } from "@/components/service-area/service-area-checker";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { LOCATION_PAGES } from "@/data/location-pages";
import { WORKSHOPS } from "@/lib/service-area";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Service area — Greater London & the South",
  description:
    "Check if we cover your postcode. Local delivery, demos and fitting from Heathrow and Ferndown across Greater London and the South / South West.",
  path: "/service-area",
});

export default function ServiceAreaPage() {
  const heathrow = LOCATION_PAGES.filter((p) => p.branch === "Heathrow");
  const ferndown = LOCATION_PAGES.filter((p) => p.branch === "Ferndown");

  return (
    <>
      <Hero
        compact
        title="Our local service area"
        subtitle="Greater London and the South / South West from Heathrow and Ferndown — for demos, fitting and equipment over 30 kg. Lightweight items under 30 kg can ship UK-wide."
        primaryHref="/contact"
        primaryLabel="Ask about your area"
        secondaryHref="/locations"
        secondaryLabel="Branch addresses & hours"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-4xl space-y-10">
          <ServiceAreaChecker />

          <div className="grid gap-6 md:grid-cols-2">
            {WORKSHOPS.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <h2 className="text-xl font-extrabold text-primary">{w.name}</h2>
                <p className="mt-1 text-sm text-muted">{w.postcode}</p>
                <p className="mt-3 text-sm text-muted">{w.bandRationale}</p>
                <ul className="mt-4 space-y-1 text-sm">
                  {w.bands.map((b) => (
                    <li
                      key={b.range}
                      className="flex justify-between gap-3 border-b border-border/60 py-1.5"
                    >
                      <span className="text-muted">{b.range}</span>
                      <span className="font-semibold text-primary">
                        {b.fee === 0 ? "Free" : `£${b.fee}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <TownGroup title="Heathrow catchment" towns={heathrow} />
          <TownGroup title="Ferndown catchment" towns={ferndown} />
        </div>
      </section>
      <CtaFooter />
    </>
  );
}

function TownGroup({
  title,
  towns,
}: {
  title: string;
  towns: typeof LOCATION_PAGES;
}) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-extrabold text-primary">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {towns.map((t) => (
          <Link
            key={t.slug}
            href={`/service-area/${t.slug}`}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
          >
            {t.town}
          </Link>
        ))}
      </div>
    </div>
  );
}
