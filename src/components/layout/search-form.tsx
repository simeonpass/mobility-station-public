"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchForm({
  defaultValue = "",
  autoFocus = false,
  /** Scope results to one catalogue on /search. */
  type,
  placeholder = "Search products, brands or adaptations",
  size = "default",
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  type?: "shop" | "adaptations" | "all";
  placeholder?: string;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    const params = new URLSearchParams({ q });
    if (type === "shop" || type === "adaptations") {
      params.set("type", type);
    }
    router.push(`/search?${params.toString()}`);
  }

  const large = size === "lg";

  return (
    <form onSubmit={submit} role="search" className="flex gap-2">
      <div className="relative min-w-0 flex-1">
        <Search
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
            large ? "left-4 h-5 w-5" : "left-3 h-4 w-4"
          }`}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label={placeholder}
          className={`w-full rounded-xl border border-border bg-white text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            large
              ? "h-12 pl-12 pr-4 text-base"
              : "h-11 pl-9 pr-3 text-sm"
          }`}
        />
      </div>
      <button
        type="submit"
        className={`shrink-0 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90 ${
          large ? "px-6 text-base" : "px-5 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
