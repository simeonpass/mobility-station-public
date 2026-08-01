import Link from "next/link";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CatalogImage } from "@/components/product/catalog-image";
import { Hero } from "@/components/sections/hero";
import {
  getProductBySlug,
  primaryImage,
  type ProductListItem,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Book a Demo | Home Demonstrations",
  description:
    "Book a home or branch demonstration for scooters, wheelchairs or vehicle adaptations. Motability demos free; private & adaptation home visits £100 — fully refundable if you place an order.",
  path: "/book-a-demo",
});

export const revalidate = 300;

export default async function BookADemoPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; type?: string; interest?: string }>;
}) {
  const { product: productParam, type, interest } = await searchParams;
  const productSlug = productParam?.trim() || undefined;

  let product: ProductListItem | null = null;
  if (productSlug) {
    try {
      product = await getProductBySlug(productSlug);
    } catch (error) {
      console.error("Demo product lookup failed", error);
    }
  }

  const defaultInterest = product
    ? `Demo: ${product.name}`
    : interest?.trim()
      ? `Demo: ${interest.trim()}`
      : type === "adaptation"
        ? "Vehicle adaptation demonstration"
        : "";

  return (
    <>
      <Hero
        compact
        title="Book a demonstration"
        subtitle={
          product
            ? `Book a demo for ${product.name} — at home or at Heathrow / Ferndown.`
            : "Try scooters, wheelchairs or adaptations at home or at our Heathrow and Ferndown branches."
        }
        primaryHref="#form"
        primaryLabel="Start booking"
      />
      <section id="form" className="pb-10 md:pb-12">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            {product ? (
              <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-white">
                <div className="relative aspect-[16/10] bg-soft">
                  <CatalogImage
                    src={primaryImage(product)}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 1024px) 30vw, 90vw"
                  />
                </div>
                <div className="border-t border-border p-4">
                  <h2 className="text-lg font-extrabold text-primary">
                    {product.name}
                  </h2>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-2 inline-flex text-sm font-semibold text-primary underline underline-offset-2"
                  >
                    View product details
                  </Link>
                </div>
              </div>
            ) : null}
            <h2 className="text-2xl font-extrabold">Demo options</h2>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
              <li>
                <strong className="text-primary">Branch demonstration:</strong>{" "}
                always free at Heathrow or Ferndown.
              </li>
              <li>
                <strong className="text-primary">
                  Motability home demonstration:
                </strong>{" "}
                free for Motability scooter and wheelchair packages.
              </li>
              <li>
                <strong className="text-primary">
                  Private / adaptation home demonstration:
                </strong>{" "}
                £100 visit fee
                <a
                  href="#demo-terms"
                  className="font-semibold text-primary"
                  aria-describedby="demo-terms"
                >
                  *
                </a>
                , fully refundable if you go ahead and place an order.
              </li>
              <li>
                We come to you so you can try equipment where you live, park and
                get around every day.
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Need a price instead?{" "}
              <Link
                href={
                  product
                    ? `/quote?product=${encodeURIComponent(product.slug)}`
                    : "/quote"
                }
                className="font-semibold text-primary underline underline-offset-2"
              >
                Request a quotation
              </Link>
              ,{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary underline underline-offset-2"
              >
                contact the team
              </Link>{" "}
              or{" "}
              <Link
                href="/book-a-service"
                className="font-semibold text-primary underline underline-offset-2"
              >
                book a service
              </Link>
              .
            </p>
          </div>
          <div className="rounded-lg bg-soft p-6 md:p-8">
            <EnquiryForm
              enquiryType="demo"
              title="Request your demonstration"
              defaultInterest={defaultInterest}
              productSlug={product?.slug ?? productSlug}
            />
          </div>
        </div>
      </section>

      <section
        id="demo-terms"
        className="border-t border-border bg-soft py-10 md:py-12"
      >
        <div className="container-site max-w-3xl">
          <h2 className="text-lg font-extrabold text-primary">
            * Home demonstration terms
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-foreground">Free home demonstrations</strong>{" "}
              apply to Motability scooter and wheelchair assessments.
            </p>
            <p>
              Home demonstrations for{" "}
              <strong className="text-foreground">vehicle adaptations</strong>{" "}
              and{" "}
              <strong className="text-foreground">
                private (non-Motability) scooters and wheelchairs
              </strong>{" "}
              carry a <strong className="text-foreground">£100</strong> visit
              fee. This is fully refundable if you proceed and place an order
              with us.
            </p>
            <p>
              Branch demonstrations at Heathrow and Ferndown remain free.
              We&apos;ll confirm the right option when we book your visit.
            </p>
            <p>
              See also our{" "}
              <Link
                href="/terms"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
