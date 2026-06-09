export function getField<T>(obj: any, keys: string[]): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined;

  const normalizeKey = (value: string) =>
    value.toLowerCase().replace(/[\s_\-+]+/g, '');

  for (const k of keys) {
    if (obj[k] !== undefined) return obj[k];

    const target = normalizeKey(k);
    const foundKey = Object.keys(obj).find((x) => normalizeKey(x) === target);

    if (foundKey && obj[foundKey] !== undefined) {
      return obj[foundKey];
    }
  }

  return undefined;
}

export function asArray<T = any>(value: any): T[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === 'object') {
    const values = Object.values(value);

    const nestedArrays = values.filter(Array.isArray).flat();
    if (nestedArrays.length > 0) {
      return nestedArrays as T[];
    }

    const objectValues = values.filter(
      (item) => item && typeof item === 'object'
    );

    if (objectValues.length > 0) {
      return objectValues as T[];
    }
  }

  return [];
}

export function parseJsonLoose(rawJson: string): any {
  const cleaned = rawJson.replace(/^\uFEFF/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const firstObject = cleaned.indexOf('{');
    const firstArray = cleaned.indexOf('[');

    const starts = [firstObject, firstArray].filter((x) => x >= 0);
    const start = starts.length > 0 ? Math.min(...starts) : -1;

    const end = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error('JSON_PARSE_FAILED');
  }
}

export function parseDate(dateStr: any): Date | null {
  if (!dateStr) return null;

  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }

  if (typeof dateStr === 'number') {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof dateStr !== 'string') return null;

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;

  return parsed;
}
