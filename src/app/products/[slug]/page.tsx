import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  displayPrice,
  formatGBP,
  getAllPublishedSlugs,
  getProductBySlug,
  primaryImage,
} from "@/lib/products";
import { jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.slice(0, 50).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product not found" };

    const title = truncate(
      product.seo_title || `${product.name} | Mobility Station`,
      60,
    );
    const description = truncate(
      product.meta_description ||
        `${product.name}. Free home demonstration from our Heathrow or Ferndown branches.`,
      160,
    );
    const image = primaryImage(product);
    const absoluteImage = image.startsWith("https://") ? image : undefined;

    return {
      title: { absolute: title },
      description,
      alternates: {
        canonical: `${SITE.url}/products/${product.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `${SITE.url}/products/${product.slug}`,
        ...(absoluteImage ? { images: [absoluteImage] } : {}),
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const price = displayPrice(product);
  const gallery =
    product.images.length > 0
      ? product.images
      : product.image_url
        ? [
            {
              id: "main",
              image_url: product.image_url,
              alt_text: product.name,
              sort_order: 0,
              is_primary: true,
            },
          ]
        : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description,
    brand: product.manufacturer
      ? { "@type": "Brand", name: product.manufacturer }
      : undefined,
    image: gallery.map((g) => g.image_url),
    offers: price.current
      ? {
          "@type": "Offer",
          price: price.current,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: `${SITE.url}/products/${product.slug}`,
        }
      : undefined,
  };

  const specs =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications as Record<string, unknown>).slice(
          0,
          20,
        )
      : [];

  return (
    <main className="container-site py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">
            {gallery[0] ? (
              <Image
                src={gallery[0].image_url}
                alt={gallery[0].alt_text || `${product.name} mobility product`}
                fill
                className="object-contain p-6"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <Image
                src="/placeholder-product.svg"
                alt={`${product.name} mobility product`}
                fill
                className="object-contain p-6"
                priority
              />
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="grid grid-cols-4 gap-2">
              {gallery.slice(0, 8).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-soft"
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || product.name}
                    fill
                    className="object-contain p-2"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          {product.manufacturer ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              {product.manufacturer}
            </p>
          ) : null}
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatGBP(price.current)}
            </span>
            {price.was ? (
              <span className="text-lg text-muted line-through">
                {formatGBP(price.was)}
              </span>
            ) : null}
          </div>

          {product.motability_weekly_price != null ? (
            <p className="mt-2 font-medium text-primary">
              or{" "}
              <strong>£{product.motability_weekly_price}/week</strong> on
              Motability
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/book-a-demo?product=${encodeURIComponent(product.slug)}`}
              className="flex-1 rounded-xl bg-accent px-6 py-3 text-center font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Book a free home demo
            </Link>
            <a
              href="tel:08007723870"
              className="flex-1 rounded-xl border border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Call 0800 772 3870
            </a>
          </div>

          {product.description ? (
            <div className="mt-8 max-w-none">
              <p className="leading-relaxed text-foreground/85">
                {product.description}
              </p>
            </div>
          ) : null}

          {product.features && product.features.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-primary">
                Key features
              </h2>
              <ul className="space-y-2">
                {product.features.slice(0, 10).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-bold text-accent" aria-hidden>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {specs.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-primary">
                Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {specs.map(([key, value]) => (
                  <div key={key} className="border-b border-border py-2">
                    <dt className="capitalize text-muted">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {product.variants.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-primary">
                Options
              </h2>
              <ul className="space-y-2 text-sm">
                {product.variants.map((variant) => (
                  <li
                    key={variant.id}
                    className="flex items-center justify-between border-b border-border py-2"
                  >
                    <span>
                      {variant.variant_label || variant.colour || "Option"}
                      {!variant.in_stock ? (
                        <span className="ml-2 text-muted">(out of stock)</span>
                      ) : null}
                    </span>
                    <span className="font-semibold">
                      {formatGBP(variant.sale_price ?? variant.retail_price)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
