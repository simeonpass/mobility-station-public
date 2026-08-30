import Link from "next/link";
import { displayPrice, gbp, getProducts, productImages } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const featureStrip = [
  ["◎", "Self balancing", "Stable, controlled movement"],
  ["↕", "Electric seat lift", "Rise to a useful height"],
  ["⌁", "Folds for transport", "Designed for everyday travel"],
  ["360°", "Omnidirectional", "Move precisely in tight spaces"],
];

export default async function Home() {
  const products = await getProducts();
  const m4b = products.find((p) => p.shortName === "M4B")!;
  const m4bImages = productImages(m4b);
  const shot = (index: number) => m4bImages[index] ?? m4bImages[0];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>NEW</span> XSTO M4B</div>
          <h1>Move <em>differently.</em></h1>
          <p className="hero-lede">Self-balancing mobility, redesigned around everyday independence. Meet the XSTO M4B with redesigned front wheels and an integrated folding footrest.</p>
          <div className="mini-features">{featureStrip.map(([icon,title]) => <div key={title}><b>{icon}</b><span>{title}</span></div>)}</div>
          <div className="hero-price"><small>From</small><strong>{gbp(displayPrice(m4b))}</strong><span>with VAT relief</span></div>
          <div className="cta-row"><Link className="btn blue" href="/xsto-m4b">Explore M4B →</Link><Link className="btn outline" href="/book-a-demo">Book a demonstration</Link></div>
          <div className="trust-line"><span>● Available now</span><span>✓ UK delivery</span><span>✓ UK warranty & support</span></div>
        </div>
        <div className="hero-media">
          <div className="halo" />
          <img src={shot(0)} alt="XSTO M4B self-balancing powered wheelchair" />
          <div className="new-cards"><div><b>Integrated folding footrest</b><small>NEW</small></div><div><b>Redesigned front-wheel system</b><small>NEW</small></div></div>
        </div>
      </section>

      <section className="feature-strip">{featureStrip.map(([icon,title,text]) => <div key={title}><b>{icon}</b><span><strong>{title}</strong><small>{text}</small></span></div>)}</section>

      <section className="dark-showcase">
        <div className="orbital"><div className="chair-orbit"><img src={shot(1)} alt="XSTO M4B front-wheel and self-balancing design" /></div></div>
        <div className="showcase-copy"><p className="eyebrow plain">ADVANCED XSTO TECHNOLOGY</p><h2>This isn’t a wheelchair as you know it.</h2><p>Self-balancing control works continuously beneath you, while the compact wheel layout is designed for precise movement indoors and confident everyday use outdoors.</p><Link href="/self-balancing-wheelchairs" className="btn ghost">Discover self-balancing →</Link></div>
      </section>

      <section className="rise-section">
        <div><p className="eyebrow plain">ELECTRIC ELEVATION</p><h2>Rise above.</h2><p>Raise the M4B seat from 347 mm to 650 mm. Get closer to worktops, tables and eye-level conversations without giving up the compact XSTO footprint.</p><Link className="text-link" href="/xsto-m4b">See every M4B feature →</Link></div>
        <div className="rise-visual"><img src={shot(2)} alt="XSTO M4B electric seat elevation" /><div className="measure"><span>650 mm</span><i /></div></div>
      </section>

      <section className="m4b-detail-band">
        <div className="detail-media"><img src={shot(3)} alt="XSTO M4B integrated folding footrest" /></div>
        <div className="detail-copy"><p className="eyebrow plain">NEW M4B DESIGN</p><h2>Made easier to live with.</h2><p>The integrated folding footrest moves neatly away for transfers and transport. Revised front-wheel hardware gives the M4B its own, updated stance while retaining the M4 platform’s compact movement.</p><div className="detail-points"><span>Folding footrest</span><span>Redesigned front wheels</span><span>Compact transport</span></div><Link className="btn blue" href="/xsto-m4b">View the M4B gallery →</Link></div>
      </section>

      <section className="m4b-image-strip" aria-label="XSTO M4B product gallery">
        {[4,5,6].map((index) => <div key={index}><img src={shot(index)} alt={`XSTO M4B product detail ${index - 3}`} /></div>)}
      </section>

      <section className="range-section" id="range">
        <div className="section-heading"><div><p className="eyebrow plain">FIVE MODELS. ONE IDEA.</p><h2>Find your XSTO.</h2></div><Link className="btn outline small" href="/compare">Compare all models →</Link></div>
        <div className="product-grid">{products.map((product) => (
          <Link href={`/${product.slug}`} className={`product-card ${product.shortName === "M4B" ? "featured" : ""}`} key={product.shortName}>
            {product.shortName === "M4B" && <span className="pick">OUR PICK</span>}
            <div className="product-image"><img src={productImages(product)[0]} alt={product.name} /></div>
            <h3>{product.shortName}</h3><p>{product.description?.split(".")[0]}.</p><strong>From {gbp(displayPrice(product))}</strong><small>with VAT relief</small><span className="card-arrow">→</span>
          </Link>
        ))}</div>
      </section>

      <section className="seo-intro">
        <p className="eyebrow plain">KLYM × XSTO</p><h2>Advanced powered mobility, explained properly.</h2>
        <p>KLYM focuses on just five XSTO models: M4, M4B, M4 Pro, X12 and X12 Pro. From compact self-balancing mobility to stair-climbing all-terrain technology, every page is built to make the differences easy to understand.</p>
        <div className="seo-links"><Link href="/self-balancing-wheelchairs">Self-balancing wheelchairs →</Link><Link href="/stair-climbing-wheelchairs">Stair-climbing wheelchairs →</Link><Link href="/vat-relief">VAT relief on powered wheelchairs →</Link></div>
      </section>

      <section className="benefits"><div><b>🇬🇧</b><strong>UK specialist</strong><small>Expert advice & support</small></div><div><b>✓</b><strong>VAT relief</strong><small>0% VAT if eligible</small></div><div><b>▣</b><strong>UK delivery</strong><small>Delivered nationwide</small></div><div><b>◇</b><strong>UK warranty</strong><small>Support after purchase</small></div><div><b>▦</b><strong>Book a demo</strong><small>Try before you choose</small></div></section>

      <section className="final-cta"><p className="eyebrow plain">READY WHEN YOU ARE</p><h2>Try the M4B for yourself.</h2><p>Talk to the KLYM team about availability, VAT relief, delivery or a demonstration.</p><div className="cta-row center"><Link className="btn blue" href="/xsto-m4b">Explore M4B →</Link><Link className="btn outline" href="/book-a-demo">Book a demo</Link></div></section>
    </>
  );
}
