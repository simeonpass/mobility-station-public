import Link from "next/link";
import { displayPrice, gbp, getProducts, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const homepageImages: Record<Product["shortName"], string> = {
  M4: "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_08b2b85a-3166-4b68-a636-b7b3c099d677.webp",
  M4B: "https://cdn.shopify.com/s/files/1/0904/4541/4778/files/M4B.png?v=1784395920",
  "M4 Pro": "https://wgxtyckmxpmrrghpduwm.supabase.co/storage/v1/object/public/product-images/1772057791249-M4_Pro_01.webp",
  X12: "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/sq_81b50b59-109d-4159-8c8f-a123e932c944.webp",
  "X12 Pro": "https://pub-d0fa88fa71f044d9a9fc37a3c9d5fe47.r2.dev/stock-images/23a51d87-f0e5-4b38-9005-7abe37927e41.webp",
};

const productCopy: Record<Product["shortName"], { eyebrow: string; title: string; description: string; badge?: string }> = {
  M4: {
    eyebrow: "SELF-BALANCING MOBILITY",
    title: "Compact. Capable. Original.",
    description: "The original XSTO M4 combines self-balancing control, electric seat elevation and precise everyday manoeuvrability.",
  },
  M4B: {
    eyebrow: "NEW",
    title: "The M4, refined.",
    description: "The latest M4 evolution, with a redesigned front-wheel system and integrated folding footrest.",
    badge: "NEW",
  },
  "M4 Pro": {
    eyebrow: "PREMIUM COMFORT",
    title: "More comfort. More adjustment.",
    description: "The M4 platform with enhanced seating, adjustment and support for customers who want more from everyday mobility.",
  },
  X12: {
    eyebrow: "STAIR-CLIMBING MOBILITY",
    title: "Go beyond the pavement.",
    description: "Advanced wheel-and-track mobility designed for stairs, changing terrain and more demanding routes.",
  },
  "X12 Pro": {
    eyebrow: "FLAGSHIP",
    title: "The ultimate XSTO.",
    description: "The advanced X12 platform with the highest-specification seating, comfort and powered adjustment package in the range.",
  },
};

export default async function Home() {
  const products = await getProducts();
  const m4 = products.find((p) => p.shortName === "M4")!;
  const m4b = products.find((p) => p.shortName === "M4B")!;
  const m4Pro = products.find((p) => p.shortName === "M4 Pro")!;
  const x12 = products.find((p) => p.shortName === "X12")!;
  const x12Pro = products.find((p) => p.shortName === "X12 Pro")!;
  const ordered = [m4, m4b, m4Pro, x12, x12Pro];

  return (
    <div className="balanced-home">
      <section className="range-hero">
        <div className="range-hero-copy-block">
          <p className="range-kicker">KLYM · XSTO MOBILITY</p>
          <h1>Extraordinary mobility.<span>Five ways to move.</span></h1>
          <p className="range-hero-copy">Explore the complete XSTO range — from compact self-balancing mobility to advanced stair-climbing technology.</p>
          <div className="range-hero-actions">
            <a className="shop-button primary" href="#models">Explore the range</a>
            <Link className="shop-button secondary" href="/compare">Compare all models</Link>
          </div>
        </div>

        <div className="range-family-stage" aria-label="The five XSTO models">
          {ordered.map((product) => (
            <Link className={`family-stage-product family-stage-${product.slug}`} href={`/${product.slug}`} key={product.slug}>
              <img src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />
              <span>{product.shortName}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="range-products" id="models">
        <div className="range-section-heading">
          <p className="shop-overline">THE XSTO RANGE</p>
          <h2>Find the one that fits you.</h2>
          <p>Five distinct models. One straightforward route to the product that suits the way you want to move.</p>
        </div>

        <div className="model-showcase" aria-label="XSTO product range">
          {ordered.map((product) => {
            const copy = productCopy[product.shortName];
            return (
              <article className="model-showcase-card" key={product.slug}>
                <Link href={`/${product.slug}`} className="model-media" aria-label={`Explore XSTO ${product.shortName}`}>
                  {copy.badge && <span className="model-badge">{copy.badge}</span>}
                  <img src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />
                </Link>
                <div className="model-card-copy">
                  <p className="model-eyebrow">{copy.eyebrow}</p>
                  <h2>{product.shortName}</h2>
                  <h3>{copy.title}</h3>
                  <p>{copy.description}</p>
                  <div className="model-price"><strong>{gbp(displayPrice(product))}</strong><span>with VAT relief</span></div>
                  <Link className="model-primary-link" href={`/${product.slug}`}>Explore {product.shortName} <span>→</span></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="family-intro">
        <div className="family-heading">
          <p className="shop-overline">CHOOSE YOUR PLATFORM</p>
          <h2>Two families. Five ways to move.</h2>
        </div>
        <div className="family-grid">
          <Link href="/self-balancing-wheelchairs" className="family-card family-m4">
            <div className="family-copy">
              <span>M4 SERIES</span>
              <h3>Compact intelligence.</h3>
              <p>Self-balancing powered mobility designed around everyday movement, manoeuvrability and independence.</p>
              <b>M4 · M4B · M4 Pro</b>
              <em>Explore the M4 Series →</em>
            </div>
            <div className="family-products">
              {[m4, m4b, m4Pro].map((product) => <img key={product.slug} src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />)}
            </div>
          </Link>

          <Link href="/stair-climbing-wheelchairs" className="family-card family-x12">
            <div className="family-copy">
              <span>X12 SERIES</span>
              <h3>Go further.</h3>
              <p>Wheel-and-track mobility engineered for customers who need capability beyond a conventional powered wheelchair.</p>
              <b>X12 · X12 Pro</b>
              <em>Explore the X12 Series →</em>
            </div>
            <div className="family-products two">
              {[x12, x12Pro].map((product) => <img key={product.slug} src={homepageImages[product.shortName]} alt={`XSTO ${product.shortName}`} />)}
            </div>
          </Link>
        </div>
      </section>

      <section className="compare-home-panel">
        <div>
          <p className="shop-overline">COMPARE</p>
          <h2>Not sure which XSTO is right for you?</h2>
          <p>Compare all five models side-by-side, including pricing, key features, intended use and important differences.</p>
        </div>
        <Link className="shop-button primary" href="/compare">Compare all models</Link>
      </section>

      <section className="balanced-benefits" aria-label="Buying from KLYM">
        <div><strong>VAT relief available</strong><span>Eligible customers can purchase qualifying mobility products without VAT.</span></div>
        <div><strong>UK delivery</strong><span>Nationwide delivery options across the XSTO range.</span></div>
        <div><strong>User manuals</strong><span>Manuals and product information available directly from each product page.</span></div>
        <div><strong>UK after-sales support</strong><span>Sales and ongoing support from Mobility Station.</span></div>
      </section>

      <section className="range-final-cta">
        <p className="shop-overline">KLYM · XSTO</p>
        <h2>Ready to find your XSTO?</h2>
        <p>Explore each model in detail or compare the complete range side-by-side.</p>
        <div className="range-final-actions">
          <a className="shop-button primary" href="#models">Shop the range</a>
          <Link className="shop-button secondary" href="/compare">Compare models</Link>
        </div>
      </section>
    </div>
  );
}
