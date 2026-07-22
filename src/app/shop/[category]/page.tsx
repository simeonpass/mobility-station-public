import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  categoryToSlug,
  getCategories,
  getPublishedProducts,
  resolveCategoryFromSlug,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { truncate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const { category: categorySlug } = await params;
  try {
    const category = await resolveCategoryFromSlug(categorySlug);
    if (!category) {
      return createMetadata({
        title: "Category not found",
        description: "This product category could not be found.",
        path: `/shop/${categorySlug}`,
      });
    }
    return createMetadata({
      title: truncate(category, 45),
      description: truncate(
        `Browse ${category} from Mobility Station. Free home demonstrations from Heathrow and Ferndown.`,
        160,
      ),
      path: `/shop/${categorySlug}`,
    });
  } catch {
    return createMetadata({
      title: "Shop",
      description: "Browse scooters and wheelchairs from Mobility Station.",
      path: `/shop/${categorySlug}`,
    });
  }
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ category: categoryToSlug(c.category) }));
  } catch {
    return [];
  }
}

export default async function ShopCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = await resolveCategoryFromSlug(categorySlug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getPublishedProducts({ category, limit: 60 }),
    getCategories(),
  ]);

  return (
    <main className="container-site py-12 md:py-16">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Mobility Station
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
          {category}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Free home demonstrations available from our Heathrow and Ferndown
          branches.
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Product categories">
        <Link
          href="/shop"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm text-primary hover:border-primary"
        >
          All
        </Link>
        {categories.slice(0, 12).map((c) => {
          const slug = categoryToSlug(c.category);
          const active = slug === categorySlug;
          return (
            <Link
              key={c.category}
              href={`/shop/${encodeURIComponent(slug)}`}
              className={
                active
                  ? "rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                  : "rounded-full border border-border bg-white px-4 py-2 text-sm text-primary hover:border-primary"
              }
            >
              {c.category} ({c.count})
            </Link>
          );
        })}
      </nav>

      {products.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No products in this category yet.</p>
      )}
    </main>
  );
}
