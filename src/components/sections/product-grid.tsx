import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/lib/types";

export function ProductGrid({
  products,
  title = "Featured scooters & wheelchairs",
  subtitle = "Popular products we can demonstrate at your home.",
  showViewAll = true,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}) {
  return (
    <section className="bg-soft py-16 md:py-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-muted">{subtitle}</p>
          </div>
          {showViewAll ? (
            <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
              View all products
            </Link>
          ) : null}
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
