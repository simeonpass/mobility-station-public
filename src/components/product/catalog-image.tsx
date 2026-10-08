import { cn } from "@/lib/utils";

const PLACEHOLDER = "/placeholder-product.svg";
const MIGRATED_SUPABASE_STORAGE_PREFIX =
  "https://evgvbvvpiculuizvvqyh.supabase.co/storage/v1/object/public/";
const R2_PUBLIC_PREFIX =
  "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/";

function isLocalSrc(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

function isHttpSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

/**
 * Cap Shopify CDN originals — they often ship 1500–2500px JPEGs.
 * R2 assets are already resized by the admin pipeline.
 */
function normalizeRemoteSrc(src: string): string {
  if (src.startsWith(MIGRATED_SUPABASE_STORAGE_PREFIX)) {
    return `${R2_PUBLIC_PREFIX}${src.slice(MIGRATED_SUPABASE_STORAGE_PREFIX.length)}`;
  }

  try {
    const url = new URL(src);
    const host = url.hostname.toLowerCase();
    if (
      host === "cdn.shopify.com" ||
      host.endsWith(".myshopify.com") ||
      host.includes("shopify")
    ) {
      if (!url.searchParams.has("width")) {
        url.searchParams.set("width", "1200");
      }
      if (!url.searchParams.has("quality")) {
        url.searchParams.set("quality", "75");
      }
      return url.toString();
    }
  } catch {
    /* keep original */
  }
  return src;
}

type CatalogImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * Catalogue images from Shopify, Supabase, R2, etc.
 *
 * Server component on purpose — a client <img> on every card was hydrating
 * dozens of islands on shop/home and making phones feel laggy.
 */
export function CatalogImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority = false,
}: CatalogImageProps) {
  const resolved = src && src.trim() ? src.trim() : PLACEHOLDER;
  const displaySrc = isHttpSrc(resolved)
    ? normalizeRemoteSrc(resolved)
    : isLocalSrc(resolved)
      ? resolved
      : PLACEHOLDER;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: bypass Vercel Image Optimization
    <img
      src={displaySrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
