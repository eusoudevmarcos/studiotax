/**
 * Remove a máscara de CPF, CNPJ ou CEP, retornando apenas os números.
 * @param valor string com máscara (ex: "123.456.789-00", "12.345.678/0001-99", "12345-678")
 * @returns string apenas com números
 */
/**
 * Remove a máscara de CPF, CNPJ, CEP, Telefone (fixo/celular).
 * Se não for nenhum desses formatos (ex: nome, razão social), retorna o valor original.
 * @param valor string mascarada
 * @returns string sem máscara ou valor original
 */
export function unmask(valor: string): string {
  if (!valor) return "";

  // Remove todos os caracteres não numéricos
  const somenteNumeros = valor.replace(/\D/g, "");

  // CNPJ: 14 dígitos
  if (somenteNumeros.length === 14) {
    return somenteNumeros;
  }

  // CPF: 11 dígitos
  // Celular: 11 dígitos (ex: (61) 98888-7777)
  if (somenteNumeros.length === 11) {
    return somenteNumeros;
  }

  // Telefone fixo: 10 dígitos (ex: (61) 3333-4444)
  if (somenteNumeros.length === 10) {
    return somenteNumeros;
  }

  // CEP: 8 dígitos
  if (somenteNumeros.length === 8) {
    return somenteNumeros;
  }

  // Se não for nenhum dos casos acima, retorna o valor original (ex: nome, razão social)
  return valor;
}
