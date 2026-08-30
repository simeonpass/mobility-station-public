import Link from "next/link";
import { displayPrice, gbp, getProducts, productImages, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const m4bCampaignImages = [
  "/klym/m4b/m4b-hero.webp",
  "/klym/m4b/m4b-front-three-quarter.webp",
  "/klym/m4b/m4b-left-profile.webp",
  "/klym/m4b/m4b-rear-three-quarter.webp",
];

function imagesFor(product: Product) {
  return product.shortName === "M4B" ? m4bCampaignImages : productImages(product);
}

const labels: Partial<Record<Product["shortName"], string>> = {
  M4B: "NEW",
  X12: "STAIR CLIMBER",
  "X12 Pro": "FLAGSHIP",
};

const subtitles: Record<Product["shortName"], string> = {
  M4: "Compact self-balancing mobility",
  M4B: "The latest M4 evolution",
  "M4 Pro": "Premium comfort and adjustment",
  X12: "Stair-climbing all-terrain mobility",
  "X12 Pro": "Flagship all-terrain XSTO",
};

export default async function Home() {
  const products = await getProducts();
  const x12 = products.find((p) => p.shortName === "X12")!;
  const x12Pro = products.find((p) => p.shortName === "X12 Pro")!;
  const m4b = products.find((p) => p.shortName === "M4B")!;
  const x12Images = productImages(x12);
  const m4bImages = imagesFor(m4b);

  return (
    <div className="shop-home">
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="shop-overline">XSTO X12 · STAIR-CLIMBING MOBILITY</p>
          <h1>Go beyond the <span>ordinary.</span></h1>
          <p className="shop-hero-lede">The X12 combines wheels, tracks and active levelling in one extraordinary mobility platform — built for demanding terrain and compatible stairs.</p>
          <div className="shop-price-row">
            <div><small>From</small><strong>{gbp(displayPrice(x12))}</strong><span>with VAT relief</span></div>
            <p>VAT relief is subject to eligibility.</p>
          </div>
          <div className="shop-actions">
            <Link className="shop-button primary" href="/xsto-x12">Shop X12</Link>
            <Link className="shop-button secondary" href="/xsto-x12-pro">View X12 Pro</Link>
          </div>
          <div className="shop-hero-meta">
            <span>Stair-capable platform</span>
            <span>All-terrain drive modes</span>
            <span>UK sales & support</span>
          </div>
        </div>
        <div className="shop-hero-product">
          <div className="shop-product-stage">
            <span className="shop-stage-badge">X12</span>
            <img src={x12Images[0]} alt="XSTO X12 stair-climbing all-terrain mobility robot" />
          </div>
        </div>
      </section>

      <section className="launch-section">
        <div className="launch-media">
          <span className="launch-badge">NEW M4B</span>
          <img src={m4bImages[0]} alt="New XSTO M4B self-balancing powered wheelchair" />
        </div>
        <div className="launch-copy">
          <p className="shop-overline">NEW PRODUCT LAUNCH</p>
          <h2>The M4, refined for everyday life.</h2>
          <p>Meet the new M4B with a folding footrest, redesigned front-wheel system and the compact self-balancing XSTO platform.</p>
          <div className="launch-price"><strong>{gbp(displayPrice(m4b))}</strong><span>with VAT relief</span></div>
          <div className="launch-points"><span>Folding footrest</span><span>Electric seat elevation</span><span>Self-balancing control</span></div>
          <div className="shop-actions">
            <Link className="shop-button primary" href="/xsto-m4b">Shop M4B</Link>
            {m4b.manual_url && <a className="shop-text-link" href={m4b.manual_url} target="_blank" rel="noreferrer">Download user manual ↓</a>}
          </div>
        </div>
      </section>

      <section className="collection-section" id="range">
        <div className="collection-heading">
          <div><p className="shop-overline">SHOP THE RANGE</p><h2>Choose your XSTO.</h2></div>
          <Link href="/compare">Compare all models →</Link>
        </div>
        <div className="shop-product-grid">
          {products.map((product) => {
            const badge = labels[product.shortName];
            return (
              <Link href={`/${product.slug}`} className="shop-product-card" key={product.slug}>
                <div className="shop-card-media">
                  {badge && <span className="shop-card-badge">{badge}</span>}
                  <img src={imagesFor(product)[0]} alt={product.name} />
                </div>
                <div className="shop-card-body">
                  <div><h3>{product.shortName}</h3><p>{subtitles[product.shortName]}</p></div>
                  <div className="shop-card-price"><strong>{gbp(displayPrice(product))}</strong><small>with VAT relief</small></div>
                </div>
                <span className="shop-card-link">View product →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="shop-value-strip">
        <div><strong>VAT relief available</strong><span>0% VAT for eligible customers</span></div>
        <div><strong>Nationwide delivery</strong><span>UK delivery options across the range</span></div>
        <div><strong>Product manuals</strong><span>Downloads available on product pages</span></div>
        <div><strong>UK after-sales support</strong><span>Backed by Mobility Station</span></div>
      </section>

      <section className="premium-feature-banner">
        <div className="premium-banner-copy">
          <p className="shop-overline light">X12 PRO</p>
          <h2>More comfort. Same extraordinary capability.</h2>
          <p>The flagship XSTO combines the X12 wheel-track platform with the highest-specification seating and adjustment package in the range.</p>
          <Link className="shop-button light" href="/xsto-x12-pro">Shop X12 Pro</Link>
        </div>
        <div className="premium-banner-media"><img src={productImages(x12Pro)[0]} alt="XSTO X12 Pro" /></div>
      </section>

      <section className="shop-compare-section">
        <div><p className="shop-overline">NOT SURE WHICH MODEL?</p><h2>Compare the complete XSTO range.</h2><p>See prices, key differences and where each model sits in the range before you choose.</p></div>
        <Link className="shop-button primary" href="/compare">Compare XSTO models</Link>
      </section>
    </div>
  );
}
