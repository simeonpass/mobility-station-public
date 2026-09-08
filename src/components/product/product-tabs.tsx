import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function ProductTabs({ sections }: {
  sections: Array<{ id: string; title: string; content: ReactNode; defaultOpen?: boolean }>;
}) {
  if (!sections.length) return null;
  return (
    <section className="ms-product-information" aria-labelledby="product-information-title">
      <h2 id="product-information-title">Good to know.</h2>
      <div className="ms-product-accordions">
        {sections.map((section) => (
          <details key={section.id} id={`product-info-${section.id}`}>
            <summary>{section.title}<ChevronDown size={18} aria-hidden /></summary>
            <div className="ms-product-information-content">{section.content}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
