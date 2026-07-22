import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Trade-In Your Scooter or Wheelchair",
  description:
    "Get a valuation on your mobility scooter or wheelchair. 30-mile limit and category restrictions apply. Heathrow & Ferndown.",
  path: "/trade-in",
});

export default function TradeInPage() {
  return (
    <>
      <Hero
        compact
        title="Trade-in valuation"
        subtitle="Thinking of upgrading? Ask us for a valuation on your scooter or wheelchair."
        primaryHref="#form"
        primaryLabel="Get a valuation"
      />
      <section id="form" className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Trade-in guidelines</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">30-mile limit:</strong> we
                generally collect or assess trade-ins within roughly 30 miles of
                Heathrow or Ferndown.
              </li>
              <li>
                <strong className="text-primary">Category restriction:</strong>{" "}
                trade-ins are limited to mobility scooters and wheelchairs in
                suitable condition.
              </li>
              <li>
                Valuations depend on age, condition, brand and current demand.
                There is no obligation to proceed.
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="trade-in"
              title="Request a valuation"
              defaultInterest="Trade-in valuation"
            />
          </div>
        </div>
      </section>
    </>
  );
}
