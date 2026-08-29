import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopBrowser } from "@/components/product/shop-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CatalogSearchStrip } from "@/components/sections/catalog-search-strip";
import { CtaFooter } from "@/components/sections/cta-footer";
import { ProductSpotlight } from "@/components/sections/product-spotlight";
import {
  getCategories,
  getFeaturedProducts,
  getPublishedProducts,
  getShopSpecialOffers,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Shop scooters, wheelchairs & more",
  description:
    "Browse mobility scooters, powered wheelchairs and more. Home and branch demonstrations from Heathrow and Ferndown.",
  path: "/shop",
});

type Props = {
  searchParams: Promise<{ sub?: string; q?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { sub, q } = await searchParams;
  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let specialOffers: Awaited<ReturnType<typeof getShopSpecialOffers>> = [];
  let popular: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let errorMessage: string | null = null;

  try {
    [products, categories, specialOffers, popular] = await Promise.all([
      getPublishedProducts({ limit: 500, shopOnly: true }),
      getCategories({ shopOnly: true }),
      getShopSpecialOffers(8),
      getFeaturedProducts(8),
    ]);
  } catch (error) {
    console.error("Shop catalog error:", error);
    errorMessage =
      "We could not load the product catalogue right now. Please try again shortly or request a callback.";
  }

  const popularProducts = popular.length > 0 ? popular : specialOffers.slice(0, 8);

  return (
    <>
      <CatalogIntro
        title="Mobility, chosen around you."
        subtitle="Explore scooters and wheelchairs from trusted manufacturers, with expert advice, VAT relief where eligible, and home or branch demonstrations from Heathrow and Ferndown."
        primary={{ href: "/book-a-demo", label: "Book a Demo" }}
        secondary={{
          href: "/contact?interest=callback#callback",
          label: "Help me choose",
        }}
      />

      <CatalogSearchStrip
        type="shop"
        title="Find the right model"
        subtitle="Search by model, brand or type. You can refine the full range further below."
      />

      {!errorMessage && popularProducts.length > 0 ? (
        <ProductSpotlight
          title="Popular scooters & wheelchairs"
          subtitle="A selection of popular models from our live range, available with specialist advice and support."
          viewAllHref="#catalogue"
          viewAllLabel="Browse all products"
        >
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductSpotlight>
      ) : null}

      <div id="catalogue" className="container-site scroll-under-header py-12 md:py-16">
        <div className="mb-7 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Full range</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary md:text-4xl">
            Browse all mobility products
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Filter by product type, manufacturer, Motability availability or clearance stock.
          </p>
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <Suspense fallback={<p className="text-sm text-muted">Loading products…</p>}>
            <ShopBrowser
              products={products}
              categories={categories}
              initialSub={sub === "scooters" || sub === "wheelchairs" ? sub : ""}
              initialQuery={typeof q === "string" ? q : ""}
            />
          </Suspense>
        )}
      </div>

      <CtaFooter
        title="Not sure which model is right?"
        subtitle="Talk to our team or arrange a demonstration and we’ll help narrow down the right options for you."
      />
    </>
  );
}
