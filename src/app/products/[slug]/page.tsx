import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  conditionLabel,
  displayPrice,
  formatGBP,
  getAllPublishedSlugs,
  getProductBySlug,
  isUsedCondition,
  primaryImage,
  stockStatus,
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

function youtubeEmbed(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const price = displayPrice(product);
  const stock = stockStatus(product);
  const used = isUsedCondition(product.condition);

  const galleryUrls: string[] = [];
  if (product.image_url) galleryUrls.push(product.image_url);
  for (const img of product.images) {
    if (!galleryUrls.includes(img.image_url)) galleryUrls.push(img.image_url);
  }
  if (galleryUrls.length === 0) galleryUrls.push("/placeholder-product.svg");

  const optionVariants = product.variants.filter((v) => !v.is_addon);
  const videoEmbed = product.video_url ? youtubeEmbed(product.video_url) : null;

  const specs =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications as Record<string, unknown>).slice(
          0,
          20,
        )
      : [];

  if (product.weight != null && !specs.some(([k]) => /weight/i.test(k))) {
    specs.push(["Weight", `${product.weight} kg`]);
  }
  if (product.dimensions && !specs.some(([k]) => /dimension/i.test(k))) {
    specs.push(["Dimensions", product.dimensions]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description,
    brand: product.manufacturer
      ? { "@type": "Brand", name: product.manufacturer }
      : undefined,
    sku: product.sku || undefined,
    image: galleryUrls,
    offers: price.current
      ? {
          "@type": "Offer",
          price: price.current.toFixed(2),
          priceCurrency: "GBP",
          availability: stock.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE.url}/products/${product.slug}`,
        }
      : undefined,
  };

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
          ...(product.category
            ? [
                {
                  label: product.category,
                  href: `/shop/${product.category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery images={galleryUrls} name={product.name} />

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {used ? (
              <span className="rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
                Clearance · {conditionLabel(product.condition)}
              </span>
            ) : null}
            {product.condition_grade ? (
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                Grade {product.condition_grade}
              </span>
            ) : null}
            {price.was ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Sale — save {formatGBP(price.was - (price.current ?? 0))}
              </span>
            ) : null}
          </div>

          {product.manufacturer ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              {product.manufacturer}
            </p>
          ) : null}
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
            {product.name}
          </h1>

          <p
            className={`mt-3 text-sm font-medium ${
              stock.available ? "text-success" : "text-error"
            }`}
          >
            {stock.label}
            {product.pre_order_enabled && product.pre_order_message
              ? ` — ${product.pre_order_message}`
              : null}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            {price.current != null ? (
              <>
                <span className="text-sm text-muted">From</span>
                <span className="text-3xl font-bold text-primary">
                  {formatGBP(price.current)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary">POA</span>
            )}
            {price.was ? (
              <span className="text-lg text-muted line-through">
                RRP {formatGBP(price.was)}
              </span>
            ) : null}
          </div>

          {(product.motability_weekly_price != null &&
            product.motability_weekly_price >= 0) ||
          product.motability_price != null ? (
            <div className="mt-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                Motability Scheme
              </p>
              {product.motability_weekly_price != null &&
              product.motability_weekly_price > 0 ? (
                <p className="mt-1 text-lg font-bold">
                  {formatGBP(product.motability_weekly_price)}/week
                </p>
              ) : product.motability_weekly_price === 0 ||
                product.motability_price === 0 ? (
                <p className="mt-1 text-lg font-bold">Free of charge</p>
              ) : product.motability_price != null ? (
                <p className="mt-1 text-lg font-bold">
                  {formatGBP(product.motability_price)} contribution
                </p>
              ) : null}
              <Link
                href="/motability"
                className="mt-1 inline-block text-sm underline opacity-90 hover:opacity-100"
              >
                Learn about Motability
              </Link>
            </div>
          ) : null}

          {product.delivery_estimate ? (
            <p className="mt-4 text-sm text-muted">
              Delivery: {product.delivery_estimate}
            </p>
          ) : null}

          {product.colour_options && product.colour_options.length > 0 ? (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-semibold text-primary">
                Colour options
              </h2>
              <ul className="flex flex-wrap gap-2">
                {product.colour_options.map((colour) => (
                  <li
                    key={colour}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {colour}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {optionVariants.length > 0 ? (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-semibold text-primary">
                Options
              </h2>
              <ul className="space-y-2 text-sm">
                {optionVariants.map((variant) => {
                  const variantPrice = displayPrice({
                    unit_price: variant.unit_price,
                    sale_price: variant.sale_price,
                  });
                  const variantOut =
                    variant.track_stock && (variant.quantity ?? 0) <= 0;
                  return (
                    <li
                      key={variant.id}
                      className="flex items-center justify-between border-b border-border py-2"
                    >
                      <span>
                        {variant.label || variant.colour || "Option"}
                        {variantOut ? (
                          <span className="ml-2 text-muted">(out of stock)</span>
                        ) : null}
                      </span>
                      <span className="font-semibold">
                        {formatGBP(variantPrice.current)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
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

          {product.is_discontinued && product.discontinued_message ? (
            <p className="mt-4 rounded-lg bg-soft p-3 text-sm text-muted">
              {product.discontinued_message}
            </p>
          ) : null}

          {product.description ? (
            <div className="mt-8 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-foreground/85">
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
                {product.features.slice(0, 12).map((feature) => (
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

          {product.suitability_info ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-primary">
                Who is it suitable for?
              </h2>
              <div className="space-y-2 text-foreground/85">
                {product.suitability_info
                  .split("\n")
                  .filter(Boolean)
                  .map((line) => (
                    <p key={line}>{line}</p>
                  ))}
              </div>
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

          {videoEmbed ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-primary">Video</h2>
              <div className="aspect-video overflow-hidden rounded-xl bg-soft">
                <iframe
                  src={videoEmbed}
                  title={`${product.name} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
