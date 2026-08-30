import Link from "next/link";
import { displayPrice, gbp, getProducts } from "@/lib/catalog";

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
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>NEW</span> XSTO M4B</div>
          <h1>Move <em>differently.</em></h1>
          <p className="hero-lede">Self-balancing mobility, redesigned around everyday independence. Meet the XSTO M4B with new front wheels and a folding footrest.</p>
          <div className="mini-features">{featureStrip.map(([icon,title]) => <div key={title}><b>{icon}</b><span>{title}</span></div>)}</div>
          <div className="hero-price"><small>From</small><strong>{gbp(displayPrice(m4b))}</strong><span>with VAT relief</span></div>
          <div className="cta-row"><Link className="btn blue" href="/xsto-m4b">Buy M4B →</Link><Link className="btn outline" href="/book-a-demo">Book a demonstration</Link></div>
          <div className="trust-line"><span>● In stock</span><span>✓ Free UK delivery</span><span>✓ UK warranty & support</span></div>
        </div>
        <div className="hero-media">
          <div className="halo" />
          <img src={m4b.image_url || undefined} alt="XSTO M4B self-balancing powered wheelchair" />
          <div className="new-cards"><div><b>Folding footrest</b><small>NEW</small></div><div><b>Revised front-wheel design</b><small>NEW</small></div></div>
        </div>
      </section>

      <section className="feature-strip">{featureStrip.map(([icon,title,text]) => <div key={title}><b>{icon}</b><span><strong>{title}</strong><small>{text}</small></span></div>)}</section>

      <section className="dark-showcase">
        <div className="orbital"><div className="chair-orbit"><img src={m4b.image_url || undefined} alt="XSTO M4B turning in a compact space" /></div></div>
        <div className="showcase-copy"><p className="eyebrow plain">ADVANCED XSTO TECHNOLOGY</p><h2>This isn’t a wheelchair as you know it.</h2><p>Self-balancing control works continuously beneath you, while omnidirectional front wheels make precise positioning feel natural.</p><Link href="/self-balancing-wheelchairs" className="btn ghost">Discover self-balancing →</Link></div>
      </section>

      <section className="rise-section">
        <div><p className="eyebrow plain">ELECTRIC ELEVATION</p><h2>Rise above.</h2><p>Raise the M4B seat from 347 mm to 650 mm. Reach worktops, tables and conversations without giving up the compact XSTO footprint.</p><Link className="text-link" href="/xsto-m4b">See the M4B →</Link></div>
        <div className="rise-visual"><img src={m4b.image_url || undefined} alt="XSTO M4B powered seat lift" /><div className="measure"><span>650 mm</span><i /></div></div>
      </section>

      <section className="fold-section">
        <div><p className="eyebrow plain">DESIGNED TO TRAVEL</p><h2>Folds. Goes. Anywhere.</h2><p>The M4B is built around practical transport and a tidier folded footprint, with its new folding footrest moving out of the way when you need it.</p><Link className="btn ghost" href="/book-a-demo">See it for yourself →</Link></div>
        <div className="fold-cards"><span>Drive</span><b>→</b><span>Fold</span><b>→</b><span>Go</span></div>
      </section>

      <section className="range-section" id="range">
        <div className="section-heading"><div><p className="eyebrow plain">FIVE MODELS. ONE IDEA.</p><h2>Find your XSTO.</h2></div><Link className="btn outline small" href="/compare">Compare all models →</Link></div>
        <div className="product-grid">{products.map((product) => (
          <Link href={`/${product.slug}`} className={`product-card ${product.shortName === "M4B" ? "featured" : ""}`} key={product.shortName}>
            {product.shortName === "M4B" && <span className="pick">OUR PICK</span>}
            <div className="product-image"><img src={product.image_url || undefined} alt={product.name} /></div>
            <h3>{product.shortName}</h3><p>{product.description?.split(".")[0]}.</p><strong>From {gbp(displayPrice(product))}</strong><small>with VAT relief</small><span className="card-arrow">→</span>
          </Link>
        ))}</div>
      </section>

      <section className="seo-intro">
        <p className="eyebrow plain">KLYM X XSTO</p><h2>Advanced powered wheelchairs for people who expect more.</h2>
        <p>KLYM specialises in the XSTO M4, M4B, M4 Pro, X12 and X12 Pro. From self-balancing everyday mobility to stair-climbing all-terrain technology, every page is designed to help you understand the difference and choose the right model.</p>
        <div className="seo-links"><Link href="/self-balancing-wheelchairs">Self-balancing wheelchairs →</Link><Link href="/stair-climbing-wheelchairs">Stair-climbing wheelchairs →</Link><Link href="/vat-relief">VAT relief on powered wheelchairs →</Link></div>
      </section>

      <section className="benefits"><div><b>🇬🇧</b><strong>UK specialist</strong><small>Expert advice & support</small></div><div><b>✓</b><strong>VAT relief</strong><small>Save 20% if eligible</small></div><div><b>▣</b><strong>Free delivery</strong><small>UK mainland delivery</small></div><div><b>◇</b><strong>UK warranty</strong><small>Support after purchase</small></div><div><b>▦</b><strong>Book a demo</strong><small>Try before you choose</small></div></section>

      <section className="final-cta"><p className="eyebrow plain">READY WHEN YOU ARE</p><h2>Try the M4B for yourself.</h2><p>Talk to the KLYM team about availability, VAT relief, delivery or a demonstration.</p><div className="cta-row center"><Link className="btn blue" href="/xsto-m4b">Explore M4B →</Link><Link className="btn outline" href="/book-a-demo">Book a demo</Link></div></section>
    </>
  );
}
