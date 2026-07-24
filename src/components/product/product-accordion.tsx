"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductAccordion({
  sections,
}: {
  sections: Array<{ id: string; title: string; content: ReactNode; defaultOpen?: boolean }>;
}) {
  const [openId, setOpenId] = useState<string | null>(
    sections.find((s) => s.defaultOpen)?.id ?? sections[0]?.id ?? null,
  );

  if (!sections.length) return null;

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-white">
      {sections.map((section) => {
        const open = openId === section.id;
        return (
          <div key={section.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : section.id)}
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
