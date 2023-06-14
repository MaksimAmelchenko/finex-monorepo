export function normalizeKey(text: string): string {
  return text.replace(/\./g, '_');
}
