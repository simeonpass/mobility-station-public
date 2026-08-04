import { cn } from "@/lib/utils";

type MotabilityLogoProps = {
  /** White mark for dark backgrounds; blue for light surfaces. */
  variant?: "blue" | "white";
  className?: string;
  height?: number;
};

export function MotabilityLogo({
  variant = "blue",
  className,
  height = 18,
}: MotabilityLogoProps) {
  const src =
    variant === "white"
      ? "/brand/motability-scheme-white.png"
      : "/brand/motability-scheme-logo-blue.png";

  const width = Math.round(height * (1658 / 566));

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local logo; skip Vercel Image Optimization
    <img
      src={src}
      alt="Motability Scheme"
      width={width}
      height={height}
      className={cn("w-auto object-contain", className)}
      style={{ width: "auto", height }}
      loading="lazy"
      decoding="async"
    />
  );
}
