import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

// Enum de acordo com o Prisma: AreaCandidato
const areaCandidato = ['MEDICINA', 'ENFERMAGEM', 'OUTRO'] as const;

export const AreaCandidatoEnum = z
  .enum(areaCandidato)
  .describe('Área de atuação é obrigatória');
export type AreaCandidatoEnumType = z.infer<typeof AreaCandidatoEnum>;

// Especialidade conforme Prisma
export const especialidadeSchema = z.object({
  id: z.number(), // Prisma usa Int (autoincrement)
  nome: z.string().min(1, 'Nome da especialidade é obrigatório').optional(),
  sigla: z.string().max(255).optional(),
});
export type EspecialidadeType = z.infer<typeof especialidadeSchema>;

// EspecialidadeMedico conforme Prisma
export const especialidadeMedicoSchema = z.object({
  id: z.uuid().optional(),
  rqe: z.string().max(255).nullable().optional(), // Prisma: rqe String?
  especialidade: especialidadeSchema, // Relação obrigatória no Prisma
});
export type EspecialidadeMedicoType = z.infer<typeof especialidadeMedicoSchema>;

// Crm conforme Prisma
export const crmSchema = z.object({
  id: z.uuid().optional(),
  numero: z.string().min(1), // Prisma: Int, mas como vem do formulário, pode ser string
  ufCrm: z.string().max(255), // Prisma: String, sem explicit max, .max(2) apenas validação frontend
  dataInscricao: z.string().or(z.date()), // Prisma: DateTime
  medicoId: z.uuid().optional().nullable(),
});
export type CrmType = z.infer<typeof crmSchema>;

// Medico conforme Prisma
export const medicoSchema = z.object({
  id: z.uuid().optional(),
  crm: z.array(crmSchema),
  especialidades: z.array(especialidadeMedicoSchema),
  quadroSocietario: z.string().nullable().optional(),
  quadroDeObservações: z.string().nullable().optional(),
  exames: z.string().nullable().optional(),
  especialidadesEnfermidades: z.string().nullable().optional(),
  porcentagemRepasseMedico: z.string().nullable().optional(),
  porcentagemConsultas: z.string().nullable().optional(),
  porcentagemExames: z.string().nullable().optional(),
  candidatoId: z.uuid().optional().nullable(),
});
export type MedicoType = z.infer<typeof medicoSchema>;

export const formacaoSchema = z.object({
  id: z.uuid().optional(),
  instituicao: z.string().nullable().optional(),
  curso: z.string().nullable().optional(),
  dataInicio: z.string().or(z.date()).nullable().optional(),
  dataFim: z.string().or(z.date()).nullable().optional(),
  dataInicioResidencia: z.string().or(z.date()).nullable().optional(),
  dataFimResidencia: z.string().or(z.date()).nullable().optional(),
  candidatoId: z.uuid().optional(),
});
export type FormacaoType = z.infer<typeof formacaoSchema>;

// Candidato conforme Prisma
export const candidatoSchema = z
  .object({
    id: z.uuid().optional(),
    corem: z.string().nullable().optional(),
    contatos: z.array(z.string()),
    emails: z.array(z.string()),
    links: z.array(z.string()),
    areaCandidato: AreaCandidatoEnum,
    pessoa: pessoaSchema,
    // candidaturaVaga, formacoes, anexos são tratados em outras telas/buscas
    formacoes: z.array(formacaoSchema).optional(),
    anexos: z
      .array(
        z.object({
          anexo: z.object({
            nomeArquivo: z.string(),
            mimetype: z.string().optional(),
            tamanhoKb: z.number().optional(),
            tipo: z.string(),
            url: z.string().optional().nullable(),
            fileObj: z.any().optional(), // File object do browser
          }),
          anexoId: z.string().optional(),
          candidatoId: z.string().optional(),
        })
      )
      .optional(),
    medico: medicoSchema.optional(),
    deletedAt: z.string().or(z.date()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.areaCandidato === 'MEDICINA' && !data.medico) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "O campo 'medico' é obrigatório quando área do candidato for 'MEDICINA'.",
        path: ['medico'],
      });
    }
  });

export type CandidatoType = z.infer<typeof candidatoSchema>;
