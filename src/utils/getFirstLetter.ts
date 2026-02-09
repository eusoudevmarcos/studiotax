export function getFirstLetter(nome?: string): string {
  if (!nome) return "";
  return nome.trim().charAt(0).toUpperCase();
}
