"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductAccordion({
  sections,
}: {
  sections: Array<{
    id: string;
    title: string;
    content: ReactNode;
    defaultOpen?: boolean;
  }>;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const defaults = sections.filter((s) => s.defaultOpen).map((s) => s.id);
    if (defaults.length) return new Set(defaults);
    return new Set(sections[0] ? [sections[0].id] : []);
  });
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const pendingScrollId = useRef<string | null>(null);

  useEffect(() => {
    const id = pendingScrollId.current;
    if (!id || !openIds.has(id)) return;
    pendingScrollId.current = null;

    const el = itemRefs.current[id];
    if (!el) return;

    const frame = window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [openIds]);

  if (!sections.length) return null;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        pendingScrollId.current = id;
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-white [overflow-anchor:none]">
      {sections.map((section) => {
        const open = openIds.has(section.id);
        return (
          <div
            key={section.id}
            id={`product-section-${section.id}`}
            ref={(node) => {
              itemRefs.current[section.id] = node;
            }}
            className="scroll-under-header [overflow-anchor:none]"
          >
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left"
              aria-expanded={open}
              onClick={() => toggle(section.id)}
            >
              <span className="text-base font-bold text-primary">
                {section.title}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
            {open ? (
              <div className="px-4 pb-5 text-sm leading-relaxed text-foreground/85">
                {section.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
