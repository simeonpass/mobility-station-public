import Link from "next/link";
import { RECENT_WORK_CATEGORIES } from "@/lib/recent-work";
import { cn } from "@/lib/utils";

export function RecentWorkFilters({
  active,
}: {
  active?: string | null;
}) {
  const current = active && active !== "all" ? active : "all";

  const items = [
    { id: "all", label: "All work" },
    ...RECENT_WORK_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <nav aria-label="Filter recent work" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const href =
          item.id === "all" ? "/our-work" : `/our-work?category=${item.id}`;
        const isActive = current === item.id;
        return (
          <Link
            key={item.id}
            href={href}
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white text-primary hover:border-primary/40",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
