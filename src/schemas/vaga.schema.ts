// src/schemas/vaga.schema.ts
import { z } from 'zod';
import { clienteWithEmpresaSchema } from './cliente.schema';
import { localizacaoSchema } from './localizacao.schema';

// TRIAGEM
export const TipoEventoTriagemEnum = z.enum([
  'TRIAGEM_INICIAL',
  'ENTREVISTA_RH',
  'ENTREVISTA_GESTOR',
  'TESTE_TECNICO',
  'TESTE_PSICOLOGICO',
  'DINAMICA_GRUPO',
  'PROPOSTA',
  'OUTRO',
]);
export type TipoEventoTriagemEnum = z.infer<typeof TipoEventoTriagemEnum>;

export const triagemSchema = z.object({
  id: z.uuid().optional(),
  tipoTriagem: TipoEventoTriagemEnum,
  ativa: z.boolean().default(true).optional(),
});
export type TriagemInput = z.infer<typeof triagemSchema>;

export const CategoriaVagaEnum = z.enum(
  [
    'TECNOLOGIA',
    'SAUDE',
    'ADMINISTRATIVO',
    'FINANCEIRO',
    'RECURSOS_HUMANOS',
    'MARKETING',
    'VENDAS',
    'OUTROS',
  ],
  'Categoria da vaga é obrigatório'
);
export type CategoriaVagaEnum = z.infer<typeof CategoriaVagaEnum>;

export const StatusVagaEnum = z.enum(
  [
    'ALINHAMENTO',
    'ABERTA',
    'DIVULGACAO',
    'TRIAGEM_DE_CURRICULO',
    'CONCUIDA',
    'GARANTIA',
    'PAUSADA',
    'ENCERRADA',
    'ARQUIVADA',
  ],
  'Status da vaga é obrigatório'
);

export type StatusVagaEnum = z.infer<typeof StatusVagaEnum>;

export const TipoContratoEnum = z.enum(
  ['CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO'],
  'Tipo de contrato é obrigatório'
);
export type TipoContratoEnum = z.infer<typeof TipoContratoEnum>;

export const NivelExperienciaEnum = z.enum(
  ['ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE'],
  'Nível de experiencia é obrigatório'
);
export type NivelExperienciaEnum = z.infer<typeof NivelExperienciaEnum>;

export const TipoHabilidadeEnum = z.enum([
  'TECNICA',
  'COMPORTAMENTAL',
  'IDIOMA',
  'OUTRA',
]);
export type TipoHabilidadeEnum = z.infer<typeof TipoHabilidadeEnum>;

export const NivelExigidoEnum = z.enum([
  'BASICO',
  'INTERMEDIARIO',
  'AVANCADO',
  'FLUENTE',
  'NATIVO',
]);
export type NivelExigidoEnum = z.infer<typeof NivelExigidoEnum>;

// SCHEMA PARA UMA ÚNICA HABILIDADE
export const habilidadeSchema = z.object({
  nome: z.string().min(1, 'O nome da habilidade é obrigatório.'),
  tipoHabilidade: TipoHabilidadeEnum,
  nivelExigido: NivelExigidoEnum,
});

export type HabilidadeInput = z.infer<typeof habilidadeSchema>;

// SCHEMA PARA UM ÚNICO BENEFÍCIO
export const beneficioSchema = z.object({
  nome: z.string().min(1, 'O nome do benefício é obrigatório.'),
  descricao: z.string(),
});
export type BeneficioInput = z.infer<typeof beneficioSchema>;

// VAGA
export const vagaSchema = z.object({
  id: z.uuid().optional(),
  titulo: z.string().min(3, 'O título da vaga é obrigatório.'),
  status: StatusVagaEnum,
  nivelExperiencia: NivelExperienciaEnum.optional(),
  tipoContrato: TipoContratoEnum.optional(),
  categoria: CategoriaVagaEnum.optional(),
  tipoSalario: z.string().optional(),
  salario: z.string().optional(),
  descricao: z.string().min(20, 'minimo 20 caracteres'),
  localizacao: localizacaoSchema.optional(),
  dataPublicacao: z.string(),
  // triagens: z.array(triagemSchema).max(4, 'Máximo de 4 triagens').optional(),
});
export type VagaInput = z.infer<typeof vagaSchema>;

// VAGA + Cliente
export const vagaWithClienteSchema = vagaSchema.extend({
  cliente: z
    .lazy(() => clienteWithEmpresaSchema)
    .nullable()
    .optional(),
  clienteId: z.string(),
  tipoLocalTrabalho: z.string(),
});
export type VagaWithClienteInput = z.infer<typeof vagaWithClienteSchema>;

export const KanbanVagaCardMetadataSchema = z.object({
  categoria: z.string(),
  dataPublicacao: z.string(),
  totalCandidaturas: z.number(),
});
export type KanbanVagaCardMetadata = z.infer<
  typeof KanbanVagaCardMetadataSchema
>;

export const KanbanVagaCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  label: z.string(),
  draggable: z.boolean(),
  metadata: KanbanVagaCardMetadataSchema,
});
export type KanbanVagaCard = z.infer<typeof KanbanVagaCardSchema>;

export const KanbanVagaColumnSchema = z.object({
  lanes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      label: z.string(),
      cards: z.array(KanbanVagaCardSchema),
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasMore: z.boolean(),
    })
  ),
  _count: z.number().optional(),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
export type KanbanVagaColumn = z.infer<typeof KanbanVagaColumnSchema>;

/** Lista KanbanVaga do cliente (Quadro por status de vaga) */
export const KanbanVagaResponseSchema = KanbanVagaColumnSchema;
export type KanbanVagaResponse = z.infer<typeof KanbanVagaResponseSchema>;

// VAGA + Cliente + PROFISSIONAIS
// export const vagaWithClienteAndCandidatosSchema = vagaSchema.extend({
//   cliente: z
//     .lazy(() => clienteSchema)
//     .nullable()
//     .optional(),
//   clienteId: z.string(),
// });
// export type vagaWithClienteAndCandidatosInput = z.infer<
//   typeof vagaWithClienteAndCandidatosSchema
// >;
