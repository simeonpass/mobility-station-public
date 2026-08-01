import { formatGBP, type ProductListItem } from "@/lib/products";
import { isAdaptationProduct } from "@/lib/adaptations";

/** Canonical URL for a product-linked quotation request. */
export function quoteHref(opts: {
  productSlug?: string | null;
  category?: string | null;
  interest?: string | null;
}): string {
  const params = new URLSearchParams();
  if (opts.productSlug) params.set("product", opts.productSlug);
  if (opts.category) params.set("category", opts.category);
  if (opts.interest) params.set("interest", opts.interest);
  const qs = params.toString();
  return qs ? `/quote?${qs}` : "/quote";
}

export function interestForProduct(product: Pick<ProductListItem, "name" | "category">) {
  const isAdaptation = isAdaptationProduct(product);
  if (isAdaptation) {
    return `Quotation: ${product.name}${product.category ? ` (${product.category})` : ""}`;
  }
  return `Quote: ${product.name}`;
}

export function interestForCategory(category: string) {
  return `Vehicle adaptation quotation — ${category}`;
}

export function quoteSummaryLine(product: ProductListItem): string | null {
  const price = product.sale_price ?? product.unit_price;
  if (price == null) return null;
  const isAdaptation = isAdaptationProduct(product);
  return isAdaptation
    ? `From ${formatGBP(price)} indicative supplied & fitted`
    : `From ${formatGBP(price)}`;
}
