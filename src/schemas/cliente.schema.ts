import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { planoAssinadoSchema } from './plano.schema';
import { StatusClienteEnum } from './statusClienteEnum.schema';
import { KanbanVagaResponseSchema, vagaSchema } from './vaga.schema';

// Cliente
export const clienteSchema = z.object({
  id: z.uuid().optional(),
  status: StatusClienteEnum,
  criarUsuarioSistema: z.boolean().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(val => !val || val === '' || z.email().safeParse(val).success, {
      message: 'Formato de e-mail invalido',
    }), // E-mail de acesso ao sistema
  usuarioSistema: z.object({ email: z.email('Email inválido') }).optional(),

  emails: z.array(z.string()).optional(),
  telefones: z.array(z.string()).optional(),
});
export type ClienteInput = z.infer<typeof clienteSchema>;

// Cliente + Vagas
export const clienteWithVagasSchema = clienteSchema.extend({
  vagas: z.array(z.lazy(() => vagaSchema)).optional(),
  vagaId: z.uuid(),
});
export type ClienteWithVagasInput = z.infer<typeof clienteWithVagasSchema>;

// Cliente + Empesa
export const clienteWithEmpresaSchema = clienteSchema.extend({
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
});
export type ClienteWithEmpresaInput = z.infer<typeof clienteWithEmpresaSchema>;

// export const clienteWithEmpresaAndPlanosSchema = z.object({
//   ...clienteWithEmpresaSchema,
//   ...planoSchema,
// });

export const clienteWithEmpresaAndPlanosSchema =
  clienteWithEmpresaSchema.extend({
    planos: z.array(planoAssinadoSchema).optional(),
  });

export type ClienteWithEmpresaAndPlanosSchema = z.infer<
  typeof clienteWithEmpresaAndPlanosSchema
>;

// Cliente + Empesa + Vaga
export const clienteWithEmpresaAndVagaSchema = clienteSchema.extend({
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
  vagas: z.lazy(() => KanbanVagaResponseSchema).optional(),
  vagaId: z.uuid(),
  usuarioSistema: z.object({ email: z.string() }).optional(),
  planos: z.array(planoAssinadoSchema).optional(), // Planos com detalhes
});

export type ClienteWithEmpresaAndVagaInput = z.infer<
  typeof clienteWithEmpresaAndVagaSchema
>;
