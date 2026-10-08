"use client";

import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  className?: string;
};

/** Accessible on/off switch — no Radix dependency. */
export function Switch({
  checked,
  onCheckedChange,
  id,
  label,
  className,
}: Props) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-2.5 h-6 rounded-full border-2 border-transparent transition-colors", checked ? "bg-primary" : "bg-border")} />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
