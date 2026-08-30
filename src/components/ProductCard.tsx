import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { ProductQuickView } from "@/components/product/product-quick-view";
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
    ? [conditionLabel(product.condition), grade ? `Grade ${grade.id}` : null]
        .filter(Boolean)
        .join(" · ")
    : null;
  const saveAmount =
    wasHeadline != null && headline != null && wasHeadline > headline
      ? wasHeadline - headline
      : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-white motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] max-md:active:scale-[0.985] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-black/15 [@media(hover:hover)]:hover:shadow-[0_22px_55px_-36px_rgba(0,0,0,0.38)]">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
            <CatalogImage
              src={img}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035]"
            />

            {used ? (
              <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Clearance
              </span>
            ) : saveAmount != null ? (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-black">
                Save {formatGBP(saveAmount)}
              </span>
            ) : wasHeadline ? (
              <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Sale
              </span>
            ) : null}

            {!stock.available ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-[1px]">
                <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-muted">
                  {stock.label}
                </span>
              </div>
            ) : null}
          </div>
        </Link>
        <ProductQuickView product={product} />
      </div>

      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <div>
            {product.category ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {product.category}
              </p>
            ) : getBrandLogo(product.manufacturer) ? (
              <BrandLogo manufacturer={product.manufacturer} height={22} />
            ) : product.manufacturer ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                {product.manufacturer}
              </p>
            ) : null}

            {clearanceMeta ? (
              <p className="mt-2 text-xs font-medium text-muted">{clearanceMeta}</p>
            ) : null}

            <h3 className="mt-2 line-clamp-2 min-h-[2.9rem] text-base font-bold leading-snug tracking-[-0.01em] text-primary sm:text-[17px]">
              {product.name}
            </h3>
          </div>

          <div className="mt-4 border-t border-border pt-3 sm:mt-5 sm:pt-4">
            {headline != null ? (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-xs text-muted">From</span>
                  <span className="text-2xl font-extrabold tracking-[-0.03em] tabular-nums text-primary">
                    {formatGBP(headline)}
                  </span>
                  {wasHeadline ? (
                    <span className="text-xs text-muted line-through">
                      RRP {formatGBP(wasHeadline)}
                    </span>
                  ) : null}
                </div>
                {vat.mode === "relief" ? (
                  <p className="mt-1 text-xs text-muted">with VAT relief · ex VAT</p>
                ) : vat.mode === "always-inc" ? (
                  <p className="mt-1 text-xs text-muted">including VAT</p>
                ) : vat.mode === "no-vat" ? (
                  <p className="mt-1 text-xs text-muted">No VAT</p>
                ) : null}
              </div>
            ) : (
              <span className="text-2xl font-extrabold text-primary">POA</span>
            )}

            {product.motability_weekly_price != null &&
            product.motability_weekly_price > 0 ? (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>or {formatGBP(product.motability_weekly_price)}/week on</span>
                <MotabilityLogo height={23} className="shrink-0" />
              </p>
            ) : product.motability_price === 0 ? (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>Free on</span>
                <MotabilityLogo height={23} className="shrink-0" />
              </p>
            ) : product.motability_price != null && product.motability_price > 0 ? (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{formatGBP(product.motability_price)} on</span>
                <MotabilityLogo height={23} className="shrink-0" />
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm font-bold text-primary sm:pt-5">
            <span>{stock.available ? stock.label : "View details"}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
