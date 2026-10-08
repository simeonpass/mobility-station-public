import { EditorialImage } from "@/components/autoros/editorial-image";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopBrowser } from "@/components/product/shop-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { ProductSpotlight } from "@/components/sections/product-spotlight";
import {
  getCategories,
  getFeaturedProducts,
  getPublishedProducts,
  getShopSpecialOffers,
} from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import {
  FEATURED_SHOP_BRANDS,
  SHOP_PAGE_SIZE,
  filterShopProducts,
  manufacturerToSlug,
  parseShopFilters,
  shopBrandMatches,
  shopManufacturers,
  shopSeoFromFilters,
} from "@/lib/shop-catalogue";

export const revalidate = 300;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const filters = parseShopFilters(await searchParams);
  const seo = shopSeoFromFilters(filters);
  return createMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    noIndex: seo.noIndex,
  });
}

function ShopVisual() {
  return <EditorialImage src="/images/autoros/ms-scooter.webp" alt="A Mobility Station specialist showing a customer a mobility scooter" caption="Try before you decide." />;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseShopFilters(params);
  let catalogue: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let specialOffers: Awaited<ReturnType<typeof getShopSpecialOffers>> = [];
  let popular: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let errorMessage: string | null = null;

  try {
    [catalogue, categories, specialOffers, popular] = await Promise.all([
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

  const filtered = filterShopProducts(catalogue, filters);
  const page = filtered.slice(0, filters.page * SHOP_PAGE_SIZE);
  const manufacturers = shopManufacturers(catalogue);
  const popularProducts = popular.length > 0 ? popular : specialOffers.slice(0, 8);
  const brandLinks = FEATURED_SHOP_BRANDS.map((brand) => {
    const match = manufacturers.find((name) => shopBrandMatches(name, brand));
    return match ? { brand, href: `/shop/brand/${manufacturerToSlug(match)}` } : null;
  }).filter((item): item is { brand: string; href: string } => Boolean(item));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Scooters & wheelchairs",
    url: `${SITE.url}/shop`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filtered.length,
      itemListElement: page.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE.url}/products/${product.slug}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <div className="ms-shop-intro">
      <CatalogIntro
        eyebrow="Mobility Station · Scooters & wheelchairs"
        title="Mobility, chosen around you."
        subtitle="Explore scooters and wheelchairs from trusted manufacturers, with expert advice, VAT relief where eligible, and demonstrations from Heathrow and Ferndown."
        primary={{ href: "#catalogue", label: "Browse products" }}
        secondary={{
          href: "/contact?interest=callback#callback",
          label: "Help me choose",
        }}
        visual={<ShopVisual />}
      />
      </div>
      {!errorMessage && popularProducts.length > 0 ? (
        <div className="hidden md:block">
        <ProductSpotlight
          title="Popular scooters & wheelchairs"
          subtitle="A mix of the models customers ask for most — Pride, TGA, Kymco, Drive and more — with specialist advice and support."
          viewAllHref="#catalogue"
          viewAllLabel="Browse all products"
        >
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductSpotlight>
        </div>
      ) : null}
      <div
        id="catalogue"
        className="container-site scroll-under-header py-12 md:py-16"
      >
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Full range
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary md:text-4xl">
            Browse all mobility products
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Filter by product type, manufacturer, Motability availability or
            clearance stock.
          </p>
          {brandLinks.length ? (
            <nav
              className="mt-5 flex flex-wrap gap-2"
              aria-label="Popular brands"
            >
              {brandLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-primary hover:border-primary"
                >
                  {item.brand}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-5 py-4 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <Suspense
            fallback={<p className="text-sm text-muted">Loading products…</p>}
          >
            <ShopBrowser
              visibleCount={page.length}
              totalCount={filtered.length}
              catalogueSize={catalogue.length}
              categories={categories}
              manufacturers={manufacturers}
              filters={filters}
            >
              {page.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ShopBrowser>
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
