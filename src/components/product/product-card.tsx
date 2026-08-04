import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { productPath } from "@/lib/data";
import type { Product } from "@/lib/types";
import { formatPrice, truncate } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={productPath(product)} className="relative aspect-[4/3] overflow-hidden bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element -- catalogue card; skip Vercel Image Optimization */}
        <img
          src={product.image}
          alt={`${product.name} mobility product`}
          className="absolute inset-0 h-full w-full object-contain p-1.5 scale-[1.12] transition-transform duration-300 group-hover:scale-[1.16]"
          loading="lazy"
          decoding="async"
        />
        {product.motability ? (
          <Badge className="absolute left-3 top-3">Motability</Badge>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {product.brand}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug">
          <Link href={productPath(product)} className="hover:text-primary-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{truncate(product.excerpt, 110)}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-base font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs font-medium text-muted">
            {product.inStock ? "In stock" : "Made to order"}
          </p>
        </div>
      </div>
    </article>
  );
}
