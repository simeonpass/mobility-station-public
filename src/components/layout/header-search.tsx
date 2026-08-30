"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export function HeaderSearch({
  className = "",
  size = "md",
  autoFocus = false,
  onSubmitExtra,
}: {
  className?: string;
  size?: "sm" | "md";
  autoFocus?: boolean;
  onSubmitExtra?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

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
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-primary/45 ${
          compact ? "left-3 h-3.5 w-3.5" : "left-3.5 h-4 w-4"
        }`}
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products & adaptations"
        aria-label="Search products and vehicle adaptations"
        className={`w-full rounded-full border border-border/80 bg-soft/70 text-foreground placeholder:text-muted transition-[box-shadow,border-color,background-color] focus-visible:border-primary/25 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
          compact
            ? "h-10 py-2 pl-9 pr-3 text-sm"
            : "h-11 py-2 pl-10 pr-4 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
      />
    </form>
  );
}
