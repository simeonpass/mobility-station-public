import Link from "next/link";
import { ClearanceBrowser } from "@/components/product/clearance-browser";
import { CatalogIntro } from "@/components/sections/catalog-intro";
import { CtaFooter } from "@/components/sections/cta-footer";
import {
  CONDITION_GRADES,
  getPublishedProducts,
  isUsedCondition,
  type ProductListItem,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Clearance scooters & wheelchairs",
  description:
    "Ex-demo, refurbished and pre-owned mobility scooters graded A–C by our team at Heathrow & Ferndown. Honest condition, clear prices.",
  path: "/clearance",
});

export default async function ClearancePage() {
  let products: ProductListItem[] = [];
  try {
    const all = await getPublishedProducts({ limit: 500, shopOnly: true });
    products = all.filter((p) => isUsedCondition(p.condition));
  } catch (error) {
    console.error("Clearance catalogue error:", error);
  }

  return (
    <>
      <CatalogIntro
        title="Clearance & pre-owned"
        subtitle="Ex-demo, refurbished and pre-owned scooters and wheelchairs — graded A to C by our engineers so you know what you’re buying."
        primary={{ href: "/book-a-demo", label: "Book a Demo" }}
        secondary={{
          href: "/contact?interest=callback#callback",
          label: "Ask about a model",
        }}
      />

      <section className="border-b border-border bg-soft/60 py-10 md:py-12">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
              Our clearance grades
            </h2>
            <p className="mt-2 text-sm text-muted md:text-base">
              Every clearance machine is inspected before sale. The grade tells
              you about looks and age — not whether it’s safe to use.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {CONDITION_GRADES.map((g) => (
              <li
                key={g.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Grade {g.id}
                </p>
                <h3 className="mt-1 text-lg font-extrabold text-primary">
                  {g.short}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {g.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            You’ll also see whether it’s{" "}
            <strong className="font-semibold text-primary">Ex-Demo</strong>,{" "}
            <strong className="font-semibold text-primary">Refurbished</strong>{" "}
            or{" "}
            <strong className="font-semibold text-primary">Pre-Owned</strong> —
            that’s how it came to us. Ask about warranty on the day of your demo.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container-site">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
                Available now
              </h2>
              <p className="mt-1 text-sm text-muted">
                {products.length
                  ? `${products.length} clearance ${products.length === 1 ? "item" : "items"}`
                  : "Stock changes often — call us if you need something specific."}
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-primary underline underline-offset-2"
            >
              Browse full shop
            </Link>
          </div>

          {products.length ? (
            <ClearanceBrowser products={products} />
          ) : (
            <p className="rounded-2xl border border-border bg-soft/50 px-5 py-8 text-sm text-muted">
              No clearance items are listed right now. Check back soon, browse the{" "}
              <Link
                href="/shop"
                className="font-semibold text-primary underline underline-offset-2"
              >
                full shop
              </Link>
              , or{" "}
              <Link
                href="/contact?interest=callback#callback"
                className="font-semibold text-primary underline underline-offset-2"
              >
                request a callback
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <CtaFooter
        title="Want to try a clearance model?"
        subtitle="Book a home or branch demonstration — we’ll talk through grade, condition and warranty before you decide."
      />
    </>
  );
}
