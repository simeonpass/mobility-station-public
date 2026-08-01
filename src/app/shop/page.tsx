import { Suspense } from "react";
import Link from "next/link";
import { ShopBrowser } from "@/components/product/shop-browser";
import { getCategories, getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

const QUICK_LINKS = [
  { href: "/hire", label: "Hire & Flex Hire" },
  { href: "/motability/scooters-wheelchairs", label: "Motability" },
  { href: "/clearance", label: "Clearance & ex-demo" },
  { href: "/lightweight-folding-mobility", label: "Lightweight & folding" },
  { href: "/trade-in", label: "Old scooter takeaway" },
  { href: "/delivery", label: "Local delivery" },
];

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Shop scooters & wheelchairs — Greater London & the South",
  description:
    "Browse mobility scooters and powered wheelchairs for local delivery and home demos from Heathrow and Ferndown. Motability & private.",
  path: "/shop",
});

type Props = {
  searchParams: Promise<{ sub?: string; q?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { sub, q } = await searchParams;
  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let errorMessage: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getPublishedProducts({ limit: 500, shopOnly: true }),
      getCategories({ shopOnly: true }),
    ]);
  } catch (error) {
    console.error("Shop catalog error:", error);
    errorMessage =
      "We could not load the product catalogue right now. Please try again shortly or request a callback.";
  }

  return (
    <div className="container-site py-12 md:py-16">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Mobility Station
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
          Scooters &amp; Wheelchairs
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Filter by type, Motability or clearance — then book a free home
          demonstration from Heathrow or Ferndown.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Shop shortcuts">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

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
            initialSub={sub === "scooters" || sub === "wheelchairs" ? sub : ""}
            initialQuery={typeof q === "string" ? q : ""}
          />
        </Suspense>
      )}
    </div>
  );
}
