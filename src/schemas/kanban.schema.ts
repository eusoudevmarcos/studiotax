import { z } from 'zod';

// ===================== ENUMS =====================
export const TipoEntidadeEnum = z.enum([
  'VAGA',
  'CANDIDATO',
  'CLIENTE',
  'COMPROMISSO',
]);
export type TipoEntidadeEnum = z.infer<typeof TipoEntidadeEnum>;

export const RecorrenciaCardEnum = z.enum([
  'NENHUMA',
  'DIARIA',
  'SEMANAL',
  'MENSAL',
]);
export type RecorrenciaCardEnum = z.infer<typeof RecorrenciaCardEnum>;

// ===================== HELPER PARA DATAS =====================
// Aceita tanto string ISO quanto Date object
const dateSchema = z
  .union([z.string().datetime(), z.date(), z.string()])
  .transform(val => {
    if (val instanceof Date) {
      return val.toISOString();
    }
    if (typeof val === 'string') {
      // Se já é uma string ISO válida, retorna como está
      if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        return val;
      }
      // Tenta converter para ISO
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return val;
  });

// ===================== ESPAÇO DE TRABALHO =====================
export const espacoTrabalhoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
  _count: z.object({
    quadros: z.number(),
  }).optional(),
});

export const espacoTrabalhoInputSchema = z.object({
  nome: z.string().min(1, 'Nome do espaço de trabalho é obrigatório'),
});

export type EspacoTrabalho = z.infer<typeof espacoTrabalhoSchema>;
export type EspacoTrabalhoInput = z.infer<typeof espacoTrabalhoInputSchema>;

// ===================== QUADRO KANBAN =====================
export const quadroKanbanSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  espacoTrabalhoId: z.string(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export const quadroKanbanInputSchema = z.object({
  titulo: z.string().min(1, 'Título do quadro é obrigatório'),
  espacoTrabalhoId: z.string().min(1, 'ID do espaço de trabalho é obrigatório'),
});

export type QuadroKanban = z.infer<typeof quadroKanbanSchema>;
export type QuadroKanbanInput = z.infer<typeof quadroKanbanInputSchema>;

export const vinculoCardSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  tipoEntidade: TipoEntidadeEnum,
  vagaId: z.string().nullable(),
  candidatoId: z.string().nullable(),
  clienteId: z.string().nullable(),
  compromissoId: z.string().nullable(),
  criadoEm: dateSchema,
  vaga: z
    .object({
      id: z.string(),
      titulo: z.string(),
      status: z.string(),
    })
    .nullable()
    .optional(),
  candidato: z
    .object({
      id: z.string(),
      pessoa: z.object({
        id: z.string(),
        nome: z.string(),
      }),
    })
    .nullable()
    .optional(),
  cliente: z
    .object({
      id: z.string(),
      empresa: z.object({
        id: z.string(),
        razaoSocial: z.string(),
        nomeFantasia: z.string().nullable(),
      }),
    })
    .nullable()
    .optional(),
  compromisso: z
    .object({
      id: z.string(),
      titulo: z.string(),
      dataHora: dateSchema,
    })
    .nullable()
    .optional(),
});

// ===================== USUARIO SISTEMA =====================
export const usuarioSistemaSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    funcionario: z
      .object({
        pessoa: z.object({
          nome: z.string(),
        }),
      })
      .nullable()
      .optional(),
    cliente: z
      .object({
        empresa: z.object({
          razaoSocial: z.string(),
          nomeFantasia: z.string().nullable(),
        }),
      })
      .nullable()
      .optional(),
  })
  .nullable()
  .optional();

export type UsuarioSistema = z.infer<typeof usuarioSistemaSchema>;

// ===================== ETIQUETAS / DATAS / CHECKLIST / MEMBROS =====================

export const etiquetaQuadroSchema = z.object({
  id: z.string(),
  quadroKanbanId: z.string(),
  nome: z.string(),
  cor: z.string(),
  ordem: z.number().nullable().optional(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export type EtiquetaQuadro = z.infer<typeof etiquetaQuadroSchema>;

export const cardKanbanDataSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  dataInicio: dateSchema.nullable().optional(),
  dataEntrega: dateSchema.nullable().optional(),
  recorrencia: RecorrenciaCardEnum,
  lembreteMinutosAntes: z.number().nullable().optional(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export const checklistItemSchema = z.object({
  id: z.string(),
  checklistCardId: z.string(),
  descricao: z.string(),
  concluido: z.boolean(),
  ordem: z.number(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export const checklistCardSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  titulo: z.string(),
  ordem: z.number(),
  itens: z.array(checklistItemSchema),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type ChecklistCard = z.infer<typeof checklistCardSchema>;

export const membroCardSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  usuarioSistemaId: z.string(),
  usuarioSistema: z
    .object({
      id: z.string(),
      email: z.string(),
      funcionario: z.object({
        pessoa: z.object({
          nome: z.string(),
        }),
      }).nullable().optional(),
      cliente: z.object({
        empresa: z.object({
          nomeFantasia: z.string().nullable(),
          razaoSocial: z.string(),
        }),
      }).nullable().optional(),
    })
    .nullable()
    .optional(),
  criadoEm: dateSchema,
});

export type MembroCard = z.infer<typeof membroCardSchema>;

export const cardEtiquetaSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  etiquetaQuadroId: z.string(),
  etiqueta: etiquetaQuadroSchema.optional().nullable(),
  criadoEm: dateSchema,
});

export const cardKanbanSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z.string().nullable(),
  ordem: z.number(),
  colunaKanbanId: z.string(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
  vinculos: z.array(vinculoCardSchema).optional(),
  datas: cardKanbanDataSchema.optional().nullable(),
  etiquetas: z.array(cardEtiquetaSchema).optional(),
  checklists: z.array(checklistCardSchema).optional(),
  membros: z.array(membroCardSchema).optional(),
  checklistCompleto: z.boolean().optional(),
  usuarioSistemaId: z.string().nullable().optional(),
  usuarioSistema: usuarioSistemaSchema.nullable().optional(),
});

export type CardKanban = z.infer<typeof cardKanbanSchema>;
export type CardKanbanInput = z.infer<typeof cardKanbanInputSchema>;

// ===================== COLUNA KANBAN =====================
export const colunaKanbanSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  ordem: z.number(),
  quadroKanbanId: z.string(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export const colunaKanbanInputSchema = z.object({
  titulo: z.string().min(1, 'Título da coluna é obrigatório'),
  ordem: z.number().optional(),
  quadroKanbanId: z.string().min(1, 'ID do quadro é obrigatório'),
});

export type ColunaKanban = z.infer<typeof colunaKanbanSchema>;
export type ColunaKanbanInput = z.infer<typeof colunaKanbanInputSchema>;

// ===================== CARD KANBAN =====================

export const cardKanbanInputSchema = z.object({
  titulo: z.string().min(1, 'Título do card é obrigatório'),
  descricao: z.string().optional(),
  ordem: z.number().optional(),
  colunaKanbanId: z.string().min(1, 'ID da coluna é obrigatório'),
});

export const moverCardInputSchema = z.object({
  cardId: z.string().min(1, 'ID do card é obrigatório'),
  novaColunaId: z.string().min(1, 'ID da nova coluna é obrigatório'),
  ordemSuperior: z.number().optional(),
  ordemInferior: z.number().optional(),
  novaPosicao: z.number().optional(),
});

export const vincularEntidadeInputSchema = z.object({
  cardId: z.string().min(1, 'ID do card é obrigatório'),
  entidadeId: z.string().min(1, 'ID da entidade é obrigatório'),
  tipoEntidade: TipoEntidadeEnum,
});

export type MoverCardInput = z.infer<typeof moverCardInputSchema>;
export type VincularEntidadeInput = z.infer<typeof vincularEntidadeInputSchema>;
export type VinculoCard = z.infer<typeof vinculoCardSchema>;

// ===================== QUADRO COMPLETO =====================
export const quadroCompletoSchema = quadroKanbanSchema.extend({
  colunas: z.array(
    colunaKanbanSchema.extend({
      cards: z.array(cardKanbanSchema),
    })
  ),
  etiquetas: z.array(etiquetaQuadroSchema).optional(),
});

export type QuadroCompleto = z.infer<typeof quadroCompletoSchema>;

// ===================== ESPAÇO DE TRABALHO COM QUADROS =====================
export const espacoTrabalhoComQuadrosSchema = z.object({
  id: z.string(),
  nome: z.string(),
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
  quadros: z.array(
    z.object({
      id: z.string(),
      titulo: z.string(),
      espacoTrabalhoId: z.string(),
      criadoEm: dateSchema,
      atualizadoEm: dateSchema,
      colunas: z.array(
        z.object({
          id: z.string(),
          titulo: z.string(),
          ordem: z.number(),
          quadroKanbanId: z.string(),
          criadoEm: dateSchema,
          atualizadoEm: dateSchema,
          _count: z
            .object({
              cards: z.number(),
            })
            .optional(),
        })
      ),
    })
  ),
});

export type EspacoTrabalhoComQuadros = z.infer<
  typeof espacoTrabalhoComQuadrosSchema
>;

// ===================== SCHEMAS PARA AUTCOMPLETE =====================
export const vagaAutocompleteSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  status: z.string(),
});

export const candidatoAutocompleteSchema = z.object({
  id: z.string(),
  pessoa: z.object({
    id: z.string(),
    nome: z.string(),
  }),
});

export const clienteAutocompleteSchema = z.object({
  id: z.string(),
  empresa: z.object({
    id: z.string(),
    razaoSocial: z.string(),
    nomeFantasia: z.string().nullable(),
  }),
});

export const compromissoAutocompleteSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  dataHora: dateSchema,
});

// Union type para todas as entidades de autocomplete
export const entidadeAutocompleteSchema = z.discriminatedUnion('tipo', [
  vagaAutocompleteSchema.extend({ tipo: z.literal('VAGA') }),
  candidatoAutocompleteSchema.extend({ tipo: z.literal('CANDIDATO') }),
  clienteAutocompleteSchema.extend({ tipo: z.literal('CLIENTE') }),
  compromissoAutocompleteSchema.extend({ tipo: z.literal('COMPROMISSO') }),
]);

export type VagaAutocomplete = z.infer<typeof vagaAutocompleteSchema>;
export type CandidatoAutocomplete = z.infer<typeof candidatoAutocompleteSchema>;
export type ClienteAutocomplete = z.infer<typeof clienteAutocompleteSchema>;
export type CompromissoAutocomplete = z.infer<
  typeof compromissoAutocompleteSchema
>;
export type EntidadeAutocomplete = z.infer<typeof entidadeAutocompleteSchema>;

// ===================== COMENTÁRIOS =====================
export const comentarioCardSchema = z.object({
  id: z.string(),
  cardKanbanId: z.string(),
  conteudo: z.string(),
  usuarioSistema: usuarioSistemaSchema,
  criadoEm: dateSchema,
  atualizadoEm: dateSchema,
});

export const comentarioCardInputSchema = z.object({
  cardKanbanId: z.string().min(1, 'ID do card é obrigatório'),
  conteudo: z.string().min(1, 'Conteúdo do comentário é obrigatório'),
});

export type ComentarioCard = z.infer<typeof comentarioCardSchema>;
export type ComentarioCardInput = z.infer<typeof comentarioCardInputSchema>;

// ===================== SCHEMAS DE EXCLUSÃO =====================
export const deleteIdSchema = z.string().min(1, 'ID é obrigatório para exclusão');

export type DeleteId = z.infer<typeof deleteIdSchema>;