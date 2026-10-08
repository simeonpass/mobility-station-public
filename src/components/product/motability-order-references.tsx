"use client";

import { useState } from "react";
import { MotabilityLogo } from "@/components/product/motability-logo";
import { formatGBP } from "@/lib/products";
import {
  formatMotabilityOrderReference,
  groupMotabilityReferences,
  type MotabilityReference,
} from "@/lib/motability-references";

export function MotabilityOrderReferences({ references, hasUnverifiedOptions }: {
  references: MotabilityReference[];
  hasUnverifiedOptions: boolean;
}) {
  const [message, setMessage] = useState("");
  const groups = groupMotabilityReferences(references);

  async function copy(rows: MotabilityReference[]) {
    try {
      await navigator.clipboard.writeText(formatMotabilityOrderReference(rows));
      setMessage("Order reference copied.");
    } catch {
      setMessage("Please select and copy the reference text below.");
    }
  }

  return (
    <section aria-label="Motability dealer order references" className="space-y-4 border-t border-border/60 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MotabilityLogo height={24} />
        {references[0]?.quarter ? <span className="text-xs font-semibold text-muted">{references[0].quarter.replace('-', ' ')} price list</span> : null}
      </div>
      {groups.length ? <>
        <p className="text-sm font-semibold text-primary">Dealer order reference{groups.length > 1 ? 's' : ''}</p>
        {groups.map(({ key, label, rows }) => (
          <div key={key} className="space-y-3 rounded-lg border border-border bg-white p-3">
            {label ? <p className="text-sm font-bold text-primary">{label}</p> : null}
            {rows.map((row) => (
              <div key={row.adaptation_id} className="space-y-1">
                <p className="break-words text-sm text-primary">{row.adaptation_name}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="font-mono text-xs text-primary">Code: <strong>{row.adaptation_id}</strong></p>
                  <p className="text-sm font-bold tabular-nums text-primary">{formatGBP(Number(row.customer_price))} <span className="font-normal text-muted">customer contribution</span></p>
                </div>
              </div>
            ))}
            {rows.length > 1 ? <p className="text-xs text-muted">Order both codes for this option. Total customer contribution: <strong>{formatGBP(rows.reduce((sum, row) => sum + Number(row.customer_price), 0))}</strong>.</p> : null}
            <button type="button" onClick={() => copy(rows)} className="min-h-11 cursor-pointer rounded-md border border-primary/25 px-3 py-2 text-xs font-semibold text-primary hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Copy {rows.length > 1 ? 'order references' : 'order reference'}{label ? ` — ${label}` : ''}
            </button>
          </div>
        ))}
        <p className="text-xs leading-relaxed text-muted">Use the exact description and code above on your Motability order. Vehicle compatibility and eligibility must be confirmed before ordering.</p>
      </> : <p className="text-sm text-muted">Contact us to confirm the current Motability description, code and customer contribution for this adaptation.</p>}
      {groups.length > 0 && hasUnverifiedOptions ? <p className="text-xs text-muted">Other options require confirmation of their current Motability reference before ordering.</p> : null}
      <p role="status" aria-live="polite" className="text-xs text-primary">{message}</p>
    </section>
  );
}
