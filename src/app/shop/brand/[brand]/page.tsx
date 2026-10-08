import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import {
  getPublishedProducts,
  type ProductListItem,
} from "@/lib/products";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import {
  FEATURED_SHOP_BRANDS,
  manufacturerToSlug,
  resolveManufacturerFromSlug,
  shopBrandMatches,
  shopManufacturers,
} from "@/lib/shop-catalogue";
import { cn } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ brand: string }> };

async function loadBrand(brandSlug: string) {
  const catalogue = await getPublishedProducts({ limit: 500, shopOnly: true });
  const manufacturers = shopManufacturers(catalogue);
  const manufacturer = resolveManufacturerFromSlug(manufacturers, brandSlug);
  if (!manufacturer) return null;
  const root = manufacturerToSlug(manufacturer).split("-")[0];
  const family = manufacturers.filter(
    (name) => manufacturerToSlug(name).split("-")[0] === root,
  );
  const products = catalogue.filter((p) =>
    family.includes(p.manufacturer || ""),
  );
  return { manufacturer, products, manufacturers, family };
}

export async function generateMetadata({ params }: Props) {
  const { brand } = await params;
  try {
    const data = await loadBrand(brand);
    if (!data) {
      return createMetadata({
        title: "Brand not found",
        description: "This manufacturer could not be found in our shop.",
        path: `/shop/brand/${brand}`,
        noIndex: true,
      });
    }
    return createMetadata({
      title: `${data.manufacturer} scooters & wheelchairs`,
      description: `Browse ${data.manufacturer} mobility scooters and wheelchairs from Mobility Station. VAT relief, Motability options and demonstrations from Heathrow and Ferndown.`,
      path: `/shop/brand/${manufacturerToSlug(data.manufacturer)}`,
    });
  } catch {
    return createMetadata({
      title: "Shop by brand",
      description: "Browse mobility scooters and wheelchairs by manufacturer.",
      path: `/shop/brand/${brand}`,
    });
  }
}

export async function generateStaticParams() {
  try {
    const catalogue = await getPublishedProducts({ limit: 500, shopOnly: true });
    return shopManufacturers(catalogue)
      .filter((name) =>
        FEATURED_SHOP_BRANDS.some((brand) => shopBrandMatches(name, brand)),
      )
      .map((name) => ({ brand: manufacturerToSlug(name) }));
  } catch {
    return [];
  }
}

export default async function ShopBrandPage({ params }: Props) {
  const { brand } = await params;
  let data: {
    manufacturer: string;
    products: ProductListItem[];
    manufacturers: string[];
    family: string[];
  } | null = null;
  try {
    data = await loadBrand(brand);
  } catch (error) {
    console.error("Shop brand page error:", error);
  }
  if (!data) notFound();

  const related = data.manufacturers
    .filter((name) => name !== data.manufacturer)
    .filter((name) =>
      FEATURED_SHOP_BRANDS.some((brandName) => shopBrandMatches(name, brandName)),
    )
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.manufacturer} scooters & wheelchairs`,
    url: `${SITE.url}/shop/brand/${manufacturerToSlug(data.manufacturer)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.products.length,
      itemListElement: data.products.slice(0, 40).map((product, index) => ({
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
      <section className="ms-page-intro border-b border-border bg-gradient-to-b from-primary-soft/80 to-white">
        <div className="container-site py-10 md:py-14">
          <Link
            href="/shop"
            className="text-sm font-semibold text-muted hover:text-primary"
          >
            ← All scooters &amp; wheelchairs
          </Link>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                Shop by brand
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                {data.manufacturer}
              </h1>
              <p className="mt-3 text-base text-muted md:text-lg">
                Live {data.manufacturer} models
                {data.family.length > 1
                  ? ` across ${data.family.join(", ")}`
                  : ""}{" "}
                with VAT relief where eligible, Motability weekly figures where
                listed, and demonstrations from Heathrow and Ferndown.
              </p>
            </div>
            <Link
              href="/book-a-demo"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <div className="container-site py-8 md:py-12">
        <p className="mb-6 text-sm text-muted">
          <span className="font-semibold text-primary">
            {data.products.length}
          </span>{" "}
          product{data.products.length === 1 ? "" : "s"}
        </p>

        {data.products.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {data.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted">
            No published {data.manufacturer} products right now.{" "}
            <Link
              href="/contact?interest=callback#callback"
              className="font-semibold text-primary underline"
            >
              Request a callback
            </Link>{" "}
            and we’ll check current availability.
          </p>
        )}

        {related.length ? (
          <nav
            className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-sm text-muted"
            aria-label="Other brands"
          >
            {related.map((name) => (
              <Link
                key={name}
                href={`/shop/brand/${manufacturerToSlug(name)}`}
                className="hover:text-primary hover:underline"
              >
                {name}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <CtaFooter
        title={`Try a ${data.manufacturer} model`}
        subtitle="Book a free branch demonstration or a home demonstration and we’ll help you compare the right options."
      />
    </>
  );
}
