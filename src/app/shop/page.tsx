import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShopBrowser } from "@/components/product/shop-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import { ProductSpotlight } from "@/components/sections/product-spotlight";
import {
  getCategories,
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
  let errorMessage: string | null = null;

  try {
    [products, categories, specialOffers] = await Promise.all([
      getPublishedProducts({ limit: 500, shopOnly: true }),
      getCategories({ shopOnly: true }),
      getShopSpecialOffers(8),
    ]);
  } catch (error) {
    console.error("Shop catalog error:", error);
    errorMessage =
      "We could not load the product catalogue right now. Please try again shortly or request a callback.";
  }

  return (
    <>
      <CatalogIntro
        title="Scooters & Wheelchairs"
        subtitle="Browse our live catalogue, then book a home or branch demonstration from Heathrow or Ferndown."
        primary={{ href: "/book-a-demo", label: "Book a Demo" }}
        secondary={{
          href: "/contact?interest=callback#callback",
          label: "Help me choose",
        }}
      />

      <div className="border-b border-border bg-soft/50">
        <div className="container-site flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Prefer a printable list of the full catalogue?
          </p>
          <Link
            href="/brochure/scooters-wheelchairs"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Download scooters &amp; wheelchairs brochure →
          </Link>
        </div>
      </div>

      {!errorMessage && specialOffers.length > 0 ? (
        <ProductSpotlight
          title="Special offers"
          subtitle="Sale and featured scooters and wheelchairs from our live catalogue."
          viewAllHref="/clearance"
          viewAllLabel="View clearance"
        >
          {specialOffers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductSpotlight>
      ) : null}

      <div className="container-site py-8 md:py-12">
        {errorMessage ? (
          <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
            {errorMessage}
          </p>
        ) : (
          <Suspense
            fallback={<p className="text-sm text-muted">Loading products…</p>}
          >
            <ShopBrowser
              products={products}
              categories={categories}
              initialSub={
                sub === "scooters" || sub === "wheelchairs" ? sub : ""
              }
              initialQuery={typeof q === "string" ? q : ""}
            />
          </Suspense>
        )}
      </div>

      <CtaFooter
        title="Not sure which model is right?"
        subtitle="We’ll bring options to your home free of charge — or you can try them at Heathrow or Ferndown."
      />
    </>
  );
}
