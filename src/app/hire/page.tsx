import { HireFleet } from "@/components/hire/hire-fleet";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { getHireProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Mobility scooter hire",
  description:
    "Hire a mobility scooter online from Heathrow or Ferndown. Branch pickup, local delivery or nationwide courier. Pay securely with DNA Payments.",
  path: "/hire",
});

export default async function HirePage() {
  let products: Awaited<ReturnType<typeof getHireProducts>> = [];
  try {
    products = await getHireProducts();
  } catch (error) {
    console.error("Hire fleet error:", error);
  }

  return (
    <>
      <Hero
        compact
        title="Mobility scooter hire"
        subtitle="Reserve online, sign the hire agreement and pay securely. Branch pickup, local delivery or nationwide courier."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <p className="mb-8 max-w-2xl text-sm text-muted">
            Minimum notice is 7 days. A refundable deposit is taken with the hire
            charge. Photo ID and proof of address are required for branch and
            local delivery.
          </p>
          <HireFleet products={products} />
        </div>
      </section>
      <CtaFooter title="Prefer to talk it through?" />
    </>
  );
}
