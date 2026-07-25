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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-white">
        <CatalogImage
          src={img}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Supplied &amp; fitted
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {getBrandLogo(product.manufacturer) ? (
          <div className="mb-2">
            <BrandLogo manufacturer={product.manufacturer} height={22} />
          </div>
        ) : null}
        {product.category ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-primary">
          {product.name}
        </h3>
        {product.manufacturer && !getBrandLogo(product.manufacturer) ? (
          <p className="mt-1 text-xs text-muted">by {product.manufacturer}</p>
        ) : null}

        <div className="mt-auto border-t border-border/70 pt-3">
          {headline != null ? (
            <>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                From
              </p>
              <p className="text-xl font-bold text-primary">
                {formatGBP(headline)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {vat.mode === "relief"
                  ? "ex VAT"
                  : vat.mode === "always-inc"
                    ? "inc. VAT"
                    : "Indicative supplied & fitted price"}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-primary">
              Contact for pricing
            </p>
          )}
          {hasMotability ? (
            <p className="mt-2.5 flex flex-wrap items-center gap-2 text-sm font-medium text-primary">
              <span>
                {freeMotability
                  ? "Free on"
                  : `${formatGBP(product.motability_price)} on`}
              </span>
              <MotabilityLogo height={18} />
            </p>
          ) : null}
          <span className="mt-3 inline-flex text-sm font-semibold text-primary group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
