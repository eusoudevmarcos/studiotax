import z from 'zod';

export const StatusClienteEnum = z.enum(
  ['PROSPECT', 'LEAD', 'ATIVO', 'INATIVO'],
  { error: 'Status do cliente é obrigatório' }
);

export type StatusClienteEnumInput = z.infer<typeof StatusClienteEnum>;
