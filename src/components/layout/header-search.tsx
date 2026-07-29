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
          compact ? "left-2.5 h-3.5 w-3.5" : "left-3 h-4 w-4"
        }`}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products & adaptations"
        aria-label="Search products and vehicle adaptations"
        className={`w-full rounded-full border border-border bg-white text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          compact
            ? "h-10 py-2 pl-8 pr-3 text-sm"
            : "h-10 py-2 pl-9 pr-4 text-sm"
        }`}
      />
    </form>
  );
}
