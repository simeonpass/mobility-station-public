import Link from "next/link";
import { CatalogImage } from "@/components/product/catalog-image";
import {
  conditionLabel,
  displayPrice,
  formatGBP,
  isUsedCondition,
  primaryImage,
  stockStatus,
  type ProductListItem,
} from "@/lib/products";

export function ProductCard({ product }: { product: ProductListItem }) {
  const price = displayPrice(product);
  const img = primaryImage(product);
  const used = isUsedCondition(product.condition);
  const stock = stockStatus(product);
  const hasMotability =
    (product.motability_weekly_price != null &&
      product.motability_weekly_price > 0) ||
    (product.motability_price != null && product.motability_price >= 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square bg-soft">
        <CatalogImage
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-4 transition-transform group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {used ? (
            <span className="rounded bg-error px-2 py-1 text-xs font-semibold text-white">
              Clearance
            </span>
          ) : null}
          {used ? (
            <span className="rounded bg-tertiary px-2 py-1 text-xs font-semibold text-foreground">
              {conditionLabel(product.condition)}
            </span>
          ) : null}
          {price.was ? (
            <span className="rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              Sale
            </span>
          ) : null}
          {hasMotability ? (
            <span className="rounded bg-tertiary px-2 py-1 text-xs font-semibold text-foreground">
              Motability
            </span>
          ) : null}
        </div>
        {!stock.available ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-soft px-3 py-1 text-sm font-medium text-muted">
              {stock.label}
            </span>
          </div>
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
          {price.current != null ? (
            <>
              <span className="text-xs text-muted">From</span>
              <span className="text-lg font-bold text-primary">
                {formatGBP(price.current)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">POA</span>
          )}
          {price.was ? (
            <span className="text-sm text-muted line-through">
              {formatGBP(price.was)}
            </span>
          ) : null}
        </div>
        {product.motability_weekly_price != null &&
        product.motability_weekly_price > 0 ? (
          <p className="mt-1 text-xs text-muted">
            or {formatGBP(product.motability_weekly_price)}/week on Motability
          </p>
        ) : product.motability_price === 0 ? (
          <p className="mt-1 text-xs text-muted">Free on Motability</p>
        ) : product.motability_price != null && product.motability_price > 0 ? (
          <p className="mt-1 text-xs text-muted">
            {formatGBP(product.motability_price)} on Motability
          </p>
        ) : null}
      </div>
    </Link>
  );
}
