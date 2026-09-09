"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";

type Selection = { slug: string; name: string };
const ComparisonContext = createContext<{
  selected: Selection[];
  toggle: (product: Selection) => void;
} | null>(null);

export function ProductComparisonProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Selection[]>([]);
  const pathname = usePathname();
  function toggle(product: Selection) {
    setSelected(items => items.some(item => item.slug === product.slug)
      ? items.filter(item => item.slug !== product.slug)
      : items.length < 3 ? [...items, product] : items);
  }
  const showBar = selected.length > 0 && (pathname.startsWith("/shop") || pathname === "/clearance");
  const compareHref = `/compare?products=${selected.map(item => encodeURIComponent(item.slug)).join(",")}`;
  return <ComparisonContext.Provider value={{ selected, toggle }}>
    {children}
    {showBar ? <><div className="ms-compare-spacer" aria-hidden /><aside className="ms-compare-bar" aria-label="Selected products for comparison">
      <div>
        <p role="status">{selected.length} of 3 products selected</p>
        <ul>{selected.map(product => <li key={product.slug}>
          <button type="button" onClick={() => toggle(product)} aria-label={`Remove ${product.name} from comparison`}>{product.name} <span aria-hidden>×</span></button>
        </li>)}</ul>
      </div>
      <div className="ms-compare-actions">
        {selected.length >= 2 ? <Link href={compareHref} className="ms-button">Compare products</Link> : <p>Select one more to compare</p>}
        <button type="button" onClick={() => setSelected([])} className="ms-text-link">Clear selection</button>
      </div>
    </aside></> : null}
  </ComparisonContext.Provider>;
}

export function CompareButton({ product }: { product: Selection }) {
  const context = useContext(ComparisonContext);
  if (!context) return null;
  const selected = context.selected.some(item => item.slug === product.slug);
  const full = !selected && context.selected.length >= 3;
  return <button type="button" className="ms-compare-toggle" aria-pressed={selected}
    aria-label={`${selected ? "Remove" : "Select"} ${product.name} ${selected ? "from" : "for"} comparison`}
    disabled={full} onClick={() => context.toggle(product)}>
    <span aria-hidden>{selected ? "✓" : "+"}</span> {selected ? "Selected to compare" : full ? "Comparison full (3)" : "Compare"}
  </button>;
}
