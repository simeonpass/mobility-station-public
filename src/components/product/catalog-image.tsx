"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const PLACEHOLDER = "/placeholder-product.svg";

function isLocalSrc(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

function isHttpSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

/**
 * Cap Shopify CDN originals — they often ship 1500–2500px JPEGs.
 * Next/image still re-encodes; this reduces origin fetch size first.
 */
function normalizeRemoteSrc(src: string): string {
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

type CatalogImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
};

/**
 * Catalogue images come from Shopify, Supabase, R2 and other hosts.
 * Always go through next/image so mobile gets resized WebP/AVIF instead of
 * multi‑hundred‑KB (sometimes 1MB+) originals.
 */
export function CatalogImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  quality = 75,
  ...rest
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
    <Image
      src={displaySrc}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
