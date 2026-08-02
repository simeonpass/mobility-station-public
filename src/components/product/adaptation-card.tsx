import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
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
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 ease-out group-hover:translate-y-0"
          aria-hidden
        >
          View product →
        </div>
        <div className="absolute left-3 top-3">
          <span className="rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Supplied &amp; fitted
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3.5">
        {product.category ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {product.category}
          </p>
        ) : null}
        {getBrandLogo(product.manufacturer) ? (
          <div className="mt-1">
            <BrandLogo manufacturer={product.manufacturer} height={20} />
          </div>
        ) : null}
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-snug text-primary">
          {product.name}
        </h3>
        {product.manufacturer && !getBrandLogo(product.manufacturer) ? (
          <p className="mt-1 text-xs text-muted">by {product.manufacturer}</p>
        ) : null}

        <div className="mt-3">
          {headline != null ? (
            <>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs text-muted">From</span>
                <span className="text-xl font-extrabold tabular-nums text-primary">
                  {formatGBP(headline)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {vat.mode === "relief"
                  ? "ex VAT · indicative fitted"
                  : vat.mode === "always-inc"
                    ? "inc. VAT · indicative fitted"
                    : "Indicative supplied & fitted"}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-primary">
              Contact for pricing
            </p>
          )}
          {hasMotability ? (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-medium text-primary">
              <span>
                {freeMotability
                  ? "Free on"
                  : `${formatGBP(product.motability_price)} on`}
              </span>
              <MotabilityLogo height={16} />
            </p>
          ) : null}
        </div>

        <span className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-dark">
          View details →
        </span>
      </div>
    </Link>
  );
}
