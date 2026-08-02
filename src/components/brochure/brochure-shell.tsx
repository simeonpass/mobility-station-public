import Image from "next/image";
import Link from "next/link";
import { BrochurePrintButton } from "@/components/brochure/brochure-print-button";
import { CatalogImage } from "@/components/product/catalog-image";
import {
  formatGBP,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";
import { SITE } from "@/lib/seo";
import { getVatPriceDisplay } from "@/lib/vat";

export type BrochureGroup = {
  category: string;
  products: ProductListItem[];
};

export function BrochureShell({
  title,
  subtitle,
  generatedLabel,
  groups,
  mode,
}: {
  title: string;
  subtitle: string;
  generatedLabel: string;
  groups: BrochureGroup[];
  mode: "shop" | "adaptation";
}) {
  const total = groups.reduce((sum, g) => sum + g.products.length, 0);

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-gradient-to-b from-primary-soft/80 to-white no-print">
        <div className="container-site flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Product brochure
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-muted">{subtitle}</p>
            <p className="mt-2 text-sm text-muted">
              {total} products · {generatedLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BrochurePrintButton />
            <Link
              href={mode === "shop" ? "/shop" : "/vehicle-adaptations"}
              className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary hover:bg-primary-soft"
            >
              Back to catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Print-only header */}
      <div className="hidden print:block">
        <div className="flex items-start justify-between gap-6 border-b border-border pb-4">
          <div>
            <Image
              src="/brand/logo-header-v6.png"
              alt="Mobility Station"
              width={220}
              height={80}
              className="h-12 w-auto"
            />
            <h1 className="mt-3 text-2xl font-extrabold text-primary">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>
          <div className="text-right text-xs text-muted">
            <p className="font-semibold text-primary">{SITE.phone}</p>
            <p>{SITE.email}</p>
            <p className="mt-1">{SITE.url.replace(/^https?:\/\//, "")}</p>
            <p className="mt-2">{generatedLabel}</p>
            <p>{total} products</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Prices are indicative and may change. Adaptations are quoted against
          your vehicle. Motability figures subject to eligibility. Heathrow &amp;
          Ferndown.
        </p>
      </div>

      <div className="container-site py-8 print:max-w-none print:px-0 print:py-4 md:py-10">
        <p className="mb-8 text-sm text-muted no-print">
          Tip: use <strong className="font-semibold text-primary">Download / print PDF</strong>{" "}
          and choose “Save as PDF” in your print dialog. This list updates with
          the live catalogue.
        </p>

        {groups.length === 0 ? (
          <p className="rounded-xl bg-soft px-4 py-6 text-sm text-muted">
            No products are available for this brochure right now.
          </p>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <section
                key={group.category}
                className="break-inside-avoid-page"
              >
                <h2 className="border-b border-border pb-2 text-lg font-extrabold text-primary">
                  {group.category}
                  <span className="ml-2 text-sm font-semibold text-muted">
                    ({group.products.length})
                  </span>
                </h2>
                <ul className="mt-3 divide-y divide-border">
                  {group.products.map((product) => (
                    <BrochureProductRow
                      key={product.id}
                      product={product}
                      mode={mode}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <footer className="mt-12 border-t border-border pt-6 text-sm text-muted print:mt-8">
          <p>
            Mobility Station · Heathrow &amp; Ferndown · {SITE.phone} ·{" "}
            {SITE.email}
          </p>
          <p className="mt-1">
            Generated from the live website catalogue. Confirm prices and
            availability with us before ordering.
          </p>
        </footer>
      </div>
    </div>
  );
}

function BrochureProductRow({
  product,
  mode,
}: {
  product: ProductListItem;
  mode: "shop" | "adaptation";
}) {
  const img = primaryImage(product);
  const vat = getVatPriceDisplay(product);
  const price = vat.mode === "always-inc" ? vat.gross : vat.net;
  const hasMotabilityWeekly =
    product.motability_weekly_price != null &&
    product.motability_weekly_price > 0;
  const freeMotability = product.motability_price === 0;
  const motabilityContribution =
    product.motability_price != null && product.motability_price > 0
      ? product.motability_price
      : null;

  return (
    <li className="flex gap-3 py-3 break-inside-avoid">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-white print:h-12 print:w-12">
        <CatalogImage
          src={img}
          alt=""
          fill
          sizes="56px"
          className="object-contain p-1"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            {product.manufacturer ? (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {product.manufacturer}
              </p>
            ) : null}
            <p className="font-semibold leading-snug text-primary">
              <Link
                href={`/products/${product.slug}`}
                className="hover:underline print:no-underline print:pointer-events-none"
              >
                {product.name}
              </Link>
            </p>
          </div>
          <div className="shrink-0 text-right">
            {price != null ? (
              <p className="text-sm font-bold tabular-nums text-primary">
                {mode === "adaptation" ? "" : "From "}
                {formatGBP(price)}
                {vat.mode === "relief" ? (
                  <span className="ml-1 text-[10px] font-semibold text-muted">
                    ex VAT
                  </span>
                ) : null}
                {vat.mode === "no-vat" ? (
                  <span className="ml-1 text-[10px] font-semibold text-muted">
                    no VAT
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="text-sm font-bold text-primary">POA</p>
            )}
          </div>
        </div>
        {(hasMotabilityWeekly || freeMotability || motabilityContribution != null) ? (
          <p className="mt-0.5 text-xs text-muted">
            Motability:{" "}
            {hasMotabilityWeekly
              ? `${formatGBP(product.motability_weekly_price)}/week`
              : freeMotability
                ? mode === "adaptation"
                  ? "£0 advance payment"
                  : "£0 / week"
                : `${formatGBP(motabilityContribution)}${mode === "adaptation" ? " advance payment" : " contribution"}`}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function groupProductsByCategory(
  products: ProductListItem[],
): BrochureGroup[] {
  const map = new Map<string, ProductListItem[]>();
  for (const product of products) {
    const key = product.category?.trim() || "Other";
    const list = map.get(key) ?? [];
    list.push(product);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({
      category,
      products: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}
