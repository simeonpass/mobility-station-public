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
  return product.shortName === "M4B"
    ? Array.from(new Set([...m4bCampaignImages, ...productImages(product)]))
    : productImages(product);
}

function imageAt(images: string[], index: number) {
  return images[index] ?? images[0];
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
  "X12 Pro": "The flagship XSTO platform",
};

export default async function Home() {
  const products = await getProducts();
  const x12 = products.find((p) => p.shortName === "X12")!;
  const x12Pro = products.find((p) => p.shortName === "X12 Pro")!;
  const m4b = products.find((p) => p.shortName === "M4B")!;
  const m4Pro = products.find((p) => p.shortName === "M4 Pro")!;
  const x12Images = imagesFor(x12);
  const x12ProImages = imagesFor(x12Pro);
  const m4bImages = imagesFor(m4b);
  const m4ProImages = imagesFor(m4Pro);

  return (
    <div className="shop-home">
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="shop-overline">XSTO X12</p>
          <h1>Beyond ordinary.</h1>
          <p className="shop-hero-lede">Stairs, changing terrain and routes that ask more from powered mobility. Meet the X12.</p>
          <div className="shop-price-row">
            <div><small>From</small><strong>{gbp(displayPrice(x12))}</strong><span>with VAT relief</span></div>
            <p>VAT relief is subject to eligibility.</p>
          </div>
          <div className="shop-actions">
            <Link className="shop-button primary" href="/xsto-x12">Shop X12</Link>
            <Link className="shop-button secondary" href="/xsto-x12-pro">Explore X12 Pro</Link>
          </div>
          <div className="shop-hero-meta">
            <span>Stair-capable platform</span>
            <span>All-terrain drive modes</span>
            <span>UK sales & support</span>
          </div>
        </div>
        <div className="shop-hero-product">
          <div className="shop-product-stage">
            <span className="shop-stage-badge">X12 · STAIR CLIMBING · ALL TERRAIN</span>
            <img src={imageAt(x12Images, 0)} alt="XSTO X12 stair-climbing all-terrain mobility robot" />
          </div>
        </div>
      </section>

      <section className="launch-section">
        <div className="launch-media">
          <span className="launch-badge">NEW</span>
          <img src={imageAt(m4bImages, 0)} alt="New XSTO M4B self-balancing powered wheelchair" />
        </div>
        <div className="launch-copy">
          <p className="shop-overline">XSTO M4B</p>
          <h2>New M4B. The M4, refined.</h2>
          <p>A folding footrest, redesigned front-wheel system and the compact self-balancing XSTO platform.</p>
          <div className="launch-price"><strong>{gbp(displayPrice(m4b))}</strong><span>with VAT relief</span></div>
          <div className="launch-points"><span>Folding footrest</span><span>Electric seat elevation</span><span>Self-balancing control</span></div>
          <div className="shop-actions">
            <Link className="shop-button primary" href="/xsto-m4b">Shop M4B</Link>
            {m4b.manual_url && <a className="shop-text-link" href={m4b.manual_url} target="_blank" rel="noreferrer">User manual ↓</a>}
          </div>
        </div>
      </section>

      <section className="visual-story-section" aria-label="Explore XSTO product photography">
        <Link href="/xsto-x12" className="visual-tile visual-tile-large">
          <img src={imageAt(x12Images, 2)} alt="XSTO X12 all-terrain stair-climbing detail" />
          <div className="visual-tile-copy"><span>X12</span><h2>Made for more demanding routes.</h2><b>Explore X12 →</b></div>
        </Link>
        <div className="visual-tile-stack">
          <Link href="/xsto-m4b" className="visual-tile">
            <img src={imageAt(m4bImages, 1)} alt="XSTO M4B premium product view" />
            <div className="visual-tile-copy dark-copy"><span>NEW M4B</span><h3>Designed around everyday use.</h3><b>Explore M4B →</b></div>
          </Link>
          <Link href="/xsto-m4-pro" className="visual-tile">
            <img src={imageAt(m4ProImages, 3)} alt="XSTO M4 Pro premium seating detail" />
            <div className="visual-tile-copy dark-copy"><span>M4 PRO</span><h3>Comfort, elevated.</h3><b>Explore M4 Pro →</b></div>
          </Link>
        </div>
      </section>

      <section className="collection-section" id="range">
        <div className="collection-heading">
          <div><p className="shop-overline">THE RANGE</p><h2>Choose your XSTO.</h2></div>
          <Link href="/compare">Compare all models →</Link>
        </div>
        <div className="shop-product-grid">
          {products.map((product) => {
            const badge = labels[product.shortName];
            return (
              <Link href={`/${product.slug}`} className="shop-product-card" key={product.slug}>
                <div className="shop-card-media">
                  {badge && <span className="shop-card-badge">{badge}</span>}
                  <img src={imageAt(imagesFor(product), 0)} alt={product.name} />
                </div>
                <div className="shop-card-body">
                  <div><h3>{product.shortName}</h3><p>{subtitles[product.shortName]}</p></div>
                  <div className="shop-card-price"><strong>{gbp(displayPrice(product))}</strong><small>with VAT relief</small></div>
                </div>
                <span className="shop-card-link">Learn more →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="shop-value-strip">
        <div><strong>VAT relief available</strong><span>0% VAT for eligible customers</span></div>
        <div><strong>Nationwide delivery</strong><span>UK delivery options across the range</span></div>
        <div><strong>Product manuals</strong><span>Downloads on individual product pages</span></div>
        <div><strong>UK after-sales support</strong><span>Backed by Mobility Station</span></div>
      </section>

      <section className="premium-feature-banner">
        <div className="premium-banner-copy">
          <p className="shop-overline light">X12 PRO</p>
          <h2>More comfort. More control.</h2>
          <p>The flagship XSTO combines the X12 wheel-track platform with the highest-specification seating and adjustment package in the range.</p>
          <Link className="shop-button light" href="/xsto-x12-pro">Explore X12 Pro</Link>
        </div>
        <div className="premium-banner-media"><img src={imageAt(x12ProImages, 4)} alt="XSTO X12 Pro" /></div>
      </section>

      <section className="shop-compare-section">
        <div><p className="shop-overline">COMPARE</p><h2>Which XSTO is right for you?</h2><p>See the five models side by side, including prices, key differences and intended use.</p></div>
        <Link className="shop-button primary" href="/compare">Compare models</Link>
      </section>
    </div>
  );
}
