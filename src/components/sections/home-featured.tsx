"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function HomeFeatured({ mobility, adaptations }: { mobility: ReactNode; adaptations: ReactNode }) {
  const [kind, setKind] = useState<"mobility" | "adaptations">("mobility");
  return <section className="ms-featured"><div className="container-site ms-section">
    <div className="ms-section-heading"><div><p className="ms-eyebrow">Find your everyday freedom</p><h2>A good place to start.</h2></div><Link className="ms-text-link" href={kind === "mobility" ? "/shop" : "/vehicle-adaptations"}>Explore the range<ArrowRight size={18} aria-hidden /></Link></div>
    <div className="ms-product-tabs" role="group" aria-label="Featured product range"><button type="button" aria-pressed={kind === "mobility"} aria-controls="featured-products" onClick={() => setKind("mobility")}>Scooters &amp; wheelchairs</button><button type="button" aria-pressed={kind === "adaptations"} aria-controls="featured-products" onClick={() => setKind("adaptations")}>Vehicle adaptations</button></div>
    <div id="featured-products" className="ms-product-grid">{kind === "mobility" ? mobility : adaptations}</div>
  </div></section>;
}
