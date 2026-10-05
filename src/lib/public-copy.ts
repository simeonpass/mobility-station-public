/** Correct verified spelling errors in imported public copy; keep identifiers and URLs intact. */
export function correctPublicCopy(value: string): string {
  return value
    .replace(/\b[Rr]emoveable\b/g, (word) => word[0] === "R" ? "Removable" : "removable")
    .replace(/\b[Bb]attary\b/g, (word) => word[0] === "B" ? "Battery" : "battery")
    .replace(/\bDevillbiss\b/gi, "DeVilbiss")
    .replace(/\bBournmouth\b/g, "Bournemouth")
    .replace(/\bMotion Health care\b/g, "Motion Healthcare");
}

/** These legacy article titles contain confirmed grammar and model-name errors. */
export function correctArticleTitle(value: string): string {
  return correctPublicCopy(value)
    .replace(/\bin to\b/gi, "into")
    .replace(/\bits time\b/g, "it's time")
    .replace(/\bSkoda Kodiak\b/g, "Skoda Kodiaq")
    .replace(/\bXtrail\b/g, "X-Trail");
}
