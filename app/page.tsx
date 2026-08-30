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
  return images[index] ?? images[0] ?? "";
}

const productCopy: Record<Product["shortName"], { eyebrow: string; title: string; description: string; badge?: string }> = {
  M4: {
    eyebrow: "SELF-BALANCING",
    title: "Compact. Capable. Original.",
    description: "The original XSTO M4 with self-balancing control, electric seat elevation and precise everyday manoeuvrability.",
  },
  M4B: {
    eyebrow: "NEW M4B",
    title: "The M4, refined.",
    description: "The latest M4 configuration with a folding footrest, redesigned front-wheel system and compact self-balancing control.",
    badge: "NEW",
  },
  "M4 Pro": {
    eyebrow: "M4 PRO",
    title: "More comfort. More adjustment.",
    description: "The self-balancing M4 platform with a higher-specification seating and support package.",
  },
  X12: {
    eyebrow: "STAIR-CLIMBING",
    title: "Built for more demanding routes.",
    description: "Wheel and track mobility, powered seat adjustment and specialist capability for compatible stairs and changing terrain.",
    badge: "STAIR CLIMBER",
  },
  "X12 Pro": {
    eyebrow: "X12 PRO",
    title: "The flagship XSTO.",
    description: "The advanced X12 platform with the highest-specification comfort and powered adjustment package in the range.",
    badge: "FLAGSHIP",
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
        <p className="range-kicker">KLYM · XSTO MOBILITY</p>
        <h1>Five models. One extraordinary range.</h1>
        <p className="range-hero-copy">Choose the XSTO that fits the way you want to move. Explore each model, compare the range, then buy with UK delivery and support.</p>
        <div className="range-hero-actions">
          <a className="shop-button primary" href="#models">Explore the range</a>
          <Link className="shop-button secondary" href="/compare">Compare all models</Link>
        </div>
      </section>

      <section className="model-showcase" id="models" aria-label="XSTO product range">
        {ordered.map((product) => {
          const copy = productCopy[product.shortName];
          const image = imageAt(imagesFor(product), 0);
          return (
            <article className="model-showcase-card" key={product.slug}>
              <Link href={`/${product.slug}`} className="model-media" aria-label={`Explore XSTO ${product.shortName}`}>
                {copy.badge && <span className="model-badge">{copy.badge}</span>}
                <img src={image} alt={`XSTO ${product.shortName}`} />
              </Link>
              <div className="model-card-copy">
                <p className="model-eyebrow">{copy.eyebrow}</p>
                <h2>{product.shortName}</h2>
                <h3>{copy.title}</h3>
                <p>{copy.description}</p>
                <div className="model-price"><strong>{gbp(displayPrice(product))}</strong><span>with VAT relief</span></div>
                <div className="model-actions">
                  <Link className="shop-button primary" href={`/${product.slug}`}>Explore {product.shortName}</Link>
                  <Link className="model-text-link" href={`/compare`}>Compare →</Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="family-intro">
        <div className="family-heading">
          <p className="shop-overline">FIND YOUR FIT</p>
          <h2>Two families. Five ways to move.</h2>
          <p>If you already know the model, choose it above. If not, start with the kind of mobility you need.</p>
        </div>
        <div className="family-grid">
          <Link href="/self-balancing-wheelchairs" className="family-card family-m4">
            <div className="family-copy"><span>M4 SERIES</span><h3>Self-balancing everyday mobility.</h3><p>M4, M4B and M4 Pro combine a compact footprint with active balancing and powered seat elevation.</p><b>Explore the M4 Series →</b></div>
            <div className="family-products">
              <img src={imageAt(imagesFor(m4), 1)} alt="XSTO M4" />
              <img src={imageAt(imagesFor(m4b), 1)} alt="XSTO M4B" />
              <img src={imageAt(imagesFor(m4Pro), 1)} alt="XSTO M4 Pro" />
            </div>
          </Link>
          <Link href="/stair-climbing-wheelchairs" className="family-card family-x12">
            <div className="family-copy"><span>X12 SERIES</span><h3>Stair-climbing and all-terrain mobility.</h3><p>X12 and X12 Pro combine wheel and track modes with specialist capability for compatible stairs and changing terrain.</p><b>Explore the X12 Series →</b></div>
            <div className="family-products two">
              <img src={imageAt(imagesFor(x12), 1)} alt="XSTO X12" />
              <img src={imageAt(imagesFor(x12Pro), 1)} alt="XSTO X12 Pro" />
            </div>
          </Link>
        </div>
      </section>

      <section className="balanced-benefits" aria-label="Buying from KLYM">
        <div><strong>VAT relief available</strong><span>0% VAT for eligible customers</span></div>
        <div><strong>Nationwide delivery</strong><span>UK delivery options across the range</span></div>
        <div><strong>User manuals</strong><span>Product downloads on individual pages</span></div>
        <div><strong>UK after-sales support</strong><span>Backed by Mobility Station</span></div>
      </section>

      <section className="compare-home-panel">
        <div>
          <p className="shop-overline">COMPARE THE RANGE</p>
          <h2>Not sure which XSTO is right for you?</h2>
          <p>See all five models side by side, including prices, key differences and intended use.</p>
        </div>
        <Link className="shop-button primary" href="/compare">Compare all five models</Link>
      </section>
    </div>
  );
}
