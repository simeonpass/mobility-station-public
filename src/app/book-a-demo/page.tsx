import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Book a Demo | Free Home Demonstrations",
  description:
    "Book a free branch demo or mobile home demonstration. Mobile demos £99 — refunded for adaptations, deducted or free for Motability.",
  path: "/book-a-demo",
});

export default function BookADemoPage() {
  return (
    <>
      <Hero
        compact
        title="Book a free demonstration"
        subtitle="Try scooters, wheelchairs or adaptations at home or at our Heathrow and Ferndown branches."
        primaryHref="#form"
        primaryLabel="Start booking"
      />
      <section id="form" className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-extrabold">Demo options</h2>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">Branch demonstration:</strong>{" "}
                always free at Heathrow or Ferndown.
              </li>
              <li>
                <strong className="text-primary">Mobile home demonstration:</strong>{" "}
                £99 visit fee. Refunded when you proceed with vehicle adaptations;
                deducted from private scooter/wheelchair purchases; free for
                Motability scooter/wheelchair packages.
              </li>
              <li>
                We come to you so you can try equipment where you live, park and
                get around every day.
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm enquiryType="demo" title="Request your demonstration" />
          </div>
        </div>
      </section>
    </>
  );
}
