import Image from "next/image";
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

  return (
    <Image
      src={src}
      alt="Motability Scheme"
      width={Math.round(height * (1658 / 566))}
      height={height}
      className={cn("w-auto object-contain", className)}
      style={{ width: "auto", height }}
    />
  );
}
