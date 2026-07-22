import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/placeholder-product.svg";

function isLocalSrc(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

function isHttpSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

type CatalogImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
};

/**
 * Product/catalog images come from many external hosts in Supabase.
 * Use next/image for local assets; plain <img> for remote URLs so unknown
 * hostnames cannot crash the page via next/image config errors.
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
  ...rest
}: CatalogImageProps) {
  const resolved = src && src.trim() ? src.trim() : PLACEHOLDER;

  if (isLocalSrc(resolved)) {
    return (
      <Image
        src={resolved}
        alt={alt}
        className={className}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        {...rest}
      />
    );
  }

  if (isHttpSrc(resolved)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full", className)}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={PLACEHOLDER}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      {...rest}
    />
  );
}
