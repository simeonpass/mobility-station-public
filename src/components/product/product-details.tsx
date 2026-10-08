import { Badge } from "@/components/ui/badge";

export function MotabilityBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return <Badge>Motability Available</Badge>;
}

export function ProductSpecGrid({
  specifications,
}: {
  specifications: { label: string; value: string }[];
}) {
  const rows = specifications.slice(0, 20);
  if (!rows.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-extrabold">Specifications</h2>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-2 gap-4 py-3 text-sm md:grid-cols-[220px_1fr]"
          >
            <dt className="font-semibold text-primary">{row.label}</dt>
            <dd className="text-foreground/80">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CompatibleAccessories({
  accessories,
}: {
  accessories: { name: string; price?: number }[];
}) {
  if (!accessories.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-extrabold">Compatible accessories</h2>
      <ul className="mt-4 space-y-2">
        {accessories.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between border-b border-border py-3 text-sm"
          >
            <span>{item.name}</span>
            {item.price != null ? (
              <span className="font-semibold text-primary">
                £{item.price.toLocaleString("en-GB")}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
