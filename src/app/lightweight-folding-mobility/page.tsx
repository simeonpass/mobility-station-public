import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Hero } from "@/components/sections/hero";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Lightweight Folding Mobility",
  description:
    "Lightweight folding wheelchairs and scooters from Mobility Station, plus our dedicated store at lightweightmobility.co.uk.",
  path: "/lightweight-folding-mobility",
});

export default function LightweightPage() {
  return (
    <>
      <Hero
        compact
        title="Lightweight folding mobility"
        subtitle="Portable folding wheelchairs and scooters for travel, holidays and easy boot storage — with free home demonstrations."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Travel-ready independence</h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              When weight and foldability matter, the right lightweight solution
              can make holidays, family visits and everyday journeys far easier.
              We help you compare folding wheelchairs and scooters at home, then
              point you to the best fit.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className={buttonVariants()}>
                Browse our shop
              </Link>
              <a
                href={SITE.lightweightUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                Visit our dedicated lightweight store
              </a>
            </div>
            <p className="mt-6 text-sm text-muted">
              For the widest ultra-lightweight range and specialist checkout,
              visit{" "}
              <a
                href={SITE.lightweightUrl}
                className="font-semibold text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                lightweightmobility.co.uk
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="demo"
              title="Ask about lightweight options"
              defaultInterest="Lightweight folding mobility"
            />
          </div>
        </div>
      </section>
    </>
  );
}
