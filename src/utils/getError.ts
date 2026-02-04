export function getError(errors: any, path: string): string | undefined {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let obj = errors;
  for (const p of parts) {
    obj = obj?.[p];
    if (!obj) return undefined;
  }
  return obj?.message;
}
