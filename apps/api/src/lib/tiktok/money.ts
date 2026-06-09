export function parseVnd(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Math.floor(value);
  if (typeof value !== 'string') return null;

  // Remove currency marks like VND, đ, $, etc.
  let cleaned = value.replace(/[a-zA-Zđđ₫\s]/g, '');

  if (!cleaned) return null;

  // Let's decide how to parse thousands separators (comma vs dot).
  // In Vietnamese context:
  // 145.600 -> 145600
  // 1,456,000 -> 1456000
  // If there are multiple dots or commas, we can just strip them.
  // Let's look for dots/commas.
  // If a string contains only one separator and it has 2 digits after it, it might be a decimal (e.g. 145600.00).
  // But usually TikTok Shop exports VND without decimals, using either commas or dots as thousands separators.
  // So if we strip all dots and commas, it works perfectly for:
  // "145600" -> 145600
  // "145.600" -> 145600
  // "1,456,000" -> 1456000
  // "1.456.000" -> 1456000
  // What if it is a decimal like "10.5" USD or something? But we are focused on VND.
  // If there's a decimal, e.g. "145600.00", stripping all dot/commas will make it "14560000", which is 100x larger.
  // To handle decimals safely: if the last separator is a dot/comma and is followed by exactly 2 zeros or digits,
  // we can treat it as a decimal point, especially if there are no other separators.
  // Let's write a robust parser.
  
  // If we have commas and dots, let's look at the structure.
  // Check if there's a decimal part.
  const hasDecimal = /[\.,]\d{2}$/.test(cleaned);
  if (hasDecimal) {
    // Strip everything except the last separator, and replace the last separator with a standard dot
    const decimalIndex = cleaned.length - 3;
    const integerPart = cleaned.substring(0, decimalIndex).replace(/[\.,]/g, '');
    const decimalPart = cleaned.substring(decimalIndex + 1);
    const num = parseFloat(`${integerPart}.${decimalPart}`);
    return isNaN(num) ? null : Math.floor(num);
  } else {
    // Just remove all dots and commas
    const integerOnly = cleaned.replace(/[\.,]/g, '');
    const num = parseInt(integerOnly, 10);
    return isNaN(num) ? null : num;
  }
}
