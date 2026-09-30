"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { divisionForPath } from "@/lib/division";

/**
 * Marks the page with the division it belongs to so the header, buttons
 * and page intros pick up that division's colour. Uses display: contents,
 * so it adds no box to the layout.
 */
export function DivisionScope({ children }: { children: ReactNode }) {
  const division = divisionForPath(usePathname());
  return (
    <div className="contents" data-division={division ?? undefined}>
      {children}
    </div>
  );
}
