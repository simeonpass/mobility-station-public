import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CatalogImage } from "@/components/product/catalog-image";
import { createMetadata } from "@/lib/seo";
import { isAdaptationProduct } from "@/lib/adaptations";
import {
  getProductBySlug,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";
import {
  interestForCategory,
  interestForProduct,
  quoteSummaryLine,
} from "@/lib/quote";

export const metadata = createMetadata({
  title: "Request a quotation",
  description:
    "Request a tailored quotation for a mobility scooter, wheelchair or vehicle adaptation. We confirm compatibility and a firm price before any work starts.",
  path: "/quote",
});

export const revalidate = 300;

type Search = {
  product?: string;
  category?: string;
  interest?: string;
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { product: productParam, category, interest } = await searchParams;
  const productSlug = productParam?.trim() || undefined;

  let product: ProductListItem | null = null;
  if (productSlug) {
    try {
      product = await getProductBySlug(productSlug);
    } catch (error) {
      console.error("Quote product lookup failed", error);
    }
  }

  const isAdaptation = product ? isAdaptationProduct(product) : Boolean(category);
  const defaultInterest = product
    ? interestForProduct(product)
    : category
      ? interestForCategory(category)
      : interest?.trim() ||
        (isAdaptation
          ? "Vehicle adaptation quotation"
          : "Product quotation");

  const title = product
    ? `Quote for ${product.name}`
    : category
      ? `Quote for ${category}`
      : "Request a quotation";

  const subtitle = product
    ? isAdaptation
      ? "Tell us about your vehicle and we’ll confirm compatibility, Motability options and a firm fitted price."
      : "Tell us what you need and we’ll come back with availability, Motability options and a clear price."
    : isAdaptation
      ? "Tell us your vehicle and what you need fitted — we’ll quote before any work is booked."
      : "Ask for a tailored price on a scooter, wheelchair or adaptation.";

  const messagePlaceholder = isAdaptation
    ? "Vehicle make, model and year (e.g. Ford Fiesta 2019), plus anything else we should know"
    : "Anything we should know — Motability, colours, delivery area, or questions";

  return (
    <div className="container-site py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/55">
          Quotation
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {subtitle}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <aside className="space-y-5">
            {product ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-white">
                <div className="relative aspect-[4/3] bg-soft">
                  <CatalogImage
                    src={primaryImage(product)}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 1024px) 28vw, 90vw"
                  />
                </div>
                <div className="border-t border-border p-5">
                  {product.category ? (
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {product.category}
                    </p>
                  ) : null}
                  <h2 className="mt-1 text-xl font-extrabold text-primary">
                    {product.name}
                  </h2>
                  {product.manufacturer ? (
                    <p className="mt-1 text-sm text-muted">
                      by {product.manufacturer}
                    </p>
                  ) : null}
                  {quoteSummaryLine(product) ? (
                    <p className="mt-3 text-sm font-semibold text-primary">
                      {quoteSummaryLine(product)}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-primary">
                      Price on application
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {isAdaptation
                      ? "Indicative only — your quotation is confirmed against your vehicle before fitting."
                      : "We’ll confirm live stock, options and the final price when we reply."}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-primary underline underline-offset-2"
                  >
                    Back to product details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-soft p-6">
                <h2 className="text-lg font-bold text-primary">
                  What happens next
                </h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/85">
                  <li>We review what you’ve asked for.</li>
                  <li>
                    {isAdaptation
                      ? "We check compatibility with your vehicle."
                      : "We confirm availability and options."}
                  </li>
                  <li>You get a clear quotation by email or phone.</li>
                </ol>
                <p className="mt-5 text-sm text-muted">
                  Prefer to browse first?{" "}
                  <Link
                    href={isAdaptation ? "/vehicle-adaptations" : "/shop"}
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    {isAdaptation ? "View adaptations" : "Browse the shop"}
                  </Link>
                  .
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-primary">No obligation</p>
              <p className="mt-2">
                A quotation is free. For adaptations we never book fitting until
                you’ve accepted a confirmed price for your vehicle.
              </p>
            </div>
          </aside>

          <div className="rounded-2xl border border-border bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="quote"
              title={product ? "Your details" : "Tell us what you need"}
              defaultInterest={defaultInterest}
              productSlug={product?.slug ?? productSlug}
              messagePlaceholder={messagePlaceholder}
              messageLabel={
                isAdaptation ? "Vehicle & notes" : "Message (optional)"
              }
              messageRequired={isAdaptation}
              submitLabel="Request quotation"
              showDate={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
