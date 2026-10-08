/** Shared, deterministic catalogue matching. No database or browser dependencies. */
export type SearchableProduct = {
  id: string;
  name: string;
  slug: string;
  manufacturer?: string | null;
  category?: string | null;
  sku?: string | null;
  description?: string | null;
  features?: string[] | null;
  seo_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean;
  product_type?: string | null;
  published_to_website?: boolean;
  website_visible?: boolean;
};

export const MAX_SEARCH_LENGTH = 120;
const STOP_WORDS = new Set(["a", "an", "and", "the", "for", "with", "to", "of", "in", "by", "me", "find", "show", "please", "i", "need", "want"]);

export function cleanSearchQuery(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] ?? "" : value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_SEARCH_LENGTH);
}

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|nbsp|quot|apos|lt|gt);|&#\d+;/gi, " ")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function normalise(value: string): string {
  return plainText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(?:powered|power|electric)\s*wheel\s*chairs?\b|\bpower\s*chairs?\b/g, "powerchair")
    .replace(/\bwheel\s+chairs?\b/g, "wheelchair")
    .replace(/\bgo\s+go\b/g, "gogo")
    .replace(/\bfree\s+dom\s*chairs?\b|\bfreedom\s+chairs?\b/g, "freedomchair")
    .replace(/\bauto\s+chairs?\b/g, "autochair")
    .replace(/\bguido\s+simplex\b/g, "guidosimplex")
    .replace(/\bhealth\s+care\b/g, "healthcare")
    .replace(/\b(?:folding|foldable|folded)\b/g, "fold")
    .replace(/\b(?:auto\s*folding|autofold)\b/g, "auto fold")
    .replace(/\b(?:light\s*weight|lightweight)\b/g, "lightweight")
    .replace(/\b(?:second\s*hand|pre\s*owned)\b/g, "used")
    .replace(/\btires?\b/g, "tyre")
    .replace(/(\d)\s+(kg|ah|mph|amp|v|cm)\b/g, "$1$2")
    .trim().replace(/\s+/g, " ");
}

function stem(word: string): string {
  if (/\d/.test(word)) return word;
  if (word.endsWith("ies") && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith("s") && word.length > 3 && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

function words(value: string): string[] {
  return normalise(value).split(" ").filter(Boolean).map(stem);
}

function compact(value: string): string {
  return plainText(value).replace(/[^a-z0-9]/g, "");
}

function aliases(product: SearchableProduct): string {
  const category = normalise(product.category ?? "");
  const primary = normalise(`${product.name} ${category}`);
  return [
    primary.includes("powerchair") ? "wheelchair electric powered" : "",
    category.includes("small scooter") ? "boot scooter portable scooter" : "",
    category.includes("boot hoist") ? "scooter hoist wheelchair hoist car hoist" : "",
    category.includes("steering aid") ? "steering ball spinner knob" : "",
    category.includes("walking aid") ? "walking aid" : "",
  ].join(" ");
}

function tokenSet(value: string, joined = false): Set<string> {
  const tokens = words(value);
  const result = new Set(tokens);
  if (joined) {
    // Model names and SKUs are often typed with different spaces or hyphens.
    for (let i = 0; i < tokens.length; i++) {
      for (let count = 2; count <= 3 && i + count <= tokens.length; count++) {
        result.add(tokens.slice(i, i + count).join(""));
      }
    }
  }
  return result;
}

function tokenMatch(term: string, tokens: Set<string>): boolean {
  if (tokens.has(term)) return true;
  // Partial names are useful; short words and numeric models must stay precise.
  return term.length >= 3 && !/^\d+$/.test(term) && [...tokens].some(token => token.startsWith(term));
}

/** Bounded Damerau-Levenshtein distance: includes adjacent mistyped letters. */
function isCloseWord(a: string, b: string): boolean {
  if (!/^[a-z]{4,}$/.test(a) || !/^[a-z]{4,}$/.test(b)) return false;
  const max = a.length >= 8 ? 2 : 1;
  if (Math.abs(a.length - b.length) > max) return false;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  let beforePrevious = previous;
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
      }
    }
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length] <= max;
}

export function rankProductSearch<T extends SearchableProduct>(products: T[], rawQuery: string): {
  items: T[];
  approximate: boolean;
} {
  const query = cleanSearchQuery(rawQuery);
  const terms = [...new Set(words(query).filter(word => !STOP_WORDS.has(word)))];
  if (!terms.length) return { items: [], approximate: false };
  const phrase = compact(query);
  const accessoryIntent = /\b(battery|batteries|charger|accessor\w*|bag|cushion|tyre|tire|tube|cover|mirror|headrest|armrest|spare|wheel|holder|support)\b/i.test(query);
  const documents = products.filter(product => product.slug.trim() && product.product_type !== "archived" && product.published_to_website !== false && product.website_visible !== false).map(product => {
    const name = tokenSet(product.name, true);
    const primary = tokenSet([product.name, product.manufacturer, product.category, product.sku, aliases(product)].filter(Boolean).join(" "), true);
    const detail = tokenSet([product.description, ...(product.features ?? []), product.seo_title, product.meta_description].filter(Boolean).join(" "));
    const compactName = compact(product.name);
    const exactName = compactName === phrase;
    const exactSku = Boolean(product.sku && compact(product.sku) === phrase);
    const nameParts = plainText(product.name).split(/[^a-z0-9]+/).filter(Boolean);
    const phraseHit = phrase.length >= 3 && !/^\d+$/.test(phrase) && nameParts.some((_, index) => nameParts.slice(index).join("").startsWith(phrase));
    const accessory = /accessor|batter|charger|canop/i.test(product.category ?? "");
    return { product, name, primary, detail, exactName, exactSku, phraseHit, accessory };
  });

  function findMatches(allowTypos: boolean) {
    const intentMatches = (target: string) => terms.some(term => term === target || (term.length >= 4 && target.startsWith(term)) || (allowTypos && isCloseWord(term, target)));
    const family = intentMatches("hoist") ? "hoist" : intentMatches("powerchair") ? "powerchair" : intentMatches("wheelchair") ? "wheelchair" : intentMatches("scooter") ? "scooter" : null;
    const scored: { product: T; score: number }[] = [];
    for (const doc of documents) {
      let score = doc.exactSku ? 10000 : doc.exactName ? 9000 : doc.phraseHit ? 1200 : 0;
      let unmatched = false;
      let typos = 0;
      for (const term of terms) {
        if (tokenMatch(term, doc.name)) score += 60;
        else if (tokenMatch(term, doc.primary)) score += 40;
        else if (doc.detail.has(term)) score += 8;
        else if (doc.exactSku || doc.exactName || doc.phraseHit) continue;
        else if (allowTypos && typos < 2 && [...doc.name].some(word => isCloseWord(term, word))) { score += 45; typos++; }
        else if (allowTypos && typos < 2 && [...doc.primary].some(word => isCloseWord(term, word))) { score += 25; typos++; }
        else { unmatched = true; break; }
      }
      if (unmatched) continue;
      const category = normalise(doc.product.category ?? "");
      const categoryFamily = category.match(/(?:^|\s)(scooter|powerchair|wheelchair|hoist)s?$/)?.[1];
      if (family && (categoryFamily === family || (family === "wheelchair" && categoryFamily === "powerchair"))) score += 2000;
      if (doc.accessory && !accessoryIntent && !doc.exactName && !doc.exactSku) score -= 1600;
      scored.push({ product: doc.product, score });
    }
    scored.sort((a, b) => b.score - a.score || Number(Boolean(b.product.is_featured)) - Number(Boolean(a.product.is_featured)) || a.product.name.localeCompare(b.product.name) || a.product.id.localeCompare(b.product.id));
    return scored.map(match => match.product);
  }

  const exact = findMatches(false);
  if (exact.length) return { items: exact, approximate: false };
  const approximate = findMatches(true);
  return { items: approximate, approximate: approximate.length > 0 };
}
