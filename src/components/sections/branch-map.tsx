"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { Branch } from "@/lib/types";

export function BranchMap({ branches }: { branches: Branch[] }) {
  const [MapView, setMapView] = useState<ComponentType<{
    branches: Branch[];
  }> | null>(null);

  useEffect(() => {
    let mounted = true;
    import("@/components/sections/branch-map-inner").then((mod) => {
      if (mounted) setMapView(() => mod.BranchMapInner);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-soft py-16 md:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Heathrow &amp; Ferndown branches
          </h2>
          <p className="mt-3 text-muted">
            Visit us locally or book a free home demonstration — we come to you.
          </p>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
          <div className="h-[360px] w-full">
            {MapView ? (
              <MapView branches={branches} />
            ) : (
              <div className="flex h-full items-center justify-center bg-soft text-sm text-muted">
                Loading map…
              </div>
            )}
          </div>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <li key={branch.id} className="border-t border-border pt-4">
              <h3 className="text-xl font-bold">{branch.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {branch.addressLine1}
                {branch.addressLine2 ? `, ${branch.addressLine2}` : ""},{" "}
                {branch.addressLocality}, {branch.postalCode}
              </p>
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-block text-sm font-semibold text-primary hover:text-primary-dark"
              >
                {branch.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
