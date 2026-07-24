import Image from "next/image";
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

  return (
    <Image
      src={src}
      alt={`${manufacturer} logo`}
      width={Math.round(height * 3.2)}
      height={height}
      className={cn("w-auto object-contain object-left", className)}
      style={{ height }}
    />
  );
}
