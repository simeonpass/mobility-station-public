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
  retail_price: number | null;
  sale_price: number | null;
  motability_price: number | null;
  motability_weekly_price: number | null;
  is_featured: boolean;
  image_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  product_type: string | null;
};

export type ProductVariant = {
  id: string;
  variant_label: string | null;
  retail_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  colour: string | null;
  in_stock: boolean;
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
  pre_order_enabled: boolean;
  pre_order_message: string | null;
  video_url: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

const LIST_COLUMNS = `
  id, name, slug, category, manufacturer, retail_price, sale_price,
  motability_price, motability_weekly_price, is_featured, image_url,
  seo_title, meta_description, product_type
`;

export function categoryToSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategoryHint(slug: string) {
  return slug.replace(/-/g, " ");
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
    .not("slug", "is", null)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (opts.category) q = q.eq("category", opts.category);
  if (opts.limit) {
    q = q.range(opts.offset ?? 0, (opts.offset ?? 0) + opts.limit - 1);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ProductListItem[];
}

export async function getFeaturedProducts(limit = 8): Promise<ProductListItem[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select(LIST_COLUMNS)
    .eq("published_to_website", true)
    .eq("website_visible", true)
    .eq("is_featured", true)
    .not("slug", "is", null)
    .order("name", { ascending: true })
    .limit(limit);

  if (error) throw error;
  if (data?.length) return data as ProductListItem[];

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
      pre_order_enabled, pre_order_message, video_url
    `,
    )
    .eq("slug", slug)
    .eq("published_to_website", true)
    .eq("website_visible", true)
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
        "id, variant_label, retail_price, sale_price, image_url, colour, in_stock",
      )
      .eq("stock_item_id", productId),
  ]);

  return {
    ...(product as ProductListItem & ProductDetail),
    images: (imagesRes.data ?? []) as ProductImage[],
    variants: (variantsRes.data ?? []) as ProductVariant[],
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

export function displayPrice(
  p: Pick<ProductListItem, "retail_price" | "sale_price">,
) {
  if (p.sale_price && p.retail_price && p.sale_price < p.retail_price) {
    return { current: p.sale_price, was: p.retail_price };
  }
  return { current: p.retail_price ?? null, was: null };
}

export function formatGBP(n: number | null | undefined) {
  if (n == null) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}
