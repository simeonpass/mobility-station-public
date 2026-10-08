import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderSearch({ className = "" }: { className?: string }) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      aria-label="Menu search"
      className={cn("relative min-w-0", className)}
    >
      <input
        type="search"
        name="q"
        maxLength={120}
        placeholder="Search products"
        aria-label="Search products and vehicle adaptations"
        className="h-12 w-full rounded-full border border-border/80 bg-soft/70 py-2 pl-4 pr-14 text-base text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-muted transition-[box-shadow,border-color,background-color] focus-visible:border-primary/25 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:pl-5 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
        aria-label="Search"
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
