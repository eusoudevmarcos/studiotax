import { PessoaInput, SexoEnum, SignoEnum } from '@/schemas/pessoa.schema';
import { makeName } from '@/utils/makeName';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type PessoaFormProps = {
  namePrefix?: string;
  isYear?: boolean;
  onSubmit?: (data: PessoaInput) => void;
  disabledFields?: boolean;
};

function calcularIdadePorDataNascimento(
  dataNascimento: string | Date | undefined
): number | null {
  if (!dataNascimento) return null;

  let nascimento: Date;

  if (typeof dataNascimento === 'string') {
    // Formato DD/MM/AAAA esperado
    const partes = dataNascimento.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    nascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (isNaN(nascimento.getTime())) return null;
  } else if (dataNascimento instanceof Date) {
    nascimento = dataNascimento;
  } else {
    return null;
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 0 ? idade : null;
}

const PessoaForm = ({
  namePrefix = 'pessoa',
  isYear = false,
  disabledFields,
}: PessoaFormProps) => {
  const nome = makeName<PessoaInput>(namePrefix, 'nome');
  const cpf = makeName<PessoaInput>(namePrefix, 'cpf');
  const rg = makeName<PessoaInput>(namePrefix, 'rg');
  const dataNascimento = makeName<PessoaInput>(namePrefix, 'dataNascimento');
  const sexo = makeName<PessoaInput>(namePrefix, 'sexo');
  const signo = makeName<PessoaInput>(namePrefix, 'signo');

  const { control } = useFormContext();
  const dataNascimentoValue = useWatch({ control, name: dataNascimento });

  const idade = calcularIdadePorDataNascimento(dataNascimentoValue);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <FormInput
        name={cpf}
        maskProps={{ mask: '000.000.000-00' }}
        label="CPF"
        placeholder="000.000.000-00"
        inputProps={{ disabled: disabledFields }}
      />

      <FormInput
        name={nome}
        label="Nome Completo"
        inputProps={{
          disabled: disabledFields,
        }}
      />

      <div className="flex flex-col gap-2">
        <FormInput
          name={dataNascimento}
          label="Data de Nascimento"
          inputProps={{
            type: 'text',
            placeholder: '00/00/0000',
            disabled: disabledFields,
          }}
          maskProps={{ mask: '00/00/0000' }}
        />

        {isYear && idade !== null && !isNaN(idade) && (
          <span className="text-gray-600 text-sm">Idade: {idade} anos</span>
        )}
      </div>

      {/* <FormInput name={rg} label="RG" placeholder="00000-000" /> */}

      <FormInput
        name={rg}
        maskProps={{ mask: '0000000000' }}
        label="RG"
        placeholder="000000000"
        inputProps={{
          disabled: disabledFields,
        }}
      />

      <FormSelect
        name={sexo}
        label="Sexo"
        placeholder="Selecione o sexo"
        selectProps={{
          disabled: disabledFields,
        }}
      >
        {SexoEnum.options.map(sexo => (
          <>
            <option value={sexo} key={sexo}>
              {sexo}
            </option>
          </>
        ))}
      </FormSelect>

      <FormSelect
        name={signo}
        label="Signo"
        placeholder="Selecione o signo"
        selectProps={{
          disabled: disabledFields,
        }}
      >
        {SignoEnum.options.map(signo => (
          <>
            <option key={signo} value={signo}>
              {signo}
            </option>
          </>
        ))}
      </FormSelect>
    </section>
  );
};

export default PessoaForm;
