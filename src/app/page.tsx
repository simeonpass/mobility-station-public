import { BranchMap } from "@/components/sections/branch-map";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { SolutionsGrid } from "@/components/sections/solutions-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { getBranches, getProducts, getReviews } from "@/lib/data";
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
  const [products, branches, reviews] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
    getBranches(),
    getReviews(),
  ]);

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
      <Hero
        title="We come to you with mobility solutions that fit real life"
        subtitle="Free home demonstrations for scooters, wheelchairs and vehicle adaptations from our Heathrow and Ferndown branches. Motability accredited."
      />
      <TrustStrip />
      <SolutionsGrid />
      <ProductGrid products={products} />
      <BranchMap branches={branches} />
      <Testimonials reviews={reviews} />
      <CtaFooter />
    </>
  );
}
