import { getBrandLogo } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

export function BrandLogo({
  manufacturer,
  className,
  height = 28,
}: {
  manufacturer: string | null | undefined;
  className?: string;
  height?: number;
}) {
  const src = getBrandLogo(manufacturer);
  if (!src || !manufacturer) return null;

  const width = Math.round(height * 3.2);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local logo; skip Vercel Image Optimization
    <img
      src={src}
      alt={`${manufacturer} logo`}
      width={width}
      height={height}
      className={cn("w-auto object-contain object-left", className)}
      style={{ height }}
      loading="lazy"
      decoding="async"
    />
  );
}
