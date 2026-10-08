export type MotabilityReference = {
  variant_id: string | null;
  variant_label: string | null;
  adaptation_id: string;
  adaptation_name: string;
  customer_price: number;
  quarter: string;
  manufacturer: string;
};

export function groupMotabilityReferences(references: MotabilityReference[]) {
  // A product with options uses option-specific references; its base code is
  // only a default and must not be displayed as an additional charge.
  const hasOptions = references.some((r) => r.variant_id !== null);
  const groups = new Map<string, { label: string | null; rows: MotabilityReference[] }>();
  for (const row of references) {
    if (hasOptions && row.variant_id === null) continue;
    const key = row.variant_id ?? 'base';
    const group = groups.get(key) ?? { label: row.variant_label, rows: [] };
    group.rows.push(row);
    groups.set(key, group);
  }
  return [...groups.entries()].map(([key, group]) => ({ key, ...group }));
}

export function formatMotabilityOrderReference(rows: MotabilityReference[]) {
  return rows.map((row) =>
    `${row.adaptation_id} — ${row.adaptation_name} — Customer contribution £${Number(row.customer_price).toFixed(2)} (${row.quarter.replace('-', ' ')})`
  ).join('\n');
}
