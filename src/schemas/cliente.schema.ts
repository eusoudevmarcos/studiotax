import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { planoAssinadoSchema } from './plano.schema';
import { StatusClienteEnum } from './statusClienteEnum.schema';

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

// Cliente (vagas removidas)
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

// Cliente + Empresa (vagas removidas)
// Note: referências a 'vagas' removidas conforme solicitação.
