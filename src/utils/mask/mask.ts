export const mask = (
  value: string,
  target?: 'cpf' | 'celular' | 'telefone' | 'cnpj' | 'cep'
): string => {
  // Remove todos os caracteres não numéricos
  let onlyNumbers = value.replace(/\D/g, '');

  if (onlyNumbers.length === 11) {
    // Máscara para CELULAR: (61) 98109-5126
    if (
      target === 'celular' ||
      (!target && onlyNumbers.length === 11 && onlyNumbers[2] === '9')
    ) {
      return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (!target || target === 'cpf') {
      // Máscara para CPF: 000.000.000-00
      onlyNumbers = onlyNumbers.slice(0, 11);
      if (onlyNumbers.length > 9) {
        return onlyNumbers.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
          '$1.$2.$3-$4'
        );
      } else if (onlyNumbers.length > 6) {
        return onlyNumbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (onlyNumbers.length > 3) {
        return onlyNumbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      } else {
        return onlyNumbers;
      }
    }
  }

  if (!target || target === 'cnpj') {
    // Máscara para CNPJ: 00.000.000/0000-00
    if (onlyNumbers.length > 11 && onlyNumbers.length <= 14) {
      onlyNumbers = onlyNumbers.slice(0, 14);
      if (onlyNumbers.length > 12) {
        return onlyNumbers.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/,
          '$1.$2.$3/$4-$5'
        );
      } else if (onlyNumbers.length > 8) {
        return onlyNumbers.replace(
          /(\d{2})(\d{3})(\d{3})(\d{1,4})/,
          '$1.$2.$3/$4'
        );
      } else if (onlyNumbers.length > 5) {
        return onlyNumbers.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (onlyNumbers.length > 2) {
        return onlyNumbers.replace(/(\d{2})(\d{1,3})/, '$1.$2');
      } else {
        return onlyNumbers;
      }
    }
  }
  // Máscara para telefone fixo: (00) 0000-0000
  if ((!target && onlyNumbers.length === 10) || target === 'telefone') {
    return onlyNumbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Máscara para CEP: 00000-000
  if ((!target && onlyNumbers.length === 8) || target === 'cep') {
    return onlyNumbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  return value;
};
