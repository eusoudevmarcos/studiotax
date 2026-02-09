import z from 'zod';

export const contatoSchema = z
  .object({
    id: z.string().nullable(),
    telefone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.email().optional(),
  })
  .refine(data => data.telefone || data.whatsapp || data.email, {
    message: 'Pelo menos 1 meio de contato é obrigatorio',
    path: ['telefone'],
  });

export type ContatoInput = z.infer<typeof contatoSchema>;
