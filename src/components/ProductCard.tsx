import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import {
  conditionGradeMeta,
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
  const grade = conditionGradeMeta(product.condition_grade);
  const stock = stockStatus(product);

  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;
  const wasHeadline = vat.mode === "always-inc" ? vat.wasGross : vat.wasNet;

  const clearanceMeta = used
    ? [
        conditionLabel(product.condition),
        grade ? `Grade ${grade.id}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  const saveAmount =
    wasHeadline != null && headline != null && wasHeadline > headline
      ? wasHeadline - headline
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[0_16px_40px_-24px_rgba(0,63,67,0.45)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <CatalogImage
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {/* Hover slide-up — Lovable-style */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 ease-out group-hover:translate-y-0"
          aria-hidden
        >
          View product →
        </div>

        {used ? (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-error px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Clearance
          </span>
        ) : saveAmount != null ? (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-error px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Save {formatGBP(saveAmount)}
          </span>
        ) : wasHeadline ? (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Sale
          </span>
        ) : null}

        {!stock.available ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-soft px-3 py-1 text-sm font-medium text-muted">
              {stock.label}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3.5">
        {product.category ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {product.category}
          </p>
        ) : getBrandLogo(product.manufacturer) ? (
          <div className="mb-1">
            <BrandLogo manufacturer={product.manufacturer} height={20} />
          </div>
        ) : product.manufacturer ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {product.manufacturer}
          </p>
        ) : null}

        {clearanceMeta ? (
          <p className="mt-1 text-xs font-medium text-muted">{clearanceMeta}</p>
        ) : null}

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-snug text-primary">
          {product.name}
        </h3>

        <div className="mt-3">
          {headline != null ? (
            <>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs text-muted">From</span>
                <span className="text-xl font-extrabold tabular-nums text-primary">
                  {formatGBP(headline)}
                </span>
                {wasHeadline ? (
                  <span className="text-sm text-muted line-through">
                    RRP {formatGBP(wasHeadline)}
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
            <span className="text-xl font-extrabold text-primary">POA</span>
          )}
        </div>

        {product.motability_weekly_price != null &&
        product.motability_weekly_price > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>or {formatGBP(product.motability_weekly_price)}/week on</span>
            <MotabilityLogo height={16} />
          </p>
        ) : product.motability_price === 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>Free on</span>
            <MotabilityLogo height={16} />
          </p>
        ) : product.motability_price != null && product.motability_price > 0 ? (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>{formatGBP(product.motability_price)} on</span>
            <MotabilityLogo height={16} />
          </p>
        ) : null}

        <span className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-dark">
          View &amp; Buy →
        </span>
      </div>
    </Link>
  );
}
