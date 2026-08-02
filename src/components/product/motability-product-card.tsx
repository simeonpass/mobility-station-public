"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/product/brand-logo";
import { CatalogImage } from "@/components/product/catalog-image";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { EnquiryDialog } from "@/components/forms/enquiry-dialog";
import { getBrandLogo } from "@/lib/brand-logos";
import {
  formatGBP,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";

/**
 * Motability catalogue card — weekly scheme figure only (no retail/sale price).
 * Purchase pricing is irrelevant for Motability customers exchanging allowance.
 */
export function MotabilityProductCard({
  product,
}: {
  product: ProductListItem;
}) {
  const img = primaryImage(product);
  const weekly =
    product.motability_weekly_price != null &&
    product.motability_weekly_price > 0
      ? product.motability_weekly_price
      : null;
  const freeOnScheme = product.motability_price === 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[0_16px_40px_-24px_rgba(0,63,67,0.45)]">
      <Link
        href={`/products/${product.slug}?from=motability`}
        className="group block flex-1"
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          <CatalogImage
            src={img}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 ease-out group-hover:translate-y-0"
            aria-hidden
          >
            View product →
          </div>
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded bg-white/95 px-2 py-1 shadow-sm">
              <MotabilityLogo height={16} />
            </span>
          </div>
        </div>
        <div className="p-4 pb-3">
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
          <h3 className="mt-1.5 min-h-[2.75rem] line-clamp-2 text-[15px] font-bold leading-snug text-primary">
            {product.name}
          </h3>

          <div className="mt-3">
            {weekly != null ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  From your allowance
                </p>
                <p className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold tabular-nums text-primary">
                    {formatGBP(weekly)}
                  </span>
                  <span className="text-sm font-semibold text-muted">
                    / week
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  Indicative weekly Motability figure — confirmed at assessment.
                </p>
              </>
            ) : freeOnScheme ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Motability
                </p>
                <p className="mt-0.5 text-2xl font-extrabold text-primary">
                  £0 / week
                </p>
                <p className="mt-1 text-xs text-muted">
                  £0 advance payment where eligible — subject to assessment.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Motability
                </p>
                <p className="mt-0.5 text-lg font-bold text-primary">
                  Weekly price on request
                </p>
                <p className="mt-1 text-xs text-muted">
                  Contact us for the weekly figure on this model.
                </p>
              </>
            )}
          </div>
        </div>
      </Link>

      <div className="border-t border-border px-4 py-3">
        <EnquiryDialog
          mode="callback"
          title="Contact us about this model"
          defaultTopic="Motability"
          productSlug={product.slug}
          productLabel={product.name}
          triggerClassName="block w-full rounded-full bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          Contact us about this model
        </EnquiryDialog>
      </div>
    </article>
  );
}
