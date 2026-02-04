import { isValidCPF } from '@/utils/validateCpf';
import { z } from 'zod';
import { localizacaoSchema } from './localizacao.schema';

export const SexoEnum = z.enum(['MASCULINO', 'FEMININO']);
export type SexoEnum = z.infer<typeof SexoEnum>;

export const SignoEnum = z.enum([
  'ARIES',
  'TOURO',
  'GEMEOS',
  'CANCER',
  'LEAO',
  'VIRGEM',
  'LIBRA',
  'ESCORPIAO',
  'SAGITARIO',
  'CAPRICORNIO',
  'AQUARIO',
  'PEIXES',
]);
export type SignoEnum = z.infer<typeof SignoEnum>;

export const pessoaSchema = z.object({
  id: z.string().nullable().optional(),
  nome: z.string('Nome é obrigatória').min(1, 'Nome é obrigatório').optional(),
  cpf: z
    .string()
    .refine(
      val => {
        if (val.length > 0) {
          const unmaskedCpf = val.replace(/\D/g, '');
          return isValidCPF(unmaskedCpf);
        }
        return true;
      },
      {
        message: 'CPF inválido',
      }
    )
    .optional()
    .nullable(),
  rg: z
    .string()
    .refine(
      val => {
        if (val) {
          const unmaskedCpf = val.replace(/\D/g, '');
          return unmaskedCpf;
        }
      },
      {
        message: 'RG inválido',
      }
    )
    .optional()
    .nullable(),
  dataNascimento: z
    .union([
      z.string().refine(
        val => {
          if (!val || val.length === 0) return true; // allow empty/null/optional

          // Regex validate basic format
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            return false;
          }

          const [diaStr, mesStr, anoStr] = val.split('/');
          const dia = Number(diaStr);
          const mes = Number(mesStr);
          const ano = Number(anoStr);

          // Dia entre 1 e 31
          if (dia < 1 || dia > 31) return false;
          // Mês entre 1 e 12
          if (mes < 1 || mes > 12) return false;

          // Ano não pode ser maior que o ano atual (não pode ser futuro)
          const now = new Date();
          const anoAtual = now.getFullYear();
          if (ano > anoAtual) return false;

          // Adicional: Não permitir hoje ou após hoje (futuro)
          const dataInformada = new Date(ano, mes - 1, dia);
          const hoje = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          if (dataInformada > hoje) return false;

          return true;
        },
        { message: 'Data de nascimento inválida' }
      ),
    ])
    .optional()
    .nullable(),

  sexo: SexoEnum.optional().nullable(),
  signo: SignoEnum.optional().nullable(),
  // estadoCivil: z
  //   .enum([
  //     'SOLTEIRO',
  //     'CASADO',
  //     'DIVORCIADO',
  //     'VIUVO',
  //     'SEPARADO',
  //     'UNIAO_ESTAVEL',
  //   ])
  //   .optional(),
  // contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
  // formacoes: z.array(formacaoSchema).optional(),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
