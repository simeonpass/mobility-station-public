import { SearchForm } from "@/components/layout/search-form";

export function CatalogSearchStrip({
  type,
  title = "Search the catalogue",
  subtitle,
  placeholder,
}: {
  type?: "shop" | "adaptations";
  title?: string;
  subtitle?: string;
  placeholder?: string;
}) {
  return (
    <section className="border-b border-border bg-soft/55">
      <div className="container-site py-7 md:py-9">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:items-center md:gap-12">
          <div className="max-w-lg">
            <h2 className="text-xl font-extrabold tracking-[-0.02em] text-primary md:text-2xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>
            ) : null}
          </div>
          <div className="w-full">
            <SearchForm
              type={type}
              size="lg"
              placeholder={
                placeholder ??
                (type === "adaptations"
                  ? "Search adaptations, brands or categories"
                  : type === "shop"
                    ? "Search scooters, wheelchairs or brands"
                    : "Search products, brands or adaptations")
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
