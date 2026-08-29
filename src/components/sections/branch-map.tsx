"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { Branch } from "@/lib/types";

export function BranchMap({ branches }: { branches: Branch[] }) {
  const [MapView, setMapView] = useState<ComponentType<{ branches: Branch[] }> | null>(null);
  useEffect(() => { let mounted = true; import("@/components/sections/branch-map-inner").then((mod) => { if (mounted) setMapView(() => mod.BranchMapInner); }); return () => { mounted = false; }; }, []);
  return <section className="bg-soft/55 py-14 md:py-20"><div className="container-site"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Visit Mobility Station</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">Heathrow &amp; Ferndown.</h2><p className="mt-3 max-w-2xl text-muted">Two specialist branches — or home demonstrations where suitable.</p><div className="relative z-0 mt-9 isolate overflow-hidden rounded-[2rem] border border-border bg-white"><div className="relative z-0 h-[360px] w-full md:h-[420px]">{MapView ? <MapView branches={branches} /> : <div className="flex h-full items-center justify-center bg-soft text-sm text-muted">Loading map…</div>}</div></div><ul className="mt-7 grid gap-4 md:grid-cols-2">{branches.map((branch) => <li key={branch.id} className="rounded-2xl border border-border bg-white p-5"><h3 className="text-xl font-bold text-primary">{branch.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{branch.addressLine1}{branch.addressLine2 ? `, ${branch.addressLine2}` : ""}, {branch.addressLocality}, {branch.postalCode}</p><a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="mt-3 inline-block text-sm font-semibold text-primary">{branch.phone}</a></li>)}</ul></div></section>;
}
