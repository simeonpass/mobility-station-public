import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import {
  conditionGradeLabel,
  conditionLabel,
  formatGBP,
  isUsedCondition,
  primaryImage,
  stockStatus,
  type ProductListItem,
} from "@/lib/products";
import { getBrandLogo } from "@/lib/brand-logos";
import { getVatPriceDisplay } from "@/lib/vat";

export function ProductCard({ product }: { product: ProductListItem }) {
  const vat = getVatPriceDisplay(product);
  const img = primaryImage(product);
  const used = isUsedCondition(product.condition);
  const gradeLabel = conditionGradeLabel(product.condition_grade);
  const stock = stockStatus(product);

  const headline =
    vat.mode === "always-inc" ? vat.gross : vat.net;
  const wasHeadline =
    vat.mode === "always-inc" ? vat.wasGross : vat.wasNet;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square border-b border-border bg-white">
        <CatalogImage
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-2 transition-transform group-hover:scale-[1.03]"
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
          {gradeLabel ? (
            <span className="rounded bg-white/95 px-2 py-1 text-xs font-semibold text-primary shadow-sm ring-1 ring-border">
              {gradeLabel}
            </span>
          ) : null}
          {wasHeadline ? (
            <span className="rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              Sale
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
        {getBrandLogo(product.manufacturer) ? (
          <div className="mb-2">
            <BrandLogo manufacturer={product.manufacturer} height={22} />
          </div>
        ) : product.manufacturer ? (
          <p className="mb-1 text-xs uppercase tracking-wide text-muted">
            {product.manufacturer}
          </p>
        ) : null}
        <h3 className="min-h-[3rem] line-clamp-2 font-semibold leading-snug text-primary">
          {product.name}
        </h3>
        <div className="mt-3">
          {headline != null ? (
            <>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs text-muted">From</span>
                <span className="text-lg font-bold text-primary">
                  {formatGBP(headline)}
                </span>
                {wasHeadline ? (
                  <span className="text-sm text-muted line-through">
                    {formatGBP(wasHeadline)}
                  </span>
                ) : null}
              </div>
              {vat.mode === "relief" ? (
                <p className="mt-0.5 text-xs text-muted">ex VAT</p>
              ) : null}
              {vat.mode === "always-inc" ? (
                <p className="mt-0.5 text-xs text-muted">inc. VAT</p>
              ) : null}
              {vat.mode === "no-vat" ? (
                <p className="mt-0.5 text-xs text-muted">No VAT</p>
              ) : null}
            </>
          ) : (
            <span className="text-lg font-bold text-primary">POA</span>
          )}
        </div>
        {product.motability_weekly_price != null &&
        product.motability_weekly_price > 0 ? (
          <p className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>or {formatGBP(product.motability_weekly_price)}/week on</span>
            <MotabilityLogo height={18} />
          </p>
        ) : product.motability_price === 0 ? (
          <p className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>Free on</span>
            <MotabilityLogo height={18} />
          </p>
        ) : product.motability_price != null && product.motability_price > 0 ? (
          <p className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>{formatGBP(product.motability_price)} on</span>
            <MotabilityLogo height={18} />
          </p>
        ) : null}
      </div>
    </Link>
  );
}
