export function getField<T>(obj: any, keys: string[]): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined) return obj[k];
    // Try case-insensitive matching
    const lowerKey = k.toLowerCase();
    const foundKey = Object.keys(obj).find(x => x.toLowerCase() === lowerKey);
    if (foundKey && obj[foundKey] !== undefined) {
      return obj[foundKey];
    }
  }
  return undefined;
}

export function parseDate(dateStr: any): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}
