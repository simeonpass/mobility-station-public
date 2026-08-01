import Link from "next/link";
import { BadgeCheck, CarFront, Wrench } from "lucide-react";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { createMetadata, jsonLdScript } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Motability vehicle adaptations",
  description:
    "Motability vehicle adaptations — hand controls, hoists, access and stowage. Quoted and fitted at Heathrow & Ferndown. Many £0 advance payment options.",
  path: "/motability/vehicle-adaptations",
});

const FAQS = [
  {
    q: "Can Motability cover vehicle adaptations?",
    a: "Yes. Many driving, access and stowage adaptations are available on the Motability Scheme, including £0 advance payment where you are eligible.",
  },
  {
    q: "Can I order an adaptation online?",
    a: "No. Every adaptation is checked against your vehicle first. We quote, then fit at Heathrow or Ferndown (or mobile where the product allows).",
  },
  {
    q: "How do I get started?",
    a: "Request a quotation or book a Motability adaptation demo. We’ll confirm compatibility, advance payment (if any), and a fitting plan.",
  },
] as const;

export default function MotabilityAdaptationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <section className="bg-hero-mesh">
        <div className="container-site grid items-center gap-10 py-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:py-16 lg:gap-14 lg:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold text-muted">
              <Link href="/motability" className="hover:text-primary hover:underline">
                Motability
              </Link>
              <span className="mx-2 text-border" aria-hidden>
                /
              </span>
              Vehicle adaptations
            </p>
            <MotabilityLogo height={36} className="mb-5" />
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Motability vehicle adaptations
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Hand controls, boot hoists, swivel seats, access and secondary
              controls — assessed, quoted and fitted by our Heathrow and
              Ferndown workshops.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote?interest=adaptation"
                className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
              >
                Get a Motability quotation
              </Link>
              <Link
                href="/book-a-demo?type=adaptation"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl",
                )}
              >
                Book an adaptation demo
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary/90">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-accent" aria-hidden />
                Accredited dealer
              </li>
              <li className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-accent" aria-hidden />
                Workshop fitted
              </li>
              <li className="flex items-center gap-2">
                <CarFront className="h-4 w-4 text-accent" aria-hidden />
                Many £0 advance options
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgb(0_63_67_/_0.06)] md:p-8">
            <h2 className="text-lg font-bold text-primary">
              How Motability adaptations work here
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                {
                  step: "1",
                  title: "Tell us about your vehicle",
                  body: "We check compatibility for your Motability car and the adaptation you need.",
                },
                {
                  step: "2",
                  title: "Firm quotation first",
                  body: "You’ll know the advance payment (if any) and fitting plan before any work is booked.",
                },
                {
                  step: "3",
                  title: "Fitted by our team",
                  body: "Fitting at Heathrow or Ferndown — or mobile where the product allows. We stand behind the work.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-primary">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted">
              Looking for a Motability{" "}
              <strong className="text-primary">scooter or wheelchair</strong>{" "}
              instead?{" "}
              <Link
                href="/motability/scooters-wheelchairs"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Scooters &amp; wheelchairs on Motability
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site max-w-3xl space-y-6">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Browse adaptations
          </h2>
          <p className="text-muted">
            See our full adaptations catalogue — including products often
            available at £0 advance payment on Motability (subject to
            eligibility).
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vehicle-adaptations#free-motability"
              className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
            >
              Free on Motability products
            </Link>
            <Link
              href="/vehicle-adaptations"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl",
              )}
            >
              All vehicle adaptations
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Adaptation Motability FAQs
          </h2>
          <dl className="mt-8 space-y-6">
            {FAQS.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-primary">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaFooter
        title="Get a Motability adaptation quotation"
        subtitle="We’ll confirm compatibility and any advance payment before fitting starts."
        primaryHref="/quote?interest=adaptation"
        primaryLabel="Get a quotation"
        secondaryHref="/book-a-demo?type=adaptation"
        secondaryLabel="Book a demo"
      />
    </>
  );
}
