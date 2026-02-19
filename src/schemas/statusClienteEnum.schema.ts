import z from 'zod';

export const StatusClienteEnum = z.enum(
  ['PROSPECT', 'LEAD', 'ATIVO', 'INATIVO'],
  { error: 'Status do cliente é obrigatório' }
);

export type StatusClienteEnumInput = z.infer<typeof StatusClienteEnum>;

export const StatusContratoEnum = z.enum(
  ['SEM_STATUS', 'EM_CONTROLE', 'NEGOCIANDO', 'ASSINADO', 'CONCLUIDO'],
  { error: 'Status do contrato é obrigatório' }
);

export type StatusContratoEnumInput = z.infer<typeof StatusContratoEnum>;