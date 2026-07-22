import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categoryToSlug, getCategories, getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Shop scooters, wheelchairs & more",
  description:
    "Browse mobility scooters, powered wheelchairs and more. Free home demonstrations from Heathrow and Ferndown branches.",
  path: "/shop",
});

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let errorMessage: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getPublishedProducts({ limit: 60 }),
      getCategories(),
    ]);
  } catch (error) {
    console.error("Shop catalog error:", error);
    errorMessage =
      "We could not load the product catalogue right now. Please try again shortly or call 0800 772 3870.";
  }

  return (
    <main className="container-site py-12 md:py-16">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Mobility Station
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
          Scooters &amp; Wheelchairs
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Every product below is available for a free home demonstration from our
          Heathrow or Ferndown branches.
        </p>
      </header>

      {errorMessage ? (
        <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
          {errorMessage}
        </p>
      ) : (
        <>
          <nav className="mb-8 flex flex-wrap gap-2" aria-label="Product categories">
            <Link
              href="/shop"
              className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              All ({products.length}
              {products.length >= 60 ? "+" : ""})
            </Link>
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.category}
                href={`/shop/${encodeURIComponent(categoryToSlug(c.category))}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm text-primary hover:border-primary"
              >
                {c.category} ({c.count})
              </Link>
            ))}
          </nav>

          {products.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-muted">
              No published products found. Check Supabase RLS/GRANTs and that
              products have <code>published_to_website</code> and{" "}
              <code>website_visible</code> set.
            </p>
          )}
        </>
      )}
    </main>
  );
}
