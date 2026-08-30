import type { Metadata } from "next";
import Link from "next/link";
import { displayPrice, gbp, getProducts, productImages } from "@/lib/catalog";

export const dynamic="force-dynamic";
export const metadata: Metadata={title:"Compare XSTO M4, M4B, M4 Pro, X12 & X12 Pro | KLYM",description:"Compare the five core XSTO powered mobility models available from KLYM Mobility."};

const bestFor: Record<string,string>={
  "M4":"Compact everyday self-balancing mobility",
  "M4B":"The latest M4 design for everyday use",
  "M4 Pro":"Greater seating support and adjustment",
  "X12":"Advanced terrain and compatible stair access",
  "X12 Pro":"Flagship all-terrain comfort and control",
};

const signatures: Record<string,string[]>={
  "M4":["Self balancing","Electric seat elevation","Omnidirectional movement"],
  "M4B":["Folding footrest","Redesigned front wheels","Electric seat elevation"],
  "M4 Pro":["Premium seating","Head support","Self balancing"],
  "X12":["Wheel-track chassis","Dynamic levelling","LiDAR safety"],
  "X12 Pro":["Wheel-track chassis","Electric legrest","LiDAR safety"],
};

export default async function Compare(){
  const products=await getProducts();
  return <main className="page-shell">
    <section className="page-hero"><p className="eyebrow plain">COMPARE XSTO</p><h1>Choose the right model.</h1><p>Compare the M4, M4B, M4 Pro, X12 and X12 Pro by price, purpose and key features before you buy.</p></section>

    <section className="compare-card-section">
      <div className="compare-card-grid">{products.map(p=><Link href={`/${p.slug}`} className={`compare-model-card ${p.shortName==="M4B"?"recommended":""}`} key={p.shortName}>{p.shortName==="M4B"&&<span className="compare-pick">NEW M4B</span>}<div className="compare-model-image"><img src={productImages(p)[0]} alt={p.name}/></div><h2>{p.shortName}</h2><p>{bestFor[p.shortName]}</p><strong>{gbp(displayPrice(p))}</strong><small>with VAT relief</small><div className="signature-list">{signatures[p.shortName].map(item=><span key={item}>✓ {item}</span>)}</div><b className="compare-view">Shop {p.shortName} →</b></Link>)}</div>
    </section>

    <section className="content-section compare-detail-section"><div className="section-heading"><div><p className="eyebrow plain">SIDE BY SIDE</p><h2>The quick comparison.</h2></div></div><div className="compare-wrap"><table className="compare-table"><thead><tr><th>Model</th><th>VAT-relief price</th><th>Best for</th><th>Position in the range</th><th></th></tr></thead><tbody>{products.map(p=><tr key={p.shortName} className={p.shortName==="M4B"?"best":""}><td><strong>{p.shortName}</strong>{p.shortName==="M4B"&&<div><small>NEW</small></div>}</td><td>{gbp(displayPrice(p))}</td><td>{bestFor[p.shortName]}</td><td>{p.shortName==="M4"?"Original M4 platform":p.shortName==="M4B"?"Latest M4 evolution":p.shortName==="M4 Pro"?"Premium M4 configuration":p.shortName==="X12"?"All-terrain X12":"Flagship X12 Pro"}</td><td><Link className="text-link" href={`/${p.slug}`}>Shop →</Link></td></tr>)}</tbody></table></div></section>

    <section className="compare-guidance"><div><p className="eyebrow plain">SHOP BY NEED</p><h2>M4 for compact mobility. X12 for the extraordinary.</h2><p>If compact everyday manoeuvrability is the priority, start with M4, M4B or M4 Pro. For demanding terrain and compatible stairs, start with X12 or X12 Pro.</p></div><div className="cta-row"><Link className="btn blue" href="/xsto-x12">Shop X12 →</Link><Link className="btn outline" href="/xsto-m4b">Shop new M4B</Link></div></section>
  </main>;
}
