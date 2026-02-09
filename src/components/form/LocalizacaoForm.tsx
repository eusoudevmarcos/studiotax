/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalizacaoInput } from '@/schemas/localizacao.schema';
import { makeName } from '@/utils/makeName';
import { UF_MODEL } from '@/utils/UF';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type Props = {
  namePrefix?: string;
  title?: string;
  onSubmit?: (data: any) => void;
};

const LocalizacaoFormInner: React.FC<{
  title?: string;
  namePrefix: string;
}> = ({ namePrefix = 'localizacoes[0]' }) => {
  const cidadeFieldName = makeName<LocalizacaoInput>(namePrefix, 'cidade');
  const ufFieldName = makeName<LocalizacaoInput>(namePrefix, 'uf');
  // const cepFieldName = makeName<LocalizacaoInput>(namePrefix, 'cep');
  // const regiaoFieldName = makeName<LocalizacaoInput>(namePrefix, "regiao");
  // const complementoFieldName = makeName<LocalizacaoInput>(
  //   namePrefix,
  //   'complemento'
  // );
  // const bairroFieldName = makeName<LocalizacaoInput>(namePrefix, 'bairro');
  // const logradouroFieldName = makeName<LocalizacaoInput>(
  //   namePrefix,
  //   'logradouro'
  // );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
        <FormSelect name={ufFieldName} label="UF" placeholder="Selecione a UF">
          <>
            {UF_MODEL.map(({ label }) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </>
        </FormSelect>

        <FormInput
          name={cidadeFieldName}
          label="Cidade"
          placeholder="Ex: Taguatinga"
        />

        {/* <FormInput
          name={cepFieldName}
          label="CEP"
          placeholder="00000-000"
          maskProps={{ mask: '00000-000' }}
          inputProps={{
            classNameContainer: 'col-span-2',
            disabled: isLoadingCep,
          }}
          onChange={getLocalization}
        /> */}

        {/* 
        <FormInput
          name={bairroFieldName}
          label="Bairro"
          placeholder="Ex: Setor Leste"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-3',
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={complementoFieldName}
          label="Complemento"
          placeholder="EX: Hospital Santa Lúcia"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-6',
            disabled: isLoadingCep,
          }}
        />

        <FormInput
          name={logradouroFieldName}
          label="Logradouro"
          placeholder="Ex: 15"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-2',
            disabled: isLoadingCep,
          }}
        /> */}
      </div>
    </>
  );
};

const LocalizacaoForm: React.FC<Props> = ({
  namePrefix = 'localizacoes[0]',
  title = 'Localização (Opcional)',
}) => {
  useFormContext<LocalizacaoInput>();

  return <LocalizacaoFormInner namePrefix={namePrefix} title={title} />;
};
export default LocalizacaoForm;
