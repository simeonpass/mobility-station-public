import { SearchForm } from "@/components/layout/search-form";

/** Prominent catalogue search strip — sits above popular products. */
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
    <section className="border-b border-border bg-white">
      <div className="container-site py-6 md:py-8">
        <div className="max-w-2xl">
          <h2 className="text-lg font-extrabold tracking-tight text-primary md:text-xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
        <div className="mt-4 max-w-2xl">
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
    </section>
  );
}
