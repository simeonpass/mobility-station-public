import { cn } from "@/lib/utils";

type FittedMechanicCornerProps = {
  /** Card thumbnails vs full product gallery. */
  size?: "card" | "gallery";
  className?: string;
};

/**
 * Circular “We fit this” badge — round disc + cutout mascot (never a square plate).
 */
export function FittedMechanicCorner({
  size = "gallery",
  className,
}: FittedMechanicCornerProps) {
  const gallery = size === "gallery";

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[2] flex flex-col items-center",
        gallery
          ? "bottom-2 right-2 sm:bottom-3 sm:right-3"
          : "bottom-1 right-1",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "relative z-[1] mb-[-0.35rem] rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground shadow-md",
          gallery ? "text-[10px] sm:text-xs" : "text-[9px]",
        )}
      >
        We fit this
      </span>
      <span
        className={cn(
          "relative overflow-hidden rounded-full bg-gradient-to-b from-[#e8f3f1] to-[#d5e8e4] shadow-[0_10px_22px_rgba(0,63,67,0.35)] ring-2 ring-white/90",
          gallery
            ? "h-[5.5rem] w-[5.5rem] sm:h-[6.75rem] sm:w-[6.75rem]"
            : "h-[3.75rem] w-[3.75rem]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- cutout sticker; avoid Next Image square intrinsic box */}
        <img
          src="/brand/mechanic-fitted-sticker.png"
          alt=""
          className={cn(
            "absolute left-1/2 top-[8%] h-[115%] w-auto max-w-none -translate-x-1/2 object-contain",
          )}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </span>
    </div>
  );
}

type FittedBadgeProps = {
  size?: "sm" | "md";
  className?: string;
  /** Include the mascot face in the pill. */
  withMascot?: boolean;
};

/**
 * Text “Supplied & fitted” pill — optional tiny circular mascot.
 */
export function FittedBadge({
  size = "md",
  className,
  withMascot = false,
}: FittedBadgeProps) {
  const compact = size === "sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary font-semibold text-primary-foreground shadow-sm",
        compact
          ? "px-2.5 py-1 text-[10px] uppercase tracking-wide"
          : "px-3 py-1.5 text-xs",
        className,
      )}
    >
      {withMascot ? (
        <span className="relative shrink-0 overflow-hidden rounded-full bg-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny mascot thumb; skip Vercel Image Optimization */}
          <img
            src="/brand/mechanic-fitted-sticker.png"
            alt=""
            width={compact ? 22 : 28}
            height={compact ? 22 : 28}
            className={cn(
              "object-cover object-top",
              compact ? "h-[22px] w-[22px]" : "h-7 w-7",
            )}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        </span>
      ) : null}
      <span>Supplied &amp; fitted</span>
    </span>
  );
}
