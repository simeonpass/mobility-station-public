/** Canonical names for catalogue filters and product information. */
const BRAND_NAMES: Record<string, string> = {
  drive: "Drive Medical",
  drivemedical: "Drive Medical",
  eezychair: "EezyChair",
  freedomchair: "FreedomChair",
  karma: "Karma",
  karmamobility: "Karma",
  kymco: "Kymco",
  kymcohealthcare: "Kymco",
  motionhealthcare: "Motion Healthcare",
  pride: "Pride Mobility",
  pridemobility: "Pride Mobility",
  tga: "TGA",
  tgamobility: "TGA",
  whill: "WHILL",
};

export function normaliseManufacturer(value: string | null | undefined): string {
  const name = value?.trim().replace(/\s+/g, " ") ?? "";
  return BRAND_NAMES[name.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? name;
}

/** Remove imported retailer introductions without changing product claims. */
export function cleanProductDescription(value: string | null | undefined): string | null {
  if (!value) return null;
  return value
    .replace(/At Lightweight Mobility,?\s+we are proud to offer\s+the\s+/gi, "The ")
    .replace(/At Lightweight Mobility,?\s+/gi, "At Mobility Station, ")
    .replace(/,?\s*available now at Lightweight Mobility\.?/gi, ".")
    .replace(/\b(?:from|at) Lightweight Mobility\b/gi, (match) => match.replace("Lightweight Mobility", "Mobility Station"))
    .trim();
}
