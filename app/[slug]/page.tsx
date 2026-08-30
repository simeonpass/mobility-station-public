import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import { displayPrice, gbp, getProduct, getProducts, productImages, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const m4bCampaignImages = [
  "/klym/m4b/m4b-hero.webp",
  "/klym/m4b/m4b-front-three-quarter.webp",
  "/klym/m4b/m4b-left-profile.webp",
  "/klym/m4b/m4b-rear-three-quarter.webp",
];

function displayImages(product: Product) {
  return product.shortName === "M4B" ? Array.from(new Set([...m4bCampaignImages, ...productImages(product)])) : productImages(product);
}

const editorial: Record<string,{title:string;description:string;heading:string;intro:string;sections:{h:string;p:string}[]}>={
  "self-balancing-wheelchairs":{title:"Self-Balancing Wheelchairs UK | XSTO M4 Series | KLYM",description:"Shop the XSTO M4, M4B and M4 Pro self-balancing powered wheelchair range.",heading:"Shop self-balancing XSTO mobility.",intro:"The M4 family combines compact powered mobility with active self-balancing control and electric seat elevation.",sections:[{h:"M4",p:"The original compact self-balancing XSTO platform."},{h:"M4B",p:"The newest M4 evolution with a folding footrest and redesigned front-wheel system."},{h:"M4 Pro",p:"The M4 platform with a higher-specification comfort and support package."}]},
  "stair-climbing-wheelchairs":{title:"Stair-Climbing Wheelchairs UK | XSTO X12 & X12 Pro | KLYM",description:"Shop XSTO X12 and X12 Pro stair-climbing all-terrain mobility robots in the UK.",heading:"Shop XSTO stair-climbing mobility.",intro:"The X12 range combines wheel-track mobility, active levelling and specialist terrain capability.",sections:[{h:"X12",p:"The core stair-climbing, all-terrain XSTO platform."},{h:"X12 Pro",p:"The flagship X12 with a higher-specification comfort and adjustment package."},{h:"Before ordering",p:"Stair use is a specialist application. Review the product specification and manual and confirm suitability for your intended environment."}]},
  "vat-relief":{title:"VAT Relief on Powered Wheelchairs | KLYM Mobility",description:"VAT relief information for eligible disabled customers purchasing qualifying powered mobility products.",heading:"VAT relief on qualifying mobility products.",intro:"Eligible chronically sick or disabled customers may be able to purchase qualifying mobility products at 0% VAT when the statutory conditions are met.",sections:[{h:"Who can qualify?",p:"Eligibility depends on the customer, their qualifying condition and personal use of the product."},{h:"Why we show VAT-relief pricing",p:"Many customers purchasing qualifying powered mobility products are eligible, so KLYM shows the VAT-relief price prominently."},{h:"Declaration required",p:"A valid VAT relief declaration must be completed before a qualifying order is supplied at the zero rate."}]}
};

type Story = { kicker:string; headline:string; intro:string; bestFor:string; features:Array<{title:string;text:string}> };
const stories: Record<Product["shortName"],Story> = {
  M4:{kicker:"XSTO M4",headline:"Compact self-balancing mobility.",intro:"The original M4 combines a compact footprint, powered seat elevation and XSTO self-balancing control.",bestFor:"Everyday indoor and outdoor mobility in the original M4 format.",features:[{title:"Self-balancing control",text:"Active front/rear balancing supports precise everyday movement."},{title:"Electric seat elevation",text:"Raise and lower the seat to change working and conversation height."},{title:"Compact footprint",text:"Designed to manoeuvre precisely in tighter everyday spaces."}]},
  M4B:{kicker:"NEW M4B",headline:"The M4, refined for everyday life.",intro:"M4B keeps the compact self-balancing character of the M4 and adds a folding footrest and redesigned front-wheel system.",bestFor:"Customers who want the newest M4 configuration and the latest practical design updates.",features:[{title:"Folding footrest",text:"The revised footrest folds neatly away for transfers and transport."},{title:"Redesigned front wheels",text:"Updated front-wheel hardware gives M4B its own revised layout."},{title:"Electric seat elevation",text:"Powered height adjustment remains part of the compact M4 platform."}]},
  "M4 Pro":{kicker:"XSTO M4 PRO",headline:"More comfort. More adjustment.",intro:"M4 Pro builds on the self-balancing M4 platform with a higher-specification seating and support package.",bestFor:"Customers prioritising additional seating support and adjustment within the M4 family.",features:[{title:"Enhanced seating",text:"A more supportive seating package for longer or more demanding use."},{title:"Active balance",text:"Keeps the defining XSTO self-balancing platform."},{title:"Powered elevation",text:"Adjust seat height without moving to a larger mobility base."}]},
  X12:{kicker:"X12 STAIR CLIMBER",headline:"Built for the route that changes beneath you.",intro:"X12 combines wheels, tracks and intelligent control in a specialist all-terrain mobility platform designed for advanced access and compatible stairs.",bestFor:"Customers whose mobility needs extend beyond conventional powered wheelchair terrain.",features:[{title:"Stair-climbing platform",text:"Track-based capability is designed for compatible stair environments."},{title:"All-terrain mobility",text:"Multiple drive configurations support changing ground conditions."},{title:"Active seat control",text:"Intelligent control helps manage seating position as terrain changes."}]},
  "X12 Pro":{kicker:"X12 PRO",headline:"The flagship XSTO stair-climbing platform.",intro:"X12 Pro takes the advanced X12 architecture and adds the highest-specification comfort and adjustment package in the range.",bestFor:"Customers looking for the flagship XSTO all-terrain and stair-climbing model.",features:[{title:"Advanced terrain modes",text:"Wheel and track configurations adapt to different environments."},{title:"Pro comfort package",text:"Additional powered seating functions increase adjustability."},{title:"Flagship XSTO",text:"The most highly specified product in the KLYM XSTO range."}]}
};

function cleanDescription(value?:string|null){if(!value)return "Advanced XSTO powered mobility from KLYM.";const s=value.split(/\n\n|\\n\\n/)[0]?.trim()||value.trim();return s.length>330?`${s.slice(0,327).trim()}…`:s;}
function youtubeId(url?:string|null){if(!url)return null;const m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/);return m?.[1]||null;}
function visibleSpecs(product:Product){if(!product.specifications||typeof product.specifications!=="object")return [];const entries=Object.entries(product.specifications).filter(([,v])=>typeof v==="string"||typeof v==="number");const priority=["Range","Top Speed","Max Speed","Max. Speed","Max Slope","Max. Slope","Max Stair Slope","Max Load Capacity","Max. Capacity","Seat Height Range","Lifting Range","Battery","Weight without Battery","Weight (without battery)","Drive Modes","Terrain Modes","Footrest","Legrest Adjustment","Protection Rating"];const picked:Array<[string,unknown]>=[];for(const key of priority){const f=entries.find(([n])=>n.toLowerCase()===key.toLowerCase());if(f&&!picked.some(([n])=>n===f[0]))picked.push(f);}for(const e of entries){if(picked.length>=10)break;if(!picked.some(([n])=>n===e[0]))picked.push(e);}return picked.slice(0,10);}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  if(editorial[slug]){const e=editorial[slug];return {title:e.title,description:e.description,alternates:{canonical:`https://klym.co.uk/${slug}`}};}
  const product=await getProduct(slug);if(!product)return {title:"KLYM Mobility"};
  const images=displayImages(product);
  return {title:product.seo_title||`Buy XSTO ${product.shortName} UK | KLYM`,description:product.meta_description||cleanDescription(product.description),alternates:{canonical:`https://klym.co.uk/${product.slug}`},openGraph:{title:`XSTO ${product.shortName} | KLYM`,description:cleanDescription(product.description),images:images.slice(0,1).map(url=>({url}))}};
}

export default async function SlugPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const guide=editorial[slug];
  if(guide)return <main className="page-shell"><section className="page-hero"><p className="eyebrow plain">KLYM BUYING GUIDE</p><h1>{guide.heading}</h1><p>{guide.intro}</p></section><section className="content-section narrow">{guide.sections.map(s=><div key={s.h} className="editorial-block"><h2>{s.h}</h2><p>{s.p}</p></div>)}<div className="cta-row"><Link className="btn blue" href="/#range">Shop XSTO →</Link><Link className="btn outline" href="/compare">Compare models</Link></div></section></main>;

  const found=await getProduct(slug);if(!found)notFound();const product=found!;const story=stories[product.shortName];const price=displayPrice(product);const images=displayImages(product);const specs=visibleSpecs(product);const products=await getProducts();const related=products.filter(p=>p.slug!==product.slug).slice(0,4);const inStock=!product.track_stock||Number(product.quantity??0)>0;const yt=youtubeId(product.video_url);
  const structuredImages=images.map(url=>url.startsWith("/")?`https://klym.co.uk${url}`:url);
  const structured={"@context":"https://schema.org","@type":"Product",name:`XSTO ${product.shortName}`,brand:{"@type":"Brand",name:"XSTO"},description:cleanDescription(product.description),image:structuredImages,sku:product.sku||undefined,offers:{"@type":"Offer",priceCurrency:"GBP",price:String(price),availability:inStock?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:`https://klym.co.uk/${product.slug}`}};

  return <main className="page-shell product-detail-page shop-product-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}} />
    <div className="product-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/#range">XSTO</Link><span>/</span><b>{product.shortName}</b></div>

    <section className="product-page product-launch shop-product-shell">
      <div className="product-top">
        <div className="premium-gallery shop-gallery">
          <div className="gallery-main"><img src={images[0]} alt={`XSTO ${product.shortName}`} />{product.shortName==="M4B"&&<span className="product-new-badge">NEW</span>}</div>
          {images.length>1&&<div className="gallery-thumbs">{images.slice(1,5).map((url,i)=><div key={url}><img src={url} alt={`XSTO ${product.shortName} view ${i+2}`} /></div>)}</div>}
        </div>
        <div className="product-copy shop-product-copy">
          <p className="product-kicker">{story.kicker}</p>
          <h1>{product.shortName}</h1>
          <p className="product-tagline">{story.headline}</p>
          <p className="lede">{story.intro}</p>
          <div className="shop-product-price"><strong>{gbp(price)}</strong><span>with VAT relief</span></div>
          {product.retail_price&&Number(product.retail_price)>price&&<div className="inc-vat-price">{gbp(Number(product.retail_price))} including VAT</div>}
          <div className="availability-row"><span className={inStock?"available":"check-stock"}>{inStock?"● Available to order":"Check availability"}</span>{product.delivery_estimate&&<span>Typical delivery: {product.delivery_estimate}</span>}</div>
          <div className="shop-purchase-actions"><a className="shop-button primary wide" href="#buy">Start order</a>{product.manual_url&&<a className="shop-button secondary wide" href={product.manual_url} target="_blank" rel="noreferrer">User manual ↓</a>}</div>
          <div className="shop-buying-points"><span>VAT relief for eligible customers</span><span>UK delivery options</span><span>UK after-sales support</span></div>
          <div className="shop-feature-list">{story.features.map(f=><div key={f.title}><strong>{f.title}</strong><span>{f.text}</span></div>)}</div>
        </div>
      </div>
    </section>

    {yt&&<section className="shop-video-section"><div><p className="shop-overline light">PRODUCT VIDEO</p><h2>See the {product.shortName} in action.</h2><p>Watch the product in real use before you order.</p></div><div className="video-frame"><iframe src={`https://www.youtube.com/embed/${yt}?rel=0`} title={`XSTO ${product.shortName} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></section>}

    <section className="shop-product-details">
      <div className="shop-details-heading"><p className="shop-overline">PRODUCT DETAILS</p><h2>{story.headline}</h2><p>{story.bestFor}</p></div>
      <div className="story-card-grid shop-story-cards">{story.features.map((f,i)=><article key={f.title}><span>0{i+1}</span><h3>{f.title}</h3><p>{f.text}</p></article>)}</div>
    </section>

    {specs.length>0&&<section className="content-section specs-section shop-specs"><div className="section-heading"><div><p className="eyebrow plain">SPECIFICATIONS</p><h2>XSTO {product.shortName} at a glance.</h2></div>{product.manual_url&&<a className="shop-text-link" href={product.manual_url} target="_blank" rel="noreferrer">Download full manual ↓</a>}</div><div className="spec-grid">{specs.map(([k,v])=><div className="spec-card" key={k}><b>{k.replaceAll("_"," ")}</b><span>{String(v)}</span></div>)}</div><p className="spec-note">Specifications shown are taken from the current product record. Check the latest user manual and order confirmation for the final supplied specification.</p></section>}

    {images.length>=3&&<section className="shop-image-feature"><div className="shop-feature-image"><img src={images[Math.min(2,images.length-1)]} alt={`XSTO ${product.shortName} detail`} /></div><div className="shop-feature-copy"><p className="shop-overline">LOOK CLOSER</p><h2>Premium mobility, engineered differently.</h2><p>{cleanDescription(product.description)}</p>{product.manual_url&&<a className="shop-text-link" href={product.manual_url} target="_blank" rel="noreferrer">Read the user manual →</a>}</div></section>}

    <section className="shop-order-section" id="buy"><div className="shop-order-copy"><p className="shop-overline light">BUY XSTO {product.shortName.toUpperCase()}</p><h2>Start your order.</h2><p>Send your order details directly into the Mobility Station V1 sales workflow. We’ll confirm availability, VAT relief where applicable, delivery and the final order details.</p><div className="shop-order-price"><strong>{gbp(price)}</strong><span>with VAT relief</span></div></div><EnquiryForm defaultProduct={`XSTO ${product.shortName}`} type="sales" /></section>

    <section className="collection-section related-range"><div className="collection-heading"><div><p className="shop-overline">YOU MAY ALSO LIKE</p><h2>Explore the range.</h2></div><Link href="/compare">Compare all models →</Link></div><div className="shop-product-grid four">{related.map(p=><Link className="shop-product-card" href={`/${p.slug}`} key={p.slug}><div className="shop-card-media"><img src={displayImages(p)[0]} alt={p.name}/></div><div className="shop-card-body"><div><h3>{p.shortName}</h3><p>{stories[p.shortName].bestFor}</p></div><div className="shop-card-price"><strong>{gbp(displayPrice(p))}</strong><small>with VAT relief</small></div></div><span className="shop-card-link">View product →</span></Link>)}</div></section>
  </main>;
}
