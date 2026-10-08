/**
 * Lightweight HTML allowlist sanitiser for admin-authored blog HTML.
 * Strips scripts, event handlers, and dangerous protocols.
 */
export function sanitizeBlogHtml(html: string): string {
  let out = html;

  // Remove dangerous elements entirely (including content)
  out = out.replace(
    /<(script|style|iframe|object|embed|form|link|meta|base)(\s[^>]*)?>[\s\S]*?<\/\1>/gi,
    "",
  );
  out = out.replace(
    /<(script|style|iframe|object|embed|form|link|meta|base)(\s[^>]*)?\/?>/gi,
    "",
  );

  // Strip event handler attributes
  out = out.replace(/\s+on[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, "");
  out = out.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, "");

  // Neutralise javascript: / data: in href/src (keep https/http/mailto/relative)
  out = out.replace(
    /\s(href|src)\s*=\s*(["'])\s*(javascript|data|vbscript):[\s\S]*?\2/gi,
    ' $1="#"',
  );

  return out;
}

export function plainTextToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map((para) => `<p>${escapeHtml(para.trim())}</p>`)
    .join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
