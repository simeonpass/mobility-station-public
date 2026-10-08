import type { ProductListItem } from "@/lib/products";

export const QUICK_VIEW_ATTR = "data-quick-view";

export function quickViewPayload(product: ProductListItem) {
  return JSON.stringify({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    manufacturer: product.manufacturer,
    image_url: product.image_url,
    unit_price: product.unit_price,
    sale_price: product.sale_price,
    motability_price: product.motability_price,
    motability_weekly_price: product.motability_weekly_price,
    condition: product.condition,
    product_type: product.product_type,
    quantity: product.quantity,
    track_stock: product.track_stock,
    pre_order_enabled: product.pre_order_enabled,
  } satisfies Partial<ProductListItem>);
}
