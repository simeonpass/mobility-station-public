import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AdaptationCard } from "@/components/product/adaptation-card";
import { MotabilityProductCard } from "@/components/product/motability-product-card";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { ProductReviews } from "@/components/product/product-reviews";
import {
  adaptationHref,
  findSectionForCategory,
  isAdaptationProduct,
  sectionHref,
} from "@/lib/adaptations";
import { getProductReviews } from "@/lib/data";
import {
  conditionGradeLabel,
  conditionLabel,
  displayPrice,
  formatGBP,
  getAllPublishedSlugs,
  getProductBySlug,
  getRelatedProducts,
  isUsedCondition,
  primaryImage,
  stockStatus,
} from "@/lib/products";
import { jsonLdScript, SITE } from "@/lib/seo";
import { truncate } from "@/lib/utils";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

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
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const title = truncate(
    product.seo_title || `${product.name} | Mobility Station`,
    60,
  );
  const description = truncate(
    product.meta_description ||
      `${product.name}. Home and branch demonstrations from our Heathrow or Ferndown branches.`,
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
}

function youtubeEmbed(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { from } = await searchParams;
  const motabilityMode = from === "motability";
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const price = displayPrice(product);
  const stock = stockStatus(product);
  const used = isUsedCondition(product.condition);
  const adaptation = isAdaptationProduct(product);
  const adaptationSection = findSectionForCategory(product.category);
  const [related, productReviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getProductReviews(product.id),
  ]);

  const galleryUrls: string[] = [];
  if (product.image_url) galleryUrls.push(product.image_url);
  for (const img of product.images) {
    if (!galleryUrls.includes(img.image_url)) galleryUrls.push(img.image_url);
  }
  if (galleryUrls.length === 0) galleryUrls.push("/placeholder-product.svg");

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

  const cartProduct =
    !adaptation && price.current != null
      ? {
          id: product.id,
          stockItemId: product.id,
          name: product.name,
          slug: product.slug,
          image_url: primaryImage(product),
          unit_price: product.unit_price ?? price.current,
          sale_price: product.sale_price,
          category: product.category,
          weight: product.weight,
          condition: product.condition,
          product_type: product.product_type,
          pre_order_enabled: product.pre_order_enabled,
        }
      : null;

  return (
    <div className="pb-4 md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />

      <div className="container-site pt-4 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(adaptation
              ? [
                  {
                    label: "Vehicle Adaptations",
                    href: "/vehicle-adaptations",
                  },
                  ...(adaptationSection
                    ? [
                        {
                          label: adaptationSection.title,
                          href: sectionHref(adaptationSection.id),
                        },
                      ]
                    : []),
                  ...(product.category
                    ? [
                        {
                          label: product.category,
                          href: adaptationHref(product.category),
                        },
                      ]
                    : []),
                ]
              : motabilityMode
                ? [{ label: "Motability", href: "/motability" }]
                : [
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
                  ]),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-site">
        <ProductDetailView
          name={product.name}
          slug={product.slug}
          manufacturer={product.manufacturer}
          category={product.category}
          condition={product.condition}
          gallery={galleryUrls}
          priceCurrent={price.current}
          priceWas={price.was}
          stockLabel={
            motabilityMode
              ? "Available on Motability"
              : adaptation
                ? ""
                : stock.label
          }
          stockAvailable={stock.available}
          used={used}
          conditionLabel={used ? conditionLabel(product.condition) : null}
          conditionGrade={conditionGradeLabel(product.condition_grade)}
          saleSaveLabel={
            !motabilityMode && price.was && price.current
              ? `Sale — save ${formatGBP(price.was - price.current)}`
              : null
          }
          motabilityWeekly={product.motability_weekly_price}
          motabilityPrice={product.motability_price}
          adaptationId={product.adaptation_id}
          isAdaptation={adaptation}
          deliveryEstimate={product.delivery_estimate}
          trackStock={product.track_stock}
          weight={product.weight}
          colourOptions={product.colour_options ?? []}
          variants={product.variants}
          cartProduct={motabilityMode ? null : cartProduct}
          discontinuedMessage={
            product.is_discontinued ? product.discontinued_message : null
          }
          description={product.description}
          features={(product.features ?? []).slice(0, 12)}
          suitabilityInfo={product.suitability_info}
          specs={specs.map(([k, v]) => [k, String(v)])}
          videoEmbed={videoEmbed}
          motabilityMode={motabilityMode}
        />
      </div>

      {productReviews.length > 0 ? (
        <div className="container-site">
          <ProductReviews reviews={productReviews} />
        </div>
      ) : null}

      {related.length > 0 ? (
        <section className="container-site mt-12 border-t border-border pt-10 md:mt-16 md:pt-14">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
            You may also like
          </h2>
          <p className="mt-1 text-sm text-muted">
            {adaptation
              ? "More adaptations from our catalogue."
              : motabilityMode
                ? "More Motability scooters and wheelchairs."
                : "More scooters and wheelchairs you might consider."}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) =>
              adaptation ? (
                <AdaptationCard key={item.id} product={item} />
              ) : motabilityMode ? (
                <MotabilityProductCard key={item.id} product={item} />
              ) : (
                <ProductCard key={item.id} product={item} />
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
