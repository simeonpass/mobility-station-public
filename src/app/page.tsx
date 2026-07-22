import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { HomeHero } from "@/components/sections/home-hero";
import { SolutionsGrid } from "@/components/sections/solutions-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getReviews } from "@/lib/data";
import { getFeaturedProducts } from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Mobility Station | Free Home Demonstrations",
  description:
    "We come to you with scooters, wheelchairs and vehicle adaptations. Free home demos. Heathrow & Ferndown. Motability accredited.",
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 300;

export default async function HomePage() {
  const [branches, reviews] = await Promise.all([
    getBranches(),
    getReviews(),
  ]);

  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try {
    featured = await getFeaturedProducts(8);
  } catch (error) {
    console.error("Featured products error:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    areaServed: "GB",
    address: branches.map((b) => ({
      "@type": "PostalAddress",
      streetAddress: [b.addressLine1, b.addressLine2].filter(Boolean).join(", "),
      addressLocality: b.addressLocality,
      postalCode: b.postalCode,
      addressCountry: "GB",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <HomeHero />
      <TrustStrip />
      <SolutionsGrid />

      {featured.length > 0 ? (
        <section className="bg-soft py-16 md:py-20">
          <div className="container-site">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                Featured products
              </h2>
              <Link
                href="/shop"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <BranchMap branches={branches} />
      <Testimonials reviews={reviews} />
      <CtaFooter />
    </>
  );
}
