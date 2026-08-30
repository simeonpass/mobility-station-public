import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import { displayPrice, gbp, getProduct, getProducts, productImages, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const editorial: Record<string,{title:string;description:string;heading:string;intro:string;sections:{h:string;p:string}[]}>={
  "self-balancing-wheelchairs":{title:"Self-Balancing Wheelchairs UK | XSTO M4 Series | KLYM",description:"Discover XSTO self-balancing powered wheelchairs including the M4, M4B and M4 Pro.",heading:"Self-balancing mobility, explained.",intro:"The XSTO M4 family uses active balancing technology to create a compact powered mobility platform with a distinctive, controlled driving experience.",sections:[{h:"Why self-balancing?",p:"The balancing platform is designed to manage pitch continuously while the chair moves, helping XSTO keep a compact wheelbase and manoeuvre precisely."},{h:"Which model should I look at?",p:"The M4 is the original everyday model, the M4B is the latest evolution with redesigned front wheels and a folding footrest, while M4 Pro adds a more premium seating specification."},{h:"Try it rather than guess",p:"Self-balancing mobility feels different from a conventional powered wheelchair. A demonstration is the best way to understand how it behaves for you."}]},
  "stair-climbing-wheelchairs":{title:"Stair-Climbing & All-Terrain Wheelchairs UK | XSTO X12 | KLYM",description:"Explore XSTO X12 and X12 Pro all-terrain powered mobility technology with KLYM Mobility.",heading:"Go beyond ordinary powered mobility.",intro:"The XSTO X12 range is the specialist end of the KLYM line-up, built for demanding terrain and advanced access requirements.",sections:[{h:"X12 or X12 Pro?",p:"Both use the advanced wheel-track platform for difficult terrain and compatible stairs. The X12 Pro adds premium functions including an electrically adjustable legrest."},{h:"Suitability matters",p:"Advanced terrain and stair capability requires the right assessment, environment and user training. We recommend discussing your intended use before purchase."},{h:"UK advice and demonstration",p:"KLYM can help you compare the X12 models, understand VAT relief and arrange the right demonstration path."}]},
  "vat-relief":{title:"VAT Relief on Powered Wheelchairs | KLYM Mobility",description:"A straightforward guide to VAT relief for eligible disabled customers purchasing qualifying powered mobility products.",heading:"VAT relief, without the confusion.",intro:"Qualifying mobility products may be supplied at 0% VAT to eligible chronically sick or disabled customers when the legal conditions and declaration requirements are met.",sections:[{h:"Who can qualify?",p:"Eligibility depends on the customer and the intended personal use of the qualifying product. The relief is not simply an age-based discount."},{h:"Why KLYM shows VAT-relief pricing",p:"Our core XSTO products are mobility products commonly purchased by eligible customers, so we show the VAT-relief price prominently while keeping eligibility clear."},{h:"We verify before completion",p:"Before a VAT-relieved sale is completed, the required eligibility declaration and order details need to be captured correctly."}]}
};

type ModelStory = {
  kicker: string;
  headline: string;
  intro: string;
  bestFor: string;
  cards: Array<{title:string;text:string}>;
};

const modelStories: Record<Product["shortName"], ModelStory> = {
  "M4": {
    kicker: "THE ORIGINAL XSTO",
    headline: "Where self-balancing XSTO starts.",
    intro: "The M4 combines a compact footprint, powered seat elevation and omnidirectional movement with XSTO’s active self-balancing platform.",
    bestFor: "Everyday indoor and outdoor mobility in a compact self-balancing format.",
    cards: [
      {title:"Self-balancing",text:"Active front/rear balancing supports controlled movement on everyday surfaces and inclines."},
      {title:"Seat elevation",text:"Powered height adjustment helps bring worktops, tables and conversations closer."},
      {title:"Compact movement",text:"Omnidirectional front wheels and a tight footprint help in busy indoor spaces."},
    ],
  },
  "M4B": {
    kicker: "THE NEW M4 EVOLUTION",
    headline: "Familiar XSTO technology. Better everyday details.",
    intro: "M4B keeps the compact self-balancing character of the M4 and adds the changes customers notice every day: a folding footrest and redesigned front-wheel system.",
    bestFor: "Customers who want the latest M4 platform and the most practical everyday configuration.",
    cards: [
      {title:"Folding footrest",text:"The integrated footrest folds neatly away to improve transfers and create a cleaner transport footprint."},
      {title:"Redesigned front wheels",text:"Updated front-wheel hardware gives M4B its own revised layout while keeping precise manoeuvrability."},
      {title:"347–650 mm seat lift",text:"Electric elevation changes your working and conversation height without moving to a larger chair."},
    ],
  },
  "M4 Pro": {
    kicker: "PREMIUM M4 COMFORT",
    headline: "More support. More adjustment.",
    intro: "M4 Pro builds on XSTO self-balancing mobility with an extended ergonomic backrest, integrated head support and a more adaptable seating system.",
    bestFor: "Longer days, greater postural support and customers who prioritise seating adjustment.",
    cards: [
      {title:"Enhanced seating",text:"An extended backrest and integrated head support are designed around longer periods of use."},
      {title:"Adjustable fit",text:"Seat and backrest adjustment provide more ways to tailor the chair around the user."},
      {title:"M4 manoeuvrability",text:"You still get the compact self-balancing platform and omnidirectional movement that define the M4 family."},
    ],
  },
  "X12": {
    kicker: "ALL-TERRAIN XSTO",
    headline: "Built for the route that doesn’t stay flat.",
    intro: "X12 combines wheels, tracks, active levelling and intelligent control to tackle terrain far beyond a conventional powered wheelchair.",
    bestFor: "Advanced outdoor access, difficult terrain and compatible stair environments after assessment and training.",
    cards: [
      {title:"Wheel-track platform",text:"Multiple drive modes adapt the X12 chassis for smooth surfaces, rough terrain and compatible steps."},
      {title:"Dynamic levelling",text:"The seating system works to maintain a controlled position as the terrain changes beneath the chair."},
      {title:"LiDAR safety",text:"Sensing technology supports collision, proximity and drop-off awareness around demanding environments."},
    ],
  },
  "X12 Pro": {
    kicker: "THE FLAGSHIP XSTO",
    headline: "All-terrain capability, with the Pro treatment.",
    intro: "X12 Pro takes the advanced X12 wheel-track platform and adds premium comfort and adjustment, including an electrically adjustable legrest.",
    bestFor: "Customers looking for XSTO’s highest-specification all-terrain and stair-capable platform.",
    cards: [
      {title:"Three terrain modes",text:"Quad-wheel, hybrid wheel-track and dual-track configurations adapt the chassis to different environments."},
      {title:"Electric legrest",text:"The Pro seating package adds powered legrest adjustment alongside seat height, tilt and recline functions."},
      {title:"35 km flat-ground range",text:"Twin lithium battery packs support longer journeys when using the X12 Pro on level ground."},
    ],
  },
};

function cleanDescription(value?: string | null) {
  if (!value) return "Advanced XSTO powered mobility with UK sales, delivery and support from KLYM.";
  const first = value.split(/\n\n|\\n\\n/)[0]?.trim() || value.trim();
  return first.length > 360 ? `${first.slice(0, 357).trim()}…` : first;
}

function visibleSpecs(product: Product) {
  if (!product.specifications || typeof product.specifications !== "object") return [];
  const priority = ["Range","Top Speed","Max Speed","Max. Speed","Max Slope","Max. Slope","Max Stair Slope","Max Load Capacity","Max. Capacity","Seat Height Range","Lifting Range","Lifting range","Battery","Weight without Battery","Weight (without battery)","Protection Rating","Drive Modes","Terrain Modes","Footrest","Legrest Adjustment"];
  const entries = Object.entries(product.specifications).filter(([,value]) => typeof value === "string" || typeof value === "number");
  const picked: Array<[string, unknown]> = [];
  for (const key of priority) {
    const found = entries.find(([name]) => name.toLowerCase() === key.toLowerCase());
    if (found && !picked.some(([name]) => name.toLowerCase() === found[0].toLowerCase())) picked.push(found);
  }
  for (const entry of entries) {
    if (picked.length >= 9) break;
    if (!picked.some(([name]) => name.toLowerCase() === entry[0].toLowerCase())) picked.push(entry);
  }
  return picked.slice(0,9);
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  if(editorial[slug]){const e=editorial[slug];return {title:e.title,description:e.description,alternates:{canonical:`https://klym.co.uk/${slug}`}};}
  const product=await getProduct(slug);
  if(!product)return {title:"KLYM Mobility"};
  const images=productImages(product);
  return {
    title: product.seo_title || `XSTO ${product.shortName} UK | KLYM Mobility`,
    description: product.meta_description||cleanDescription(product.description),
    alternates:{canonical:`https://klym.co.uk/${product.slug}`},
    openGraph:{title:`XSTO ${product.shortName} | KLYM`,description:product.meta_description||cleanDescription(product.description),images:images.slice(0,1).map(url=>({url}))}
  };
}

export default async function SlugPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const e=editorial[slug];
  if(e)return <main className="page-shell"><section className="page-hero"><p className="eyebrow plain">KLYM GUIDE</p><h1>{e.heading}</h1><p>{e.intro}</p></section><section className="content-section narrow">{e.sections.map(s=><div key={s.h} className="editorial-block"><h2>{s.h}</h2><p>{s.p}</p></div>)}<div className="cta-row"><Link className="btn blue" href="/compare">Compare XSTO models →</Link><Link className="btn outline" href="/book-a-demo">Book a demo</Link></div></section></main>;

  const found=await getProduct(slug);
  if(!found)notFound();
  const product=found!;
  const story=modelStories[product.shortName];
  const price=displayPrice(product);
  const images=productImages(product);
  const specs=visibleSpecs(product);
  const highlights=(product.features&&product.features.length?product.features:["UK specialist support","VAT relief available if eligible","UK delivery","Book a demonstration"]).slice(0,6);
  const products=await getProducts();
  const related=products.filter(p=>p.slug!==product.slug).slice(0,4);
  const inStock=!product.track_stock || Number(product.quantity ?? 0)>0;
  const structured={"@context":"https://schema.org","@type":"Product",name:`XSTO ${product.shortName}`,brand:{"@type":"Brand",name:"XSTO"},description:cleanDescription(product.description),image:images,sku:product.sku||undefined,offers:{"@type":"Offer",priceCurrency:"GBP",price:String(price),availability:inStock?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:`https://klym.co.uk/${product.slug}`}};

  return <main className="page-shell product-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/>

    <section className="product-page product-launch">
      <div className="product-top">
        <div className={`premium-gallery ${images.length>1?"multi":"single"}`}>
          <div className="gallery-main"><img src={images[0]} alt={`XSTO ${product.shortName} main product view`} /></div>
          {images.length>1&&<div className="gallery-thumbs">{images.slice(1,5).map((url,index)=><div key={url}><img src={url} alt={`XSTO ${product.shortName} product view ${index+2}`} /></div>)}</div>}
        </div>
        <div className="product-copy">
          <p className="product-kicker">{story.kicker}</p>
          <h1>{product.shortName}</h1>
          <p className="product-tagline">{story.headline}</p>
          <p className="lede">{story.intro}</p>
          <div className="product-price">{gbp(price)}</div><div className="vat-note">with VAT relief, subject to eligibility</div>
          {product.retail_price&&Number(product.retail_price)>price&&<div className="inc-vat-price">{gbp(Number(product.retail_price))} including VAT</div>}
          <div className="availability-row"><span className={inStock?"available":"check-stock"}>{inStock?"● Available to order":"Check availability"}</span>{product.delivery_estimate&&<span>Typical delivery: {product.delivery_estimate}</span>}</div>
          <div className="cta-row"><Link className="btn blue" href={`/book-a-demo?product=${encodeURIComponent(`XSTO ${product.shortName}`)}`}>Book a demo →</Link><a className="btn outline" href="#enquire">Ask about buying</a></div>
          <p className="best-for"><b>Best for:</b> {story.bestFor}</p>
        </div>
      </div>
    </section>

    <section className="model-story-section">
      <div className="story-heading"><p className="eyebrow plain">WHY {product.shortName.toUpperCase()}</p><h2>{story.headline}</h2></div>
      <div className="story-card-grid">{story.cards.map((card,index)=><article key={card.title}><span>0{index+1}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>
    </section>

    {images.length>=3&&<section className="product-editorial-gallery">
      <div className="editorial-image large"><img src={images[Math.min(5,images.length-1)]} alt={`XSTO ${product.shortName} detail view`} /></div>
      <div className="editorial-message"><p className="eyebrow plain">LOOK CLOSER</p><h2>Designed around real use.</h2><p>{product.shortName==="M4B"?"The M4B changes are deliberately practical: easier footrest clearance, revised front-wheel hardware and the same height-changing, self-balancing platform that makes the M4 family distinctive.":product.shortName.startsWith("X12")?"The X12 platform is a complex mobility system rather than a conventional powerchair. Its tracks, wheels, sensors and levelling seat work together as the environment changes.":cleanDescription(product.description)}</p></div>
      <div className="editorial-image"><img src={images[Math.min(2,images.length-1)]} alt={`XSTO ${product.shortName} alternate view`} /></div>
    </section>}

    <section className="content-section key-feature-section"><div className="section-heading"><div><p className="eyebrow plain">WHAT YOU GET</p><h2>Key features.</h2></div></div><div className="feature-pill-grid">{highlights.map((h,i)=><span key={i}>✓ {typeof h==="string"?h:JSON.stringify(h)}</span>)}</div></section>

    {specs.length>0&&<section className="content-section specs-section"><p className="eyebrow plain">KEY SPECIFICATIONS</p><h2>XSTO {product.shortName} at a glance.</h2><div className="spec-grid">{specs.map(([k,v])=><div className="spec-card" key={k}><b>{k.replaceAll("_"," ")}</b><span>{String(v)}</span></div>)}</div><p className="spec-note">Specifications are a concise sales-page summary. We’ll confirm suitability and the latest technical specification before order completion.</p></section>}

    <section className="content-section" id="enquire"><div className="form-wrap"><div><p className="eyebrow plain">BUY OR DEMO</p><h2>Talk to a KLYM XSTO specialist.</h2><p>Ask about availability, VAT relief, delivery or arranging a demonstration. Your enquiry goes directly into the Mobility Station V1 sales workflow.</p></div><EnquiryForm defaultProduct={`XSTO ${product.shortName}`} type="sales"/></div></section>

    <section className="range-section related-range"><div className="section-heading"><div><p className="eyebrow plain">ALSO CONSIDER</p><h2>Compare the range.</h2></div><Link className="btn outline small" href="/compare">Compare all →</Link></div><div className="product-grid">{related.map(p=><Link className="product-card" href={`/${p.slug}`} key={p.slug}><div className="product-image"><img src={productImages(p)[0]} alt={p.name}/></div><h3>{p.shortName}</h3><p>{modelStories[p.shortName].bestFor}</p><strong>From {gbp(displayPrice(p))}</strong><small>with VAT relief</small><span className="card-arrow">→</span></Link>)}</div></section>
  </main>;
}
