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

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return BLOG_POSTS;

  return data.map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    image: String(row.image_url ?? "/images/blog/placeholder-demo.svg"),
    publishedAt: String(row.published_at),
    author: String(row.author ?? "Mobility Station"),
  }));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
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
