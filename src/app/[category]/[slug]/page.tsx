import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import {
  CompatibleAccessories,
  MotabilityBadge,
  ProductSpecGrid,
} from "@/components/product/product-details";
import { ProductGallery } from "@/components/product/product-gallery";
import { getProductByCategoryAndSlug, getProducts, productPath } from "@/lib/data";
import { createMetadata, jsonLdScript, SITE } from "@/lib/seo";
import { formatPrice, truncate } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/data/content";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

const reserved = new Set([
  "shop",
  "blog",
  "locations",
  "contact",
  "about-us",
  "motability",
  "faq",
  "trade-in",
  "book-a-demo",
  "book-a-service",
  "vehicle-adaptations",
  "lightweight-folding-mobility",
  "mobility-scooter-hire",
  "api",
]);

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductByCategoryAndSlug(category, slug);
  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "This product could not be found.",
      path: `/${category}/${slug}`,
    });
  }

  return createMetadata({
    title: truncate(product.name, 45),
    description: truncate(
      product.seoCopy || product.excerpt || product.description,
      160,
    ),
    path: productPath(product),
  });
}

export const revalidate = 300;

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;

  if (reserved.has(category)) notFound();
  const validCategory = PRODUCT_CATEGORIES.some((c) => c.slug === category);
  if (!validCategory) notFound();

  const product = await getProductByCategoryAndSlug(category, slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.excerpt || product.description,
    sku: product.productCode,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: product.price ?? undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: `${SITE.url}${productPath(product)}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${SITE.url}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE.url}${productPath(product)}`,
      },
    ],
  };

  return (
    <div className="container-site py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([jsonLd, breadcrumbLd])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.categoryName, href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <MotabilityBadge show={product.motability} />
            <span className="text-sm text-muted">
              {product.inStock ? "In stock" : "Made to order"}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {product.brand}
            {product.productCode ? ` · Product Code ${product.productCode}` : ""}
          </p>
          <p className="mt-4 text-3xl font-extrabold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            {truncate(product.excerpt || product.description, 160)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#enquire"
              className="inline-flex h-12 items-center rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Add to Enquiry
            </Link>
            <Link
              href="/book-a-demo"
              className="inline-flex h-12 items-center rounded-md border border-primary px-6 text-sm font-semibold text-primary hover:bg-soft"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-extrabold">Overview</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/85">
              {product.description}
            </p>
            {product.seoCopy ? (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {product.seoCopy}
              </p>
            ) : null}
          </section>

          {product.features.length ? (
            <section>
              <h2 className="text-2xl font-extrabold">Key features</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/85">
                {product.features.slice(0, 10).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <ProductSpecGrid specifications={product.specifications} />
          <CompatibleAccessories accessories={product.accessories} />
        </div>

        <div id="enquire" className="rounded-lg bg-soft p-6 md:p-8">
          <EnquiryForm
            enquiryType="demo"
            title="Enquire about this product"
            defaultInterest={product.name}
            productSlug={product.slug}
          />
        </div>
      </div>
    </div>
  );
}
