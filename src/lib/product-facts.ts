export type ProductFact = { id: string; label: string; value: string };
type FactSource = {
  weight?: number | null;
  specs: Array<[string, string]>;
  description?: string | null;
  features?: string[] | null;
};

const normaliseKey = (key: string) => key.toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();

/** Read published specifications; do not infer missing suitability or battery inclusion. */
export function getProductFacts(source: FactSource): ProductFact[] {
  const specs = source.specs.filter(([, value]) => value.trim() && value !== "null" && value !== "[object Object]");
  const find = (pattern: RegExp) => specs.find(([key]) => pattern.test(normaliseKey(key)))?.[1];
  const copy = [source.description, ...(source.features ?? [])].filter(Boolean).join(" ");
  const withoutBattery = copy.match(/(?:weigh(?:ing|s)?\s+(?:just\s+|only\s+)?)(\d+(?:\.\d+)?\s*kgs?)\s+(?:without|excluding)\s+(?:(?:its|the|a)\s+)?batter(?:y|ies)/i)?.[1];
  const range = copy.match(/(?:range(?:\s+of)?\s+(?:up to\s+)?)(\d+(?:\.\d+)?\s*miles?)\b(?!\s*(?:per hour|\/h))/i)?.[1]
    ?? copy.match(/(\d+(?:\.\d+)?)[-\s]mile\s+range/i)?.[1]?.concat(" miles");
  const capacity = copy.match(/(?:maximum|max)\s+user\s+weight(?:\s+capacity)?(?:\s+of|\s+is|:)?\s*(\d+(?:\.\d+)?\s*kgs?)/i)?.[1];

  const facts: Array<Omit<ProductFact, "value"> & { value: string | undefined }> = [
    { id: "lifting", label: "Lifting weight", value: find(/heaviest (?:part|piece)|lifting weight/) },
    { id: "without-battery", label: "Weight without battery", value: find(/weight.*(?:without|excl|excluding).*batter|(?:without|excluding).*battery.*weight/) ?? withoutBattery },
    { id: "weight", label: "Listed weight", value: find(/^(?:weight|total weight|product weight|weight kg)$/) ?? (source.weight != null && source.weight > 0 ? `${source.weight} kg` : undefined) },
    { id: "folded", label: "Folded dimensions", value: find(/folded.*(?:dimension|size)|(?:dimension|size).*folded/) },
    { id: "range", label: "Range (up to)", value: find(/^(?:range|range miles|maximum range|travel range|driving range|battery range)$/) ?? range },
    { id: "capacity", label: "Maximum user weight", value: find(/(?:max|maximum).*user.*weight|weight capacity|user weight capacity/) ?? capacity },
    { id: "battery", label: "Battery", value: find(/^(?:battery|battery type|battery specification|battery capacity)$/) },
    { id: "battery-included", label: "Battery included", value: find(/^batter(?:y|ies) included$/) },
    { id: "dimensions", label: "Dimensions", value: find(/^(?:dimensions|size|overall dimensions)$/) },
  ];
  return facts.filter((fact): fact is ProductFact => typeof fact.value === "string" && Boolean(fact.value.trim()));
}
