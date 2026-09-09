import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, formatGBP, primaryImage, type ProductDetail } from "@/lib/products";
import { getProductFacts } from "@/lib/product-facts";
import { getVatPriceDisplay } from "@/lib/vat";
import { isAdaptationProduct } from "@/lib/adaptations";

export const metadata: Metadata = { title: "Compare mobility products", robots: { index: false, follow: true } };

const rows = [
  ["lifting", "Lifting weight"], ["without-battery", "Weight without battery"],
  ["weight", "Listed weight"], ["folded", "Folded dimensions"],
  ["range", "Range (up to)"], ["capacity", "Maximum user weight"],
  ["battery", "Battery"], ["battery-included", "Battery included"], ["dimensions", "Dimensions"],
] as const;

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ products?: string | string[] }> }) {
  const params = await searchParams;
  const query = Array.isArray(params.products) ? params.products[0] : params.products ?? "";
  const slugs = [...new Set(query.split(",").map(value => value.trim()).filter(Boolean))].slice(0, 3);
  const results = await Promise.allSettled(slugs.map(getProductBySlug));
  const products = results.flatMap(result => result.status === "fulfilled" && result.value && !isAdaptationProduct(result.value) ? [result.value] : []);
  const facts = products.map(product => getProductFacts({
    weight: product.weight, description: product.description, features: product.features,
    specs: [...Object.entries(product.specifications ?? {}).map(([key, value]): [string, string] => [key, String(value)]),
      ...(product.dimensions ? [["Dimensions", product.dimensions] as [string, string]] : [])],
  }));
  return <section className="container-site ms-section ms-compare-page">
    <Link href="/shop" className="ms-text-link">Back to scooters &amp; wheelchairs</Link>
    <h1>Compare your shortlist.</h1>
    <p>Check the practical details side by side. Range varies with use; our team can help confirm lifting weight and fit for your car.</p>
    {products.length < 2 ? <div className="ms-compare-empty"><p>Choose two or three available scooters or wheelchairs in the shop to compare.</p><Link href="/shop" className="ms-button">Choose products</Link></div> : <>
      {products.length < slugs.length ? <p role="status">One selected product could not be loaded. The available products are shown below.</p> : null}
      <div className="ms-compare-table-scroll" role="region" aria-label="Product comparison table; scroll horizontally on smaller screens" tabIndex={0}>
        <table className="ms-compare-table">
          <caption className="sr-only">Specifications and prices of your selected mobility products</caption>
          <thead><tr><th scope="col">Product</th>{products.map(product => <th scope="col" key={product.id}>
            <Link href={`/products/${product.slug}`}><Image src={primaryImage(product)} alt="" width={180} height={150} /><span>{product.name}</span></Link>
          </th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Price</th>{products.map(product => <td key={product.id}><ComparisonPrice product={product} /></td>)}</tr>
            {rows.map(([id, label]) => <tr key={id}><th scope="row">{label}</th>{facts.map((items, index) => <td key={products[index].id}>{items.find(fact => fact.id === id)?.value ?? <span className="text-muted">Not listed — ask our team</span>}</td>)}</tr>)}
            <tr><th scope="row">Next step</th>{products.map(product => <td key={product.id}><div className="ms-compare-next"><Link href={`/products/${product.slug}`} className="ms-text-link">View product</Link><Link href={`/book-a-demo?product=${encodeURIComponent(product.slug)}`} className="ms-button">Book a demo</Link></div></td>)}</tr>
          </tbody>
        </table>
      </div>
    </>}
  </section>;
}

function ComparisonPrice({ product }: { product: ProductDetail }) {
  const vat = getVatPriceDisplay(product);
  const amount = vat.mode === "always-inc" ? vat.gross : vat.net;
  return <><strong>{amount != null ? formatGBP(amount) : "Price on request"}</strong><p className="ms-tax-note">{vat.mode === "relief" ? "With VAT relief · ex VAT" : vat.mode === "always-inc" ? "Including VAT" : "No VAT"}</p></>;
}
