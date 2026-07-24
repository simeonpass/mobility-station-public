import { ProductCard } from "@/components/ProductCard";
import { CtaFooter } from "@/components/sections/cta-footer";
import { Hero } from "@/components/sections/hero";
import { getPublishedProducts, type ProductListItem } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Clearance scooters & wheelchairs",
  description:
    "Ex-demo, refurbished and pre-owned mobility scooters and wheelchairs. Free home demonstrations from Heathrow & Ferndown.",
  path: "/clearance",
});

function isClearance(p: ProductListItem) {
  return (
    p.condition === "ex-demo" ||
    p.condition === "refurbished" ||
    p.condition === "pre-owned"
  );
}

export default async function ClearancePage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getPublishedProducts({ limit: 500, shopOnly: true });
    products = all.filter(isClearance);
  } catch (error) {
    console.error("Clearance catalogue error:", error);
  }

  return (
    <>
      <Hero
        compact
        title="Clearance & pre-owned"
        subtitle="Ex-demo, refurbished and pre-owned mobility products — checked by our team, with free home demonstrations available."
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <p className="mb-6 max-w-2xl text-sm text-muted">
            Clearance stock is graded and prepared before sale. Ask us about
            condition, warranty and Motability eligibility on the day of your
            demo.
          </p>
          {products.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-muted">
              No clearance items are listed right now. Check back soon or call
              0800 772 3870.
            </p>
          )}
        </div>
      </section>
      <CtaFooter title="Book a demo on a clearance model" />
    </>
  );
}
