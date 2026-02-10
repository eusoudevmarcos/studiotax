export function getError(errors: unknown, path: string): string | undefined {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let obj: unknown = errors;
  for (const p of parts) {
    obj = obj && typeof obj === 'object' && p in obj ? (obj as Record<string, unknown>)[p] : undefined;
    if (!obj) return undefined;
  }
  return obj && typeof obj === 'object' && 'message' in obj && typeof (obj as { message?: unknown }).message === 'string'
    ? (obj as { message: string }).message
    : undefined;
}
