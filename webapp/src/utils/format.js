/**
 * Price formatting and search normalization utility functions
 */

/**
 * Formats a numeric price into a custom spaced Uzbek currency string
 * Example: 35000 -> "35 000 so‘m"
 * @param {number|string} value - The numeric price
 * @returns {string} Formatted price
 */
export function formatPrice(value) {
  if (value === undefined || value === null) return "0 so‘m";
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return "0 so‘m";
  
  // Format with spaces as thousand separators
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
}

/**
 * Normalizes Uzbek Latin text for improved search matching
 * Converts special Uzbek characters (o‘, g‘, sh, ch) and punctuation
 * @param {string} text - The input search query or data text
 * @returns {string} Normalized lowercased searchable text
 */
export function normalizeText(text) {
  if (!text) return "";
  
  let normalized = text.toLowerCase();
  
  // Replace different apostrophe variants for o‘ and g‘
  normalized = normalized.replace(/[oо][‘'ʻ’`"]/g, "o");
  normalized = normalized.replace(/[gг][‘'ʻ’`"]/g, "g");
  
  // Replace Uzbek Cyrillic letters to Latin equivalent or match homoglyphs
  // (In case of hybrid input or simple user typings)
  normalized = normalized.replace(/ў/g, "o");
  normalized = normalized.replace(/ғ/g, "g");
  normalized = normalized.replace(/ш/g, "sh");
  normalized = normalized.replace(/ч/g, "ch");
  normalized = normalized.replace(/х/g, "x");
  normalized = normalized.replace(/ҳ/g, "h");
  normalized = normalized.replace(/қ/g, "q");
  
  // Strip remaining apostrophes and non-alphanumeric separators for match-focused comparison
  normalized = normalized.replace(/[^a-z0-9\s]/g, "");
  
  // Remove duplicate spaces
  normalized = normalized.replace(/\s+/g, " ").trim();
  
  return normalized;
}
