import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CtaFooter } from "@/components/sections/cta-footer";
import { buttonVariants } from "@/components/ui/button";
import { adaptationHref, isAdaptationCategory } from "@/lib/adaptations";
import {
  categoryToSlug,
  getCategories,
  getPublishedProducts,
  resolveCategoryFromSlug,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { cn, truncate } from "@/lib/utils";

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

  if (isAdaptationCategory(category)) {
    redirect(adaptationHref(category));
  }

  const [products, categories] = await Promise.all([
    getPublishedProducts({ category, limit: 60, shopOnly: true }),
    getCategories({ shopOnly: true }),
  ]);

  const related = categories
    .filter((c) => c.category !== category)
    .slice(0, 8);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-primary-soft/80 to-white">
        <div className="container-site py-10 md:py-14">
          <Link
            href="/shop"
            className="text-sm font-semibold text-muted hover:text-primary"
          >
            ← All scooters &amp; wheelchairs
          </Link>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                {category}
              </h1>
              <p className="mt-3 text-base text-muted md:text-lg">
                Free home demonstrations from Heathrow and Ferndown.
              </p>
            </div>
            <Link
              href="/book-a-demo"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <div className="container-site py-8 md:py-12">
        <p className="mb-6 text-sm text-muted">
          <span className="font-semibold text-primary">{products.length}</span>{" "}
          product{products.length === 1 ? "" : "s"}
        </p>

        {products.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No products in this category yet.</p>
        )}

        {related.length ? (
          <nav
            className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-sm text-muted"
            aria-label="Related categories"
          >
            {related.map((c) => (
              <Link
                key={c.category}
                href={`/shop/${categoryToSlug(c.category)}`}
                className="hover:text-primary hover:underline"
              >
                {c.category}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <CtaFooter />
    </>
  );
}
