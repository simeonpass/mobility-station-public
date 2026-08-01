import Link from "next/link";
import { BadgeCheck, Home, Phone } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedProducts, type ProductListItem } from "@/lib/products";
import { createMetadata, jsonLdScript } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Motability scooters & wheelchairs",
  description:
    "Motability-accredited scooters and wheelchairs with weekly prices. Free home demonstrations from Heathrow & Ferndown.",
  path: "/motability/scooters-wheelchairs",
});

const WHEELCHAIR_CATS = new Set([
  "Manual Wheelchairs",
  "Powered Wheelchairs",
  "Folding Powered Wheelchairs",
  "Wheelchairs",
]);

function isMotabilityProduct(p: ProductListItem) {
  return (
    (p.motability_weekly_price != null && p.motability_weekly_price > 0) ||
    p.motability_price != null
  );
}

function isWheelchair(p: ProductListItem) {
  return WHEELCHAIR_CATS.has(p.category || "");
}

const FAQS = [
  {
    q: "Are you Motability accredited for scooters and wheelchairs?",
    a: "Yes. Mobility Station is a Motability Scheme accredited dealer. We guide you through scooter and wheelchair options in plain English.",
  },
  {
    q: "What do the weekly prices mean?",
    a: "Weekly figures shown are from our live catalogue. Final eligibility, allowance and payments are confirmed during your Motability assessment.",
  },
  {
    q: "Are Motability home demos free?",
    a: "Yes. Motability scooter and wheelchair home demonstrations are free across our Heathrow and Ferndown service area.",
  },
] as const;

export default async function MotabilityScootersPage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getPublishedProducts({ limit: 500, shopOnly: true });
    products = all
      .filter(isMotabilityProduct)
      .sort((a, b) => {
        const aw = a.motability_weekly_price ?? a.motability_price ?? 999;
        const bw = b.motability_weekly_price ?? b.motability_price ?? 999;
        return aw - bw;
      });
  } catch (error) {
    console.error("Motability catalogue error:", error);
  }

  const scooters = products.filter((p) => !isWheelchair(p));
  const wheelchairs = products.filter(isWheelchair);

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
              Scooters &amp; wheelchairs
            </p>
            <MotabilityLogo height={36} className="mb-5" />
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Motability scooters &amp; wheelchairs
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Accredited advice, live weekly prices and free Motability home
              demonstrations from Heathrow and Ferndown.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book-a-demo"
                className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
              >
                Book a free Motability demo
              </Link>
              <Link
                href="/contact?interest=motability#callback"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl",
                )}
              >
                Request a callback
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary/90">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-accent" aria-hidden />
                Accredited dealer
              </li>
              <li className="flex items-center gap-2">
                <Home className="h-4 w-4 text-accent" aria-hidden />
                Free Motability demos
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" aria-hidden />
                Heathrow &amp; Ferndown
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgb(0_63_67_/_0.06)] md:p-8">
            <h2 className="text-lg font-bold text-primary">
              How Motability scooters &amp; chairs work
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                {
                  step: "1",
                  title: "Check your allowance",
                  body: "If you receive a qualifying mobility allowance, you may be able to exchange it for a scooter or wheelchair package.",
                },
                {
                  step: "2",
                  title: "Try before you decide",
                  body: "Book a free Motability home demonstration and we’ll bring suitable models to you.",
                },
                {
                  step: "3",
                  title: "We handle the paperwork",
                  body: "As an accredited dealer we guide you through assessment, choice and ongoing support.",
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
              Need Motability{" "}
              <strong className="text-primary">vehicle adaptations</strong>{" "}
              instead?{" "}
              <Link
                href="/motability/vehicle-adaptations"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Adaptations on Motability
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site">
          {products.length ? (
            <>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                    Live Motability catalogue
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {products.length} products · sorted by weekly price
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scooters.length ? (
                    <a
                      href="#scooters"
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                    >
                      Scooters ({scooters.length})
                    </a>
                  ) : null}
                  {wheelchairs.length ? (
                    <a
                      href="#wheelchairs"
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                    >
                      Wheelchairs ({wheelchairs.length})
                    </a>
                  ) : null}
                </div>
              </div>

              {scooters.length ? (
                <div id="scooters" className="mb-14 scroll-mt-28">
                  <h3 className="mb-5 text-xl font-extrabold text-primary">
                    Scooters
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {scooters.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}

              {wheelchairs.length ? (
                <div id="wheelchairs" className="scroll-mt-28">
                  <h3 className="mb-5 text-xl font-extrabold text-primary">
                    Wheelchairs
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {wheelchairs.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
              Motability products will appear here when available.{" "}
              <Link
                href="/contact?interest=motability#callback"
                className="font-semibold text-primary underline"
              >
                Request a callback
              </Link>{" "}
              for advice.
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-soft py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
            Scooter &amp; wheelchair Motability FAQs
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
        title="Book a Motability demonstration"
        subtitle="Free Motability scooter and wheelchair home demos from Heathrow and Ferndown — no obligation."
      />
    </>
  );
}
