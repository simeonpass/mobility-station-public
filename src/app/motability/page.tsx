import Link from "next/link";
import { Accessibility, ArrowRight, CarFront } from "lucide-react";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { CtaFooter } from "@/components/sections/cta-footer";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Motability — scooters, wheelchairs & vehicle adaptations",
  description:
    "Motability-accredited dealer for scooters, wheelchairs and vehicle adaptations. Choose your path — Heathrow & Ferndown.",
  path: "/motability",
});

const DOORS = [
  {
    href: "/motability/vehicle-adaptations",
    icon: CarFront,
    title: "Motability vehicle adaptations",
    description:
      "Hand controls, hoists, access and stowage — quoted and fitted for your Motability car.",
    cta: "Adaptations on Motability",
    note: "Quotation & workshop fitting",
  },
  {
    href: "/motability/scooters-wheelchairs",
    icon: Accessibility,
    title: "Motability scooters & wheelchairs",
    description:
      "Live weekly prices, free Motability home demos, and accredited advice.",
    cta: "Scooters & wheelchairs",
    note: "Browse catalogue · Free demos",
  },
] as const;

export default function MotabilityHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Motability at Mobility Station",
    description:
      "Motability-accredited dealer for scooters, wheelchairs and vehicle adaptations. Choose your path — Heathrow & Ferndown.",
    url: `${SITE.url}/motability`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <section className="bg-hero-mesh">
        <div className="container-site max-w-3xl py-14 md:py-20">
          <MotabilityLogo height={36} className="mb-5" />
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Motability — what do you need?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            We&apos;re a Motability Scheme accredited dealer for both vehicle
            adaptations and scooters &amp; wheelchairs. Choose the path that
            matches your allowance and what you need help with.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <ul className="grid gap-8 md:grid-cols-2 md:gap-12">
            {DOORS.map((door) => {
              const Icon = door.icon;
              return (
                <li key={door.href}>
                  <Link
                    href={door.href}
                    className="group block border-t-2 border-primary pt-6 transition-colors hover:border-accent"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-dark md:text-3xl">
                        {door.title}
                      </span>
                    </span>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
                      {door.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-primary/70">
                      {door.note}
                    </p>
                    <span
                      className={cn(
                        "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 group-hover:underline",
                      )}
                    >
                      {door.cta}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-12 max-w-2xl text-sm text-muted">
            Not sure which applies to you?{" "}
            <Link
              href="/contact?interest=motability#callback"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Request a callback
            </Link>{" "}
            — we&apos;ll point you to the right Motability journey from Heathrow
            or Ferndown.
          </p>
        </div>
      </section>

      <CtaFooter
        title="Talk to our Motability team"
        subtitle="Same accredited workshops — clearer paths for car adaptations vs scooters and wheelchairs."
      />
    </>
  );
}
