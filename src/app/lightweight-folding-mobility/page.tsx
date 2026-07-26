import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { CtaFooter } from "@/components/sections/cta-footer";
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
        subtitle="Portable folding wheelchairs and scooters for travel, holidays and easy boot storage."
        primaryHref="/shop?sub=wheelchairs"
        primaryLabel="Browse folding wheelchairs"
        secondaryHref="/shop?sub=scooters"
        secondaryLabel="Browse folding scooters"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/85">
            When weight and foldability matter, the right lightweight model makes
            holidays, family visits and everyday journeys far easier. We can
            bring options to you so you can lift, fold and load them yourself
            before deciding.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-soft p-6">
            <h2 className="text-xl font-extrabold text-primary">
              Our dedicated lightweight store
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              For the widest ultra-lightweight range and a specialist checkout,
              visit lightweightmobility.co.uk.
            </p>
            <a
              href={SITE.lightweightUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ className: "mt-5" })}
            >
              Visit lightweightmobility.co.uk
            </a>
          </div>
          <p className="mt-6 text-sm text-muted">
            Not sure which is right?{" "}
            <Link
              href="/contact?interest=callback#callback"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Request a callback
            </Link>{" "}
            and we&apos;ll help you choose.
          </p>
        </div>
      </section>
      <CtaFooter
        title="Try a folding model at home"
        subtitle="We bring lightweight options to you so you can test the fold, weight and boot fit for yourself."
      />
    </>
  );
}
