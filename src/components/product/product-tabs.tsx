"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Section = {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

function useMdUp() {
  const [mdUp, setMdUp] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mdUp;
}

export function ProductTabs({ sections }: { sections: Section[] }) {
  const defaultId =
    sections.find((s) => s.defaultOpen)?.id ?? sections[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultId);
  const [openIds, setOpenIds] = useState<string[]>(
    defaultId ? [defaultId] : [],
  );
  const mdUp = useMdUp();

  if (!sections.length) return null;

  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  function toggleAccordion(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  if (mdUp) {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_22px_60px_-48px_rgba(0,0,0,0.38)]">
        <div className="border-b border-border bg-white px-4 pt-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Product details"
            className="flex w-full gap-7 overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    "relative shrink-0 cursor-pointer px-0 pb-4 pt-2 text-sm font-semibold transition-colors sm:text-[15px]",
                    selected ? "text-primary" : "text-muted hover:text-primary",
                  )}
                  onClick={() => setActiveId(section.id)}
                >
                  {section.title}
                  {selected ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          id={`product-panel-${active.id}`}
          aria-labelledby={`product-tab-${active.id}`}
          className="px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10"
        >
          <div className="mx-auto max-w-4xl">{active.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-border bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,0.34)]">
      <div className="divide-y divide-border">
        {sections.map((section) => {
          const open = openIds.includes(section.id);
          return (
            <div key={section.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`product-acc-${section.id}`}
                id={`product-acc-btn-${section.id}`}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[15px] font-semibold transition-colors",
                  open ? "bg-soft/55 text-primary" : "bg-white text-primary hover:bg-soft/45",
                )}
                onClick={() => toggleAccordion(section.id)}
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                    open && "rotate-180 text-primary",
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <div
                  id={`product-acc-${section.id}`}
                  role="region"
                  aria-labelledby={`product-acc-btn-${section.id}`}
                  className="border-t border-border/70 bg-white px-5 py-6"
                >
                  {section.content}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
