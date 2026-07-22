import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

const hireRates = [
  { days: "1 day", price: "£35" },
  { days: "2 days", price: "£55" },
  { days: "3 days", price: "£70" },
  { days: "4–6 days", price: "£90" },
  { days: "7 days", price: "£110" },
  { days: "Extra day", price: "+£12" },
];

export const metadata = createMetadata({
  title: "Mobility Scooter Hire",
  description:
    "Short-term mobility scooter hire from Mobility Station. Daily rates, ID requirements and hire enquiries for Heathrow & Ferndown.",
  path: "/mobility-scooter-hire",
});

export default function HirePage() {
  return (
    <>
      <Hero
        compact
        title="Mobility scooter hire"
        subtitle="Short-term hire for holidays, recovery and visiting family — arranged through Heathrow or Ferndown."
        primaryHref="#enquire"
        primaryLabel="Hire enquiry"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Daily hire guide</h2>
            <p className="mt-3 text-sm text-muted">
              Indicative private hire rates. Final pricing depends on scooter
              class and availability.
            </p>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {hireRates.map((row) => (
                <div
                  key={row.days}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium">{row.days}</span>
                  <span className="font-extrabold text-primary">{row.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold">ID required</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                Hire customers must provide valid photo ID and proof of address
                before collection or delivery. Where needed, documents can be
                uploaded through our customer portal after your enquiry is
                accepted.
              </p>
            </div>
          </div>
          <div id="enquire" className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="hire"
              title="Hire enquiry"
              defaultInterest="Mobility scooter hire"
            />
          </div>
        </div>
      </section>
    </>
  );
}
