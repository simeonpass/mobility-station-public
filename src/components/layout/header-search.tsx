"use client";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useSiteDivision } from "@/components/layout/division-scope";

export function HeaderSearch({ className = "", size = "md", autoFocus = false, onSubmitExtra }: { className?: string; size?: "sm" | "md"; autoFocus?: boolean; onSubmitExtra?: () => void }) {
  const router = useRouter();
  const division = useSiteDivision();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (division) params.set("type", division === "adapt" ? "adaptations" : "shop");
    onSubmitExtra?.();
    router.push(params.size ? `/search?${params.toString()}` : "/search");
  }
  const label = division === "adapt" ? "Search vehicle adaptations" : division === "shop" ? "Search scooters and wheelchairs" : "Search products and vehicle adaptations";
  return <form onSubmit={submit} role="search" className={`flex min-w-0 gap-2 ${className}`}>
    <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" /><input ref={inputRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={label} aria-label={label} className={`w-full rounded-xl border border-border bg-white py-2 pl-10 pr-3 text-foreground placeholder:text-muted ${size === "sm" ? "h-11 text-sm" : "h-12 text-base"}`} /></div>
    <button type="submit" className="msx-button">Search</button>
  </form>;
}
