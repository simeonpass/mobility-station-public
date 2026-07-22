import Image from "next/image";
import Link from "next/link";
import {
  displayPrice,
  formatGBP,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";

export function ProductCard({ product }: { product: ProductListItem }) {
  const price = displayPrice(product);
  const img = primaryImage(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square bg-soft">
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-4 transition-transform group-hover:scale-[1.03]"
        />
        {product.motability_price != null ? (
          <span className="absolute left-3 top-3 rounded bg-tertiary px-2 py-1 text-xs font-semibold text-foreground">
            Motability
          </span>
        ) : null}
        {price.was ? (
          <span className="absolute right-3 top-3 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            Sale
          </span>
        ) : null}
      </div>
      <div className="p-4">
        {product.manufacturer ? (
          <p className="mb-1 text-xs uppercase tracking-wide text-muted">
            {product.manufacturer}
          </p>
        ) : null}
        <h3 className="min-h-[3rem] line-clamp-2 font-semibold leading-snug text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatGBP(price.current)}
          </span>
          {price.was ? (
            <span className="text-sm text-muted line-through">
              {formatGBP(price.was)}
            </span>
          ) : null}
        </div>
        {product.motability_weekly_price != null ? (
          <p className="mt-1 text-xs text-muted">
            or £{product.motability_weekly_price}/week on Motability
          </p>
        ) : null}
      </div>
    </Link>
  );
}
