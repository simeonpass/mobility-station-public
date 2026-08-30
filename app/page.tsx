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
  const x12Images = imagesFor(x12);
  const m4bImages = imagesFor(m4b);
  const heroVideo = x12.video_url && /\.(mp4|webm)(?:\?|$)/i.test(x12.video_url) ? x12.video_url : null;

  const heroImage = imageAt(x12Images, 2);
  const stairImage = imageAt(x12Images, 3);
  const liftImage = imageAt(x12Images, 5);
  const terrainImage = imageAt(x12Images, 6);
  const safetyImage = imageAt(x12Images, 8);
  const lifestyleImage = imageAt(x12Images, 7);
  const lidarImage = imageAt(x12Images, 9);

  return (
    <div className="shop-home x12-led-home">
      <section className="x12-campaign-hero">
        <div className="x12-hero-media" aria-hidden="true">
          {heroVideo ? (
            <video autoPlay muted loop playsInline poster={heroImage}>
              <source src={heroVideo} />
            </video>
          ) : (
            <img src={heroImage} alt="" />
          )}
        </div>
        <div className="x12-hero-shade" />
        <div className="x12-hero-content">
          <p className="x12-kicker">X12 STAIR-CLIMBING MOBILITY</p>
          <h1>Built for the route that changes beneath you.</h1>
          <p className="x12-hero-copy">Stairs, uneven ground and routes that demand more from powered mobility. X12 combines wheel and track drive modes with active seat control in one extraordinary platform.</p>
          <div className="x12-hero-price">
            <span>From</span>
            <strong>{gbp(displayPrice(x12))}</strong>
            <small>with VAT relief</small>
          </div>
          <div className="x12-hero-actions">
            <Link className="shop-button primary" href="/xsto-x12">Shop X12</Link>
            {x12.video_url ? (
              <a className="x12-watch-button" href={x12.video_url} target="_blank" rel="noreferrer"><i>▶</i> Watch it in action</a>
            ) : (
              <a className="x12-watch-button" href="#x12-capability"><i>▶</i> See what it can do</a>
            )}
          </div>
        </div>
        <a className="x12-hero-play" href={x12.video_url || "#x12-capability"} target={x12.video_url ? "_blank" : undefined} rel={x12.video_url ? "noreferrer" : undefined} aria-label="Watch X12 in action"><span>▶</span><b>See X12 in action</b></a>
      </section>

      <section className="x12-feature-grid" id="x12-capability">
        <Link href="/xsto-x12" className="x12-feature-card">
          <div className="x12-feature-copy"><h2>Stair capable.</h2><p>Designed for compatible steps up to 200 mm high.</p></div>
          <img src={stairImage} alt="XSTO X12 negotiating a step" />
          <span>Learn more →</span>
        </Link>
        <Link href="/xsto-x12" className="x12-feature-card">
          <div className="x12-feature-copy"><h2>Reach higher.</h2><p>Powered seat elevation from 490 to 762 mm.</p></div>
          <img src={liftImage} alt="XSTO X12 elevated seating position" />
          <span>Learn more →</span>
        </Link>
        <Link href="/xsto-x12" className="x12-feature-card">
          <div className="x12-feature-copy"><h2>All-terrain freedom.</h2><p>Wheel and track modes for changing ground conditions.</p></div>
          <img src={terrainImage} alt="XSTO X12 travelling outdoors" />
          <span>Learn more →</span>
        </Link>
        <Link href="/xsto-x12" className="x12-feature-card">
          <div className="x12-feature-copy"><h2>Smart & safe.</h2><p>LiDAR-supported collision and anti-fall safety alerts.</p></div>
          <img src={safetyImage} alt="XSTO X12 safety sensing system" />
          <span>Learn more →</span>
        </Link>
      </section>

      <section className="x12-capability-strip" aria-label="X12 key specifications">
        <div><strong>≤200 mm</strong><span>Compatible step height</span></div>
        <div><strong>35 km</strong><span>Flat-ground range</span></div>
        <div><strong>490–762 mm</strong><span>Seat lift range</span></div>
        <div><strong>LiDAR</strong><span>Collision & anti-fall alerts</span></div>
        <div><strong>UK</strong><span>Delivery & after-sales support</span></div>
        <div><strong>0% VAT</strong><span>For eligible customers</span></div>
      </section>

      <section className="x12-editorial-panel">
        <div className="x12-editorial-image"><img src={lifestyleImage} alt="XSTO X12 in an everyday home setting" /></div>
        <div className="x12-editorial-copy">
          <p className="shop-overline">DESIGNED AROUND YOU</p>
          <h2>Independence looks different for everyone.</h2>
          <p>From everyday routines to more demanding routes, X12 is built to adapt around the way you move.</p>
          <ul><li>Adjustable seating and powered lift</li><li>Wheel and track drive configurations</li><li>Indoor and outdoor mobility</li></ul>
          <Link className="shop-button primary" href="/xsto-x12">Discover X12</Link>
        </div>
      </section>

      <section className="x12-safety-panel">
        <div className="x12-safety-copy">
          <p className="shop-overline">TECHNOLOGY THAT PROTECTS</p>
          <h2>See more. Sense more. Move with confidence.</h2>
          <p>X12 combines high-precision sensing with intelligent control to help identify hazards as the environment changes.</p>
          <ul><li>Collision warning support</li><li>Drop-off and anti-fall alerts</li><li>Proximity sensing for changing routes</li></ul>
          <Link className="shop-button secondary" href="/xsto-x12">Explore X12 technology</Link>
        </div>
        <div className="x12-safety-image"><img src={lidarImage} alt="XSTO X12 LiDAR and obstacle sensing" /></div>
      </section>

      <section className="launch-section m4b-premium-launch">
        <div className="launch-media">
          <span className="launch-badge">NEW</span>
          <img src={imageAt(m4bImages, 0)} alt="New XSTO M4B self-balancing powered wheelchair" />
        </div>
        <div className="launch-copy">
          <p className="shop-overline">NEW XSTO M4B</p>
          <h2>The M4, refined.</h2>
          <p>A folding footrest, redesigned front-wheel system and the compact self-balancing XSTO platform.</p>
          <div className="launch-price"><strong>{gbp(displayPrice(m4b))}</strong><span>with VAT relief</span></div>
          <div className="launch-points"><span>Folding footrest</span><span>Electric seat elevation</span><span>Self-balancing control</span></div>
          <div className="shop-actions">
            <Link className="shop-button primary" href="/xsto-m4b">Shop M4B</Link>
            {m4b.manual_url && <a className="shop-text-link" href={m4b.manual_url} target="_blank" rel="noreferrer">User manual ↓</a>}
          </div>
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

      <section className="x12-final-cta">
        <div><p className="shop-overline">READY TO GO FURTHER?</p><h2>Choose the X12 that fits your journey.</h2><p>Compare the X12 and X12 Pro, or explore the complete KLYM range.</p></div>
        <div className="x12-final-actions"><Link className="shop-button primary" href="/xsto-x12">Shop X12</Link><Link className="shop-button secondary" href={`/${x12Pro.slug}`}>Explore X12 Pro</Link></div>
      </section>
    </div>
  );
}
