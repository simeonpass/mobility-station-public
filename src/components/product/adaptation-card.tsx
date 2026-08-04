import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { FittingPartnerCorner } from "@/components/product/fitted-badge";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { getBrandLogo } from "@/lib/brand-logos";
import {
  formatGBP,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";
import { getVatPriceDisplay } from "@/lib/vat";

export function AdaptationCard({ product }: { product: ProductListItem }) {
  const vat = getVatPriceDisplay(product);
  const img = primaryImage(product);
  const freeMotability = product.motability_price === 0;
  const hasMotability =
    freeMotability ||
    (product.motability_price != null && product.motability_price > 0);
  const headline = vat.mode === "always-inc" ? vat.gross : vat.net;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[0_16px_40px_-24px_rgba(0,63,67,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <CatalogImage
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 ease-out group-hover:translate-y-0"
          aria-hidden
        >
          View product →
        </div>
        <FittingPartnerCorner size="card" />
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-5 pb-5 pt-5">
        <div className="space-y-2">
          {product.category ? (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {product.category}
            </p>
          ) : null}
          {getBrandLogo(product.manufacturer) ? (
            <BrandLogo manufacturer={product.manufacturer} height={24} />
          ) : product.manufacturer ? (
            <p className="text-xs font-medium text-muted">
              {product.manufacturer}
            </p>
          ) : null}
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-snug text-primary">
            {product.name}
          </h3>
        </div>

        <div className="space-y-3">
          {headline != null ? (
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs text-muted">From</span>
                <span className="text-xl font-extrabold tabular-nums text-primary">
                  {formatGBP(headline)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {vat.mode === "relief"
                  ? "ex VAT · supplied & fitted"
                  : vat.mode === "always-inc"
                    ? "inc. VAT · supplied & fitted"
                    : "Supplied & fitted"}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-primary">
              Contact for pricing
            </p>
          )}
          {hasMotability ? (
            <p className="flex flex-wrap items-center gap-2.5 text-sm font-medium text-primary">
              <span>
                {freeMotability
                  ? "Free on"
                  : `${formatGBP(product.motability_price)} on`}
              </span>
              <MotabilityLogo height={26} className="shrink-0" />
            </p>
          ) : null}
        </div>

        <span className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-dark">
          View details →
        </span>
      </div>
    </Link>
  );
}
