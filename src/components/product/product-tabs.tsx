"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProductTabs({
  sections,
}: {
  sections: Array<{
    id: string;
    title: string;
    content: ReactNode;
    defaultOpen?: boolean;
  }>;
}) {
  const defaultId =
    sections.find((s) => s.defaultOpen)?.id ?? sections[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultId);

  if (!sections.length) return null;

  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_50px_-36px_rgba(0,63,67,0.45)]">
      <div className="border-b border-border bg-gradient-to-b from-primary-soft/70 to-soft/40 px-3 pt-3 sm:px-4">
        <div
          role="tablist"
          aria-label="Product details"
          className="flex w-full gap-1 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const selected = section.id === active.id;
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                id={`product-tab-${section.id}`}
                aria-selected={selected}
                aria-controls={`product-panel-${section.id}`}
                tabIndex={selected ? 0 : -1}
                className={cn(
                  "shrink-0 cursor-pointer rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-[color,background-color,box-shadow] sm:px-4 sm:text-[15px]",
                  selected
                    ? "bg-white text-primary shadow-sm ring-1 ring-border/80"
                    : "text-muted hover:bg-white/55 hover:text-primary",
                )}
                onClick={() => setActiveId(section.id)}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`product-panel-${active.id}`}
        aria-labelledby={`product-tab-${active.id}`}
        className="px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9"
      >
        <div className="mx-auto max-w-4xl">{active.content}</div>
      </div>
    </div>
  );
}
