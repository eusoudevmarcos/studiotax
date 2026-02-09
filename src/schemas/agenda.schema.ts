import { z } from 'zod';
import { candidatoSchema } from './candidato.schema';
import { localizacaoSchema } from './localizacao.schema';

const MIN_LEAD_MS = 1 * 60 * 1000;

const tipoEventoEnum = z.enum(
  [
    'TRIAGEM_INICIAL',
    'ENTREVISTA_RH',
    'ENTREVISTA_GESTOR',
    'TESTE_TECNICO',
    'TESTE_PSICOLOGICO',
    'DINAMICA_GRUPO',
    'PROPOSTA',
    'OUTRO',
  ],
  { error: 'Tipo de evento é obrigatorio' }
);

const etapaAtualSchema = z.object({
  nome: z.string().min(1, 'Nome da etapa é obrigatório'),
  tipo: z.string().min(1, 'Tipo da etapa é obrigatório'),
  ordem: z.number().int().min(1, 'Ordem deve ser um número inteiro positivo'),
  descricao: z.string().optional(),
  ativa: z.boolean(),
});

export const agendaSchema = z
  .object({
    titulo: z
      .string('Titulo Obrigatorio')
      .min(3, 'O título é obrigatório e deve ter ao menos 3 caracteres'),
    descricao: z.string().optional(),

    dataHora: z.string().refine(
      val => {
        if (!val) return false;
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.getTime() >= Date.now() + MIN_LEAD_MS;
      },
      { message: 'Data e hora devem não podem ser marcados no passado' }
    ),

    tipoEvento: tipoEventoEnum,

    link: z.url('Link inválido').optional(),
    localizacao: localizacaoSchema.optional(),

    convidados: z
      .array(z.email('Convidado deve ser um e-mail válido'))
      .min(1, 'Adicione pelo menos um convidado')
      .optional(),

    etapaAtual: etapaAtualSchema.optional(),

    localEvento: z.string().default('REMOTO').optional(),
    // lembreteMinutos: z.number().min(5).max(1440).optional(),

    vagaId: z.uuid('Vaga é obrigatorio para o candidato').optional(),
    candidatoId: z.uuid().optional(),
    candidato: candidatoSchema.optional(),
  })
  .refine(
    data => {
      // Se candidatoId existe, vagaId deve existir
      if (data.candidatoId) {
        return !!data.vagaId;
      }
      return true;
    },
    {
      message: 'vagaId é obrigatório quando candidatoId está presente',
      path: ['vagaId'],
    }
  );

export type AgendaInput = z.infer<typeof agendaSchema>;
