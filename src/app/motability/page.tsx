import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { getPublishedProducts, type ProductListItem } from "@/lib/products";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Motability Scooters & Wheelchairs",
  description:
    "Motability-accredited scooters and wheelchairs with weekly prices. Free home demonstrations from Heathrow & Ferndown.",
  path: "/motability",
});

function isMotabilityProduct(p: ProductListItem) {
  return (
    (p.motability_weekly_price != null && p.motability_weekly_price > 0) ||
    p.motability_price != null
  );
}

export default async function MotabilityPage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getPublishedProducts({ limit: 500, shopOnly: true });
    products = all
      .filter(isMotabilityProduct)
      .sort((a, b) => {
        const aw = a.motability_weekly_price ?? 999;
        const bw = b.motability_weekly_price ?? 999;
        return aw - bw;
      });
  } catch (error) {
    console.error("Motability catalogue error:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are you Motability accredited?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Mobility Station is Motability accredited and can guide you through scooter and wheelchair options.",
        },
      },
      {
        "@type": "Question",
        name: "Can I try Motability products at home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We offer free home demonstrations so you can try suitable scooters and wheelchairs where you live.",
        },
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
        title="Motability with Mobility Station"
        subtitle="Accredited advice for scooters and wheelchairs — with free home demonstrations from Heathrow and Ferndown."
      />
      <section className="pb-10">
        <div className="container-site max-w-3xl space-y-4 text-base leading-relaxed text-foreground/85">
          <p>
            If you receive a qualifying mobility allowance, Motability can help
            you exchange that allowance for a scooter or wheelchair package. As
            an accredited supplier, we explain the process in plain English and
            help you choose equipment that fits your lifestyle.
          </p>
          <p>
            Weekly prices below are taken from our live catalogue. Final
            eligibility and payments are confirmed during your assessment.
          </p>
          <p>
            Looking for vehicle adaptations on Motability?{" "}
            <Link
              href="/vehicle-adaptations"
              className="font-semibold text-primary underline"
            >
              Browse adaptations
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <h2 className="mb-6 text-2xl font-extrabold text-primary">
            Motability scooters &amp; wheelchairs
          </h2>
          {products.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-muted">
              Motability products will appear here when available. Call{" "}
              <a href="tel:08007723870" className="font-semibold text-primary">
                0800 772 3870
              </a>{" "}
              for advice.
            </p>
          )}
        </div>
      </section>
      <CtaFooter title="Book a Motability demonstration" />
    </>
  );
}
