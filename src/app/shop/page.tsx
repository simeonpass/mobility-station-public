import { Hero } from "@/components/sections/hero";
import { ShopBrowser } from "@/components/product/shop-browser";
import { getCategories, getProducts } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Scooters & Wheelchairs Shop",
  description:
    "Browse mobility scooters, powerchairs and folding wheelchairs. Free home demonstrations from Heathrow & Ferndown.",
  path: "/shop",
});

export const revalidate = 300;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Hero
        compact
        title="Scooters & wheelchairs"
        subtitle="Compare mobility scooters, powerchairs and folding travel solutions — then book a free home demonstration."
        primaryLabel="Book a Demo"
      />
      <section className="pb-16 md:pb-20">
        <div className="container-site">
          <ShopBrowser products={products} categories={categories} />
        </div>
      </section>
    </>
  );
}
