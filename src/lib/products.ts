import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLIC_SITE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLIC_SITE_KEY in environment",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export type ProductImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  manufacturer: string | null;
  unit_price: number | null;
  sale_price: number | null;
  motability_price: number | null;
  motability_weekly_price: number | null;
  is_featured: boolean;
  image_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  product_type: string | null;
  quantity: number | null;
  track_stock: boolean;
  condition: "new" | "ex-demo" | "refurbished" | "pre-owned" | null;
  condition_grade: "A" | "B" | "C" | null;
  pre_order_enabled: boolean;
};

export type ProductVariant = {
  id: string;
  label: string | null;
  unit_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  colour: string | null;
  quantity: number;
  track_stock: boolean;
  is_addon: boolean;
};

export type ProductDetail = ProductListItem & {
  description: string | null;
  features: string[] | null;
  specifications: Record<string, unknown> | null;
  suitability_info: string | null;
  weight: number | null;
  dimensions: string | null;
  colour_options: string[] | null;
  delivery_estimate: string | null;
  pre_order_message: string | null;
  video_url: string | null;
  sku: string | null;
  location: string | null;
  is_discontinued: boolean;
  discontinued_message: string | null;
  adaptation_id: string | null;
  variant_group_id: string | null;
  variant_label: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

const LIST_COLUMNS = `
  id, name, slug, category, manufacturer, unit_price, sale_price,
  motability_price, motability_weekly_price, is_featured, image_url,
  seo_title, meta_description, product_type, quantity, track_stock,
  condition, condition_grade, pre_order_enabled
`;

export function categoryToSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategoryHint(slug: string) {
  return slug.replace(/-/g, " ");
}

function mapListItem(row: Record<string, unknown>): ProductListItem {
  return {
    ...(row as unknown as ProductListItem),
    track_stock: row.track_stock !== false,
    pre_order_enabled: Boolean(row.pre_order_enabled),
  };
}

export async function getPublishedProducts(
  opts: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {},
): Promise<ProductListItem[]> {
  const supabase = getClient();
  let q = supabase
    .from("stock_items")
    .select(LIST_COLUMNS)
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .neq("product_type", "archived")
    .not("slug", "is", null)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (opts.category) q = q.eq("category", opts.category);
  if (opts.limit) {
    q = q.range(opts.offset ?? 0, (opts.offset ?? 0) + opts.limit - 1);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((row) => mapListItem(row as Record<string, unknown>));
}

export async function getFeaturedProducts(limit = 8): Promise<ProductListItem[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select(LIST_COLUMNS)
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .eq("is_featured", true)
    .neq("product_type", "archived")
    .not("slug", "is", null)
    .order("name", { ascending: true })
    .limit(limit);

  if (error) throw error;
  if (data?.length) {
    return data.map((row) => mapListItem(row as Record<string, unknown>));
  }

  // Fallback when nothing is flagged featured yet
  return getPublishedProducts({ limit });
}

export async function getCategories(): Promise<
  { category: string; count: number }[]
> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("category")
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .neq("product_type", "archived")
    .not("category", "is", null);

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const c = (row as { category: string }).category;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function resolveCategoryFromSlug(
  categorySlug: string,
): Promise<string | null> {
  const categories = await getCategories();
  const match = categories.find(
    (c) => categoryToSlug(c.category) === categorySlug,
  );
  return match?.category ?? null;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const supabase = getClient();
  const { data: product, error } = await supabase
    .from("stock_items")
    .select(
      `
      ${LIST_COLUMNS},
      description, features, specifications, suitability_info,
      weight, dimensions, colour_options, delivery_estimate,
      pre_order_message, video_url, sku, location,
      is_discontinued, discontinued_message, adaptation_id,
      variant_group_id, variant_label
    `,
    )
    .eq("slug", slug)
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .neq("product_type", "archived")
    .maybeSingle();

  if (error) throw error;
  if (!product) return null;

  const productId = (product as { id: string }).id;

  const [imagesRes, variantsRes] = await Promise.all([
    supabase
      .from("stock_item_images")
      .select("id, image_url, alt_text, sort_order, is_primary")
      .eq("stock_item_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_variants")
      .select(
        "id, label, unit_price, sale_price, image_url, colour, quantity, track_stock, is_addon",
      )
      .eq("stock_item_id", productId)
      .order("sort_order", { ascending: true }),
  ]);

  const mapped = mapListItem(product as Record<string, unknown>);

  return {
    ...mapped,
    ...(product as ProductDetail),
    track_stock: mapped.track_stock,
    pre_order_enabled: mapped.pre_order_enabled,
    is_discontinued: Boolean(
      (product as { is_discontinued?: boolean }).is_discontinued,
    ),
    images: (imagesRes.data ?? []) as ProductImage[],
    variants: ((variantsRes.data ?? []) as ProductVariant[]).map((v) => ({
      ...v,
      track_stock: v.track_stock !== false,
      is_addon: Boolean(v.is_addon),
      quantity: v.quantity ?? 0,
    })),
  };
}

export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("slug, updated_at")
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .neq("product_type", "archived")
    .not("slug", "is", null);

  if (error) throw error;
  return (data ?? []) as { slug: string; updated_at: string }[];
}

export function primaryImage(p: {
  images?: ProductImage[];
  image_url: string | null;
}): string {
  const primary = p.images?.find((i) => i.is_primary) ?? p.images?.[0];
  return primary?.image_url ?? p.image_url ?? "/placeholder-product.svg";
}

/** Match Lovable: sale price when discounted, otherwise unit_price. */
export function displayPrice(
  p: Pick<ProductListItem, "unit_price" | "sale_price">,
) {
  const unit =
    p.unit_price != null && Number(p.unit_price) > 0
      ? Number(p.unit_price)
      : null;
  const sale =
    p.sale_price != null && Number(p.sale_price) > 0
      ? Number(p.sale_price)
      : null;

  if (sale != null && unit != null && sale < unit) {
    return { current: sale, was: unit };
  }
  if (sale != null && unit == null) {
    return { current: sale, was: null };
  }
  return { current: unit, was: null };
}

export function formatGBP(n: number | null | undefined) {
  if (n == null) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatWeeklyGBP(n: number | null | undefined) {
  if (n == null) return null;
  return formatGBP(n);
}

export function isUsedCondition(
  condition: ProductListItem["condition"] | null | undefined,
) {
  return (
    condition === "ex-demo" ||
    condition === "refurbished" ||
    condition === "pre-owned"
  );
}

export function conditionLabel(
  condition: ProductListItem["condition"] | null | undefined,
) {
  if (condition === "ex-demo") return "Ex-Demo";
  if (condition === "refurbished") return "Refurbished";
  if (condition === "pre-owned") return "Pre-Owned";
  return "New";
}

export function stockStatus(p: {
  track_stock: boolean;
  quantity: number | null;
  pre_order_enabled: boolean;
  is_discontinued?: boolean;
}) {
  if (p.is_discontinued) {
    return { label: "Discontinued", available: false } as const;
  }
  if (!p.track_stock) {
    return { label: "Available to order", available: true } as const;
  }
  const qty = p.quantity ?? 0;
  if (qty > 0) {
    return {
      label: qty <= 5 ? `Only ${qty} left` : "In stock",
      available: true,
    } as const;
  }
  if (p.pre_order_enabled) {
    return { label: "Pre-order", available: true } as const;
  }
  return { label: "Out of stock", available: false } as const;
}
