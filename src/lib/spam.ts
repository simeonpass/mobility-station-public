/**
 * Lightweight spam heuristics for enquiry forms.
 * Designed to catch common bot patterns (honeypot fills, instant POSTs,
 * gibberish names/messages) without a CAPTCHA. UK phone format is enforced
 * separately in the Zod schema.
 */

const MIN_SUBMIT_MS = 2_500;
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24; // 24h

/**
 * UK numbers should start with 0 (national) or +44 / 44 (international).
 * Rejects bare international-looking dumps like "9230161380".
 */
export function isLikelyUkPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return false;

  const trimmed = phone.trim().replace(/\s/g, "");
  if (/^(?:\+?44|0)/.test(trimmed)) {
    // After stripping country code, expect a national number starting with 1–9
    // (leading 0 may have been kept or dropped with +44).
    const national = digits.replace(/^44/, "").replace(/^0/, "");
    return national.length >= 9 && national.length <= 10 && /^[1-9]/.test(national);
  }
  return false;
}

/**
 * Detects random letter dumps like "SeGudpRSgkCkUqklqHvAuCjy".
 * Real names rarely have long single tokens with many mid-word case flips
 * or long consonant runs.
 */
export function looksLikeGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 8) return false;

  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (lettersOnly.length < 8) return false;

  // Long run of consonants (case-insensitive)
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(lettersOnly)) return true;

  // Very low vowel ratio on longer strings
  const vowels = (lettersOnly.match(/[aeiouAEIOU]/g) ?? []).length;
  if (lettersOnly.length >= 12 && vowels / lettersOnly.length < 0.22) {
    return true;
  }

  // Single-token mixed-case blobs (bots love camelCase garbage)
  if (!/\s/.test(trimmed) && trimmed.length >= 12) {
    const caseChanges = (trimmed.match(/[a-z][A-Z]|[A-Z][a-z]/g) ?? []).length;
    if (caseChanges >= 4) return true;
  }

  return false;
}

export type SpamCheckInput = {
  honeypot?: string;
  formStartedAt?: string;
  name: string;
  message?: string;
};

export type SpamCheckResult =
  | { spam: false }
  | { spam: true; reason: string };

export function checkEnquirySpam(input: SpamCheckInput): SpamCheckResult {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { spam: true, reason: "honeypot" };
  }

  const started = Number(input.formStartedAt);
  if (!Number.isFinite(started) || started <= 0) {
    return { spam: true, reason: "missing_timing" };
  }

  const age = Date.now() - started;
  if (age < MIN_SUBMIT_MS) {
    return { spam: true, reason: "too_fast" };
  }
  if (age > MAX_FORM_AGE_MS) {
    return { spam: true, reason: "stale_form" };
  }

  if (looksLikeGibberish(input.name)) {
    return { spam: true, reason: "gibberish_name" };
  }

  if (input.message && looksLikeGibberish(input.message)) {
    return { spam: true, reason: "gibberish_message" };
  }

  return { spam: false };
}
