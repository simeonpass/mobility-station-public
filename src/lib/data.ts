import {
  ADAPTATION_SERVICES,
  BLOG_POSTS,
  BRANCHES,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  REVIEWS,
} from "@/data/content";
import { getSupabase, hasSupabase } from "@/lib/supabase";
import type { BlogPost, Branch, Product, Review } from "@/lib/types";

export const revalidateSeconds = 300;

function mapProduct(row: Record<string, unknown>): Product {
  const images = Array.isArray(row.images)
    ? (row.images as string[])
    : row.image_url
      ? [String(row.image_url)]
      : ["/images/products/placeholder-scooter.svg"];

  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name ?? row.title),
    categorySlug: String(row.category_slug ?? "mobility-scooters"),
    categoryName: String(row.category_name ?? "Mobility Scooters"),
    brand: String(row.brand ?? "Mobility Station"),
    price: row.price == null ? null : Number(row.price),
    excerpt: String(row.excerpt ?? row.short_description ?? ""),
    description: String(row.description ?? ""),
    seoCopy: row.seo_copy ? String(row.seo_copy) : undefined,
    image: images[0],
    images,
    inStock: Boolean(row.in_stock ?? true),
    featured: Boolean(row.featured ?? false),
    motability: Boolean(row.motability ?? false),
    weightKg: row.weight_kg == null ? undefined : Number(row.weight_kg),
    productCode: row.product_code ? String(row.product_code) : undefined,
    features: Array.isArray(row.features)
      ? (row.features as string[]).slice(0, 10)
      : [],
    specifications: Array.isArray(row.specifications)
      ? (row.specifications as { label: string; value: string }[]).slice(0, 20)
      : [],
    accessories: Array.isArray(row.accessories)
      ? (row.accessories as Product["accessories"])
      : [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getBranches(): Promise<Branch[]> {
  if (!hasSupabase()) return BRANCHES;
  const supabase = getSupabase();
  if (!supabase) return BRANCHES;

  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("name");

  if (error || !data?.length) return BRANCHES;

  return data.map((row) => ({
    id: String(row.id),
    slug: row.slug as Branch["slug"],
    name: String(row.name),
    phone: String(row.phone),
    email: String(row.email ?? ""),
    addressLine1: String(row.address_line1),
    addressLine2: row.address_line2 ? String(row.address_line2) : undefined,
    addressLocality: String(row.address_locality),
    postalCode: String(row.postal_code),
    lat: Number(row.lat),
    lng: Number(row.lng),
    openingHours: Array.isArray(row.opening_hours)
      ? (row.opening_hours as string[])
      : [],
  }));
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!hasSupabase()) {
    let items = [...PRODUCTS];
    if (options?.category) {
      items = items.filter((p) => p.categorySlug === options.category);
    }
    if (options?.featured) {
      items = items.filter((p) => p.featured);
    }
    if (options?.limit) {
      items = items.slice(0, options.limit);
    }
    return items;
  }

  const supabase = getSupabase();
  if (!supabase) return PRODUCTS;

  let query = supabase.from("products").select("*").eq("published", true);

  if (options?.category) {
    query = query.eq("category_slug", options.category);
  }
  if (options?.featured) {
    query = query.eq("featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return PRODUCTS;
  return data.map((row) => mapProduct(row as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabase()) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = getSupabase();
  if (!supabase) return PRODUCTS.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  return mapProduct(data as Record<string, unknown>);
}

export async function getProductByCategoryAndSlug(
  category: string,
  slug: string,
): Promise<Product | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  if (product.categorySlug !== category) return null;
  return product;
}

export async function getCategories() {
  return PRODUCT_CATEGORIES;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasSupabase()) return BLOG_POSTS;
  const supabase = getSupabase();
  if (!supabase) return BLOG_POSTS;

  // Shared catalogue with Lovable admin (`blog_articles`)
  const { data, error } = await supabase
    .from("blog_articles")
    .select(
      "id, title, slug, excerpt, content_html, image_url, image_alt, tags, published_at, updated_at, is_published",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("blog_articles fetch failed:", error.message);
    return [];
  }
  if (!data?.length) return [];

  return data.map(mapBlogRow);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!hasSupabase()) {
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
  const supabase = getSupabase();
  if (!supabase) {
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("blog_articles")
    .select(
      "id, title, slug, excerpt, content_html, image_url, image_alt, tags, published_at, updated_at, is_published",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("blog_articles by slug failed:", error.message);
    return null;
  }
  if (!data) return null;
  return mapBlogRow(data);
}

/** Related posts by shared tags, falling back to latest. */
export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const tags = new Set((post.tags ?? []).map((t) => t.toLowerCase()));
  const scored = posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const overlap = (p.tags ?? []).filter((t) =>
        tags.has(t.toLowerCase()),
      ).length;
      return { p, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return (
        new Date(b.p.publishedAt).getTime() -
        new Date(a.p.publishedAt).getTime()
      );
    });
  return scored.slice(0, limit).map((s) => s.p);
}

function mapBlogRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.excerpt ?? ""),
    contentHtml: String(row.content_html ?? ""),
    image: String(row.image_url ?? "/images/blog/placeholder-demo.svg"),
    imageAlt: row.image_alt ? String(row.image_alt) : undefined,
    publishedAt: String(row.published_at),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    author: "Mobility Station",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}

const R2_CDN_URL = "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev";

export type PortfolioItem = {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  url: string;
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif|gif|avif)$/i;

/** Admin uploads report `file_type` inconsistently, so fall back to the extension. */
function isPortfolioImage(filePath: string, fileType: unknown) {
  const type = typeof fileType === "string" ? fileType.toLowerCase() : "";
  if (type.startsWith("video/") || type === "application/pdf") return false;
  if (type.startsWith("image/")) return true;
  return IMAGE_EXTENSIONS.test(filePath.split("?")[0]);
}

function portfolioUrl(filePath: string) {
  if (filePath.startsWith("http")) return filePath;
  return `${R2_CDN_URL}/${encodeURI(filePath)}`;
}

export async function getPublicPortfolio(
  limit = 48,
  category?: string,
): Promise<PortfolioItem[]> {
  if (!hasSupabase()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("portfolio_uploads")
    .select(
      "id, file_path, file_type, title, description, category, display_order, created_at",
    )
    .eq("is_public", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("portfolio_uploads fetch failed:", error.message);
    return [];
  }
  if (!data) return [];

  return data
    .filter(
      (r) =>
        typeof r.file_path === "string" &&
        r.file_path.length > 0 &&
        isPortfolioImage(r.file_path, r.file_type),
    )
    .map((r) => ({
      id: String(r.id),
      title: r.title ? String(r.title) : null,
      description: r.description ? String(r.description) : null,
      category: r.category ? String(r.category) : null,
      url: portfolioUrl(String(r.file_path)),
    }));
}

export async function getReviews(): Promise<Review[]> {
  if (!hasSupabase()) return REVIEWS;
  const supabase = getSupabase();
  if (!supabase) return REVIEWS;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !data?.length) return REVIEWS;

  return data.map((row) => ({
    id: String(row.id),
    author: String(row.author),
    rating: Number(row.rating ?? 5),
    quote: String(row.quote ?? row.body),
    location: row.location ? String(row.location) : undefined,
  }));
}

export function getAdaptationServices() {
  return ADAPTATION_SERVICES;
}

export function getAdaptationService(slug: string) {
  return ADAPTATION_SERVICES.find((s) => s.slug === slug) ?? null;
}

export function productPath(product: Pick<Product, "categorySlug" | "slug">) {
  return `/${product.categorySlug}/${product.slug}`;
}
