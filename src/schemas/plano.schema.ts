// plano.schema.ts
import { z } from 'zod';

export const planoCategoriaEnum = z.enum([
  'PLATAFORMA',
  'RECRUTAMENTO_COM_RQE',
  'RECRUTAMENTO_SEM_RQE',
  'RECRUTAMENTO_DIVERSOS',
]);
export const PlanoCategoriaEnum = planoCategoriaEnum;

export type PlanoCategoriaEnum = z.infer<typeof planoCategoriaEnum>;

export const planoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string().optional(),
  preco: z.number(),
  tipo: z.enum(['MENSAL', 'ANUAL', 'POR_USO']),
  diasGarantia: z.number().optional(),
  limiteUso: z.number().optional(),
  ativo: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  categoria: planoCategoriaEnum,
});

export type Plano = z.infer<typeof planoSchema>;

export const planoAssinadoSchema = z.object({
  id: z.string().optional(),
  status: z.enum(['ATIVA', 'INATIVA', 'EXPIRADA', 'CANCELADA']).optional(),
  dataAssinatura: z.string().optional(),
  dataExpiracao: z.string().optional(),
  qtdVagas: z.number().optional(),
  precoPersonalizado: z.number().optional(),
  porcentagemMinima: z.number().optional(),
  observacoes: z.string().optional(),
  usosDisponiveis: z.number().optional(),
  usosConsumidos: z.number().optional(),
  clienteId: z.string().optional(),
  planoId: z.string(),
});

export type PlanoAssinado = z.infer<typeof planoAssinadoSchema>;
