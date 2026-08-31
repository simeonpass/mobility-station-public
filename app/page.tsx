import Link from "next/link";
import { displayPrice, gbp, getProducts, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const homepageImages: Record<Product["shortName"], string> = {
  M4: "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_08b2b85a-3166-4b68-a636-b7b3c099d677.webp",
  M4B: "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B.png?v=1784395920",
  "M4 Pro": "https://wgxtyckmxpmrrghpduwm.supabase.co/storage/v1/object/public/product-images/1772057791249-M4_Pro_01.webp",
  X12: "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/x12-all-terrain-mobility-robot-8874875.jpg?v=1770295862",
  "X12 Pro": "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/23a51d87-f0e5-4b38-9005-7abe37927e41.webp",
};

const productCopy: Record<Product["shortName"], { line1: string; line2: string }> = {
  M4: { line1: "Compact self-balancing mobility.", line2: "Everyday freedom." },
  M4B: { line1: "The latest M4 evolution.", line2: "Refined for everyday use." },
  "M4 Pro": { line1: "More comfort. More adjustment.", line2: "Premium M4 mobility." },
  X12: { line1: "Stair-climbing mobility.", line2: "Built for demanding routes." },
  "X12 Pro": { line1: "The flagship XSTO.", line2: "Maximum capability." },
};

export default async function Home() {
  const products = await getProducts();
  const ordered = (["M4", "M4B", "M4 Pro", "X12", "X12 Pro"] as Product["shortName"][])
    .map((name) => products.find((p) => p.shortName === name))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="approved-home">
      <section className="approved-hero">
        <div className="approved-hero-copy">
          <p className="approved-kicker">KLYM · XSTO MOBILITY</p>
          <h1>Extraordinary mobility.<br />Five ways to move.</h1>
          <p>Explore the complete XSTO range — from compact self-balancing mobility to advanced stair-climbing technology.</p>
          <div className="approved-hero-actions">
            <a className="shop-button primary" href="#models">Explore the range <span>→</span></a>
            <Link className="shop-button secondary" href="/compare">Compare all models</Link>
          </div>
        </div>

        <div className="approved-stage" aria-label="The complete XSTO range">
          <div className="stage-ring stage-ring-one" />
          <div className="stage-ring stage-ring-two" />
          <div className="stage-podium stage-podium-left" />
          <div className="stage-podium stage-podium-right" />
          {ordered.map((product) => (
            <Link key={product.slug} href={`/${product.slug}`} className={`stage-model stage-model-${product.slug}`}>
              <span>{product.shortName}</span>
              <img src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />
            </Link>
          ))}
        </div>
      </section>

      <section className="approved-products" id="models" aria-label="Shop XSTO range">
        {ordered.map((product) => {
          const copy = productCopy[product.shortName];
          return (
            <article className="approved-product-card" key={product.slug}>
              <Link className="approved-product-image" href={`/${product.slug}`}>
                <img src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />
              </Link>
              <div className="approved-product-copy">
                <h2>{product.shortName}</h2>
                <p>{copy.line1}<br />{copy.line2}</p>
                <strong>{gbp(displayPrice(product))}</strong>
                <small>with VAT relief</small>
                <Link href={`/${product.slug}`}>View product <span>→</span></Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="approved-compare">
        <p className="shop-overline">THE COMPLETE RANGE</p>
        <h2>Not sure which XSTO is right for you?</h2>
        <p>Compare all five models side by side, then open the individual product page for videos, detailed galleries, specifications, manuals and ordering.</p>
        <Link className="shop-button primary" href="/compare">Compare all models</Link>
      </section>

      <section className="approved-benefits" aria-label="Buying from KLYM">
        <div><strong>VAT relief</strong><span>Available for eligible customers</span></div>
        <div><strong>UK delivery</strong><span>Nationwide delivery options</span></div>
        <div><strong>User manuals</strong><span>Downloads on product pages</span></div>
        <div><strong>UK support</strong><span>After-sales support from Mobility Station</span></div>
      </section>
    </div>
  );
}
