"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function HeaderSearch({
  className = "",
  size = "md",
  onSubmitExtra,
}: {
  className?: string;
  size?: "sm" | "md";
  onSubmitExtra?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    onSubmitExtra?.();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const compact = size === "sm";

  return (
    <form
      onSubmit={submit}
      role="search"
      className={`relative min-w-0 ${className}`}
    >
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
          compact ? "left-3 h-3.5 w-3.5" : "left-4 h-4 w-4"
        }`}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Mobility Station"
        aria-label="Search products and vehicle adaptations"
        className={`w-full rounded-full border border-[#d7e0dd] bg-white text-foreground placeholder:text-muted/80 transition-[border-color,box-shadow] focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
          compact
            ? "h-10 py-2 pl-9 pr-3 text-sm"
            : "h-12 py-2.5 pl-11 pr-5 text-sm"
        }`}
      />
    </form>
  );
}
