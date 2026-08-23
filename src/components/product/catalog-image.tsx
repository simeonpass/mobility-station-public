"use client";

import { useState } from "react";
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
  // V1 storage was migrated to R2. Keep catalogue cards resilient if a stale
  // Supabase public URL is ever written back into a product record.
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
  /** Absolutely fill the positioned parent (same contract as next/image fill). */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Kept for call-site compatibility; plain <img> ignores srcset sizes. */
  sizes?: string;
  /** LCP / above-fold — eager load + high fetch priority. */
  priority?: boolean;
  quality?: number;
};

/**
 * Catalogue images from Shopify, Supabase, R2, etc.
 *
 * Plain <img> on purpose — R2 files are pre-resized, and routing them through
 * next/image burned Vercel Image Optimization quota for no gain.
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
  const [failed, setFailed] = useState(false);

  const displaySrc = failed
    ? PLACEHOLDER
    : isHttpSrc(resolved)
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
      onError={() => setFailed(true)}
    />
  );
}
