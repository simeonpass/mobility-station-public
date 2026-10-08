import { cn } from "@/lib/utils";

type FittingPartnerCornerProps = {
  /** Card thumbnails vs full product gallery. */
  size?: "card" | "gallery";
  className?: string;
};

/**
 * Corner mark for adaptation products — approved installer / accredited fitting.
 */
export function FittingPartnerCorner({
  size = "gallery",
  className,
}: FittingPartnerCornerProps) {
  const gallery = size === "gallery";

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[2]",
        gallery
          ? "bottom-2 right-2 sm:bottom-3 sm:right-3"
          : "bottom-1.5 right-1.5",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-sm border border-white/60 bg-primary font-semibold uppercase tracking-[0.06em] text-primary-foreground shadow-[0_6px_16px_rgba(0,0,0,0.18)]",
          gallery
            ? "px-2.5 py-1.5 text-[10px] sm:px-3 sm:py-2 sm:text-[11px]"
            : "px-2 py-1 text-[8px]",
        )}
      >
        Approved installer
      </div>
    </div>
  );
}

type FittedBadgeProps = {
  size?: "sm" | "md";
  className?: string;
};

/**
 * Text “Supplied & fitted” pill for adaptation product headers.
 */
export function FittedBadge({
  size = "md",
  className,
}: FittedBadgeProps) {
  const compact = size === "sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm bg-primary font-semibold text-primary-foreground shadow-sm",
        compact
          ? "px-2.5 py-1 text-[10px] uppercase tracking-wide"
          : "px-3 py-1.5 text-xs",
        className,
      )}
    >
      <span>Supplied &amp; fitted</span>
    </span>
  );
}
