import { ShopBrowser } from "@/components/product/shop-browser";
import { getCategories, getPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Shop scooters, wheelchairs & more",
  description:
    "Browse mobility scooters, powered wheelchairs and more. Free home demonstrations from Heathrow and Ferndown branches.",
  path: "/shop",
});

type Props = {
  searchParams: Promise<{ sub?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const { sub } = await searchParams;
  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let errorMessage: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getPublishedProducts({ limit: 500, shopOnly: true }),
      getCategories({ shopOnly: true }),
    ]);
  } catch (error) {
    console.error("Shop catalog error:", error);
    errorMessage =
      "We could not load the product catalogue right now. Please try again shortly or call 0800 772 3870.";
  }

  return (
    <div className="container-site py-12 md:py-16">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Mobility Station
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
          Scooters &amp; Wheelchairs
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Search and filter our catalogue, then book a free home demonstration
          from Heathrow or Ferndown.
        </p>
      </header>

      {errorMessage ? (
        <p className="rounded-lg bg-soft px-4 py-3 text-sm text-primary">
          {errorMessage}
        </p>
      ) : (
        <ShopBrowser
          products={products}
          categories={categories}
          initialSub={sub === "scooters" || sub === "wheelchairs" ? sub : ""}
        />
      )}
    </div>
  );
}
