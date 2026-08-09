import { Search } from "lucide-react";

export function RecentWorkSearch({
  query = "",
  resultCount,
}: {
  query?: string;
  resultCount?: number;
}) {
  return (
    <form action="/our-work" method="get" className="max-w-xl" role="search">
      <label htmlFor="our-work-q" className="sr-only">
        Search recent work
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            id="our-work-q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search by job, scooter, hoist, town…"
            autoComplete="off"
            className="h-11 w-full rounded-md border border-border bg-white pl-10 pr-3 text-sm text-foreground outline-none ring-accent focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          Search
        </button>
      </div>
      {query ? (
        <p className="mt-3 text-sm text-muted">
          {resultCount === 0
            ? `No projects match “${query}”.`
            : `${resultCount} ${resultCount === 1 ? "result" : "results"} for “${query}”.`}{" "}
          <a href="/our-work" className="font-semibold text-primary underline">
            Clear
          </a>
        </p>
      ) : null}
    </form>
  );
}
