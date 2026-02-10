/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/form/VagaForm.tsx
import api from '@/axios';
import ModalSuccess from '@/components/modal/ModalSuccess';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  useForm,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
// import Card from "@/components/Card"; // Comentado no seu código, mantendo
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import { FormTextarea } from '../input/FormTextarea';

import {
  CategoriaVagaEnum,
  NivelExperienciaEnum,
  StatusVagaEnum,
  TipoContratoEnum,
  VagaInput,
  VagaWithClienteInput,
  vagaWithClienteSchema,
} from '@/schemas/vaga.schema';
import ClienteSearch from '../search/ClienteSearch';
import LocalizacaoForm from './LocalizacaoForm';

type VagaFormProps = {
  formContexto?: UseFormReturn<VagaInput>;
  onSubmit?: (data: VagaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<VagaWithClienteInput>;
  isBtnDelete?: boolean;
  isBtnView?: boolean;
  showInput?: boolean;
};

const VagaForm: React.FC<VagaFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
  isBtnDelete = true,
  isBtnView = true,
  showInput = true,
}) => {
  const methods = useForm<VagaWithClienteInput>({
    resolver: zodResolver(vagaWithClienteSchema),
    mode: 'onChange',
    defaultValues: {
      ...initialValues,
      tipoSalario: initialValues?.tipoSalario ?? 'A COMBINAR',
      categoria: initialValues?.categoria ?? 'SAUDE',
      status: initialValues?.status ?? 'ABERTA',
      tipoLocalTrabalho: initialValues?.tipoLocalTrabalho || 'PRESENCIAL',
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [loading, setLoading] = useState(false);
  // const [habilidadesAllow, setHabilidadesAllow] = useState(false);
  // const [beneficiosAllow, setBeneficiosAllow] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorLabel, setErrorLabel] = useState<string | null>(null); // Mudança: tipar como string | null
  const errorLabelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (errorLabel && errorLabelRef.current) {
      errorLabelRef.current.focus();
    }
  }, [errorLabel]);

  const tipoSalario = useWatch({
    control,
    name: 'tipoSalario',
    defaultValue: initialValues?.tipoSalario,
  });

  const categoria = useWatch({
    control,
    name: 'categoria',
    defaultValue: initialValues?.categoria,
  });

  // Observa o tipo de local de trabalho
  const tipoLocalTrabalhoWatch = useWatch({
    control,
    name: 'tipoLocalTrabalho',
    defaultValue: initialValues?.tipoLocalTrabalho || 'PRESENCIAL',
  });

  const submitHandler = async (data: any) => {
    setErrorLabel(null);

    if (onSubmit) onSubmit(data);
    delete data.cliente;
    const { tipoLocalTrabalho } = data;
    delete data.tipoLocalTrabalho;

    const payload: VagaInput = { ...data };

    if (tipoLocalTrabalho === 'REMOTO') {
      if ('localizacao' in payload) {
        delete payload.localizacao;
      }
    }

    setLoading(true);

    try {
      const url = '/api/externalWithAuth/vaga';

      const response = await api.post(url, payload);
      if (response.status >= 200 && response.status < 300) {
        const isEdit = !!initialValues?.id;
        setSuccessMessage(
          isEdit ? 'Vaga editada com sucesso!' : 'Vaga cadastrada com sucesso!'
        );
        setShowSuccessModal(true);
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      console.log(erro);
      const message =
        erro?.response?.data?.details?.message ||
        erro?.response?.data?.message ||
        erro?.data?.message ||
        'Erro ao Salvar o Cliente, tente novamente ou contate o administrador';
      setErrorLabel(message);
    } finally {
      setLoading(false);
    }
  };

  const onSuccessClienteSearch = (cliente: any) => {
    setValue('clienteId', cliente.id);
  };

  return (
    <FormProvider {...methods}>
      {/* Bloco de erro geral acima do form, igual ClienteForm */}
      {errorLabel && (
        <p
          ref={errorLabelRef}
          tabIndex={-1}
          className="bg-red-500 p-2 text-center text-white"
          aria-live="assertive"
        >
          {errorLabel}
        </p>
      )}
      <form
        onSubmit={handleSubmit(submitHandler as any)}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-1 space-y-2"
      >
        <div className="col-span-full">
          <ClienteSearch
            onSuccess={onSuccessClienteSearch}
            initialValuesProps={
              initialValues?.cliente
                ? {
                    empresa: { ...initialValues?.cliente?.empresa },
                    clienteId: initialValues?.clienteId,
                  }
                : null
            }
            showInput={
              (!initialValues?.cliente?.id && !initialValues?.clienteId) ||
              showInput
            }
            isBtnDelete={isBtnDelete}
            isBtnView={isBtnView}
          />
        </div>

        <FormInput
          name="titulo"
          control={control}
          label="Título da Vaga"
          placeholder="Ex: Medico residente"
          errors={errors}
          inputProps={{ classNameContainer: 'col-span-full' }}
        />

        <FormSelect
          name="tipoSalario"
          control={control}
          label="Tipo de salário"
          placeholder="Selecione o tipo de salário"
        >
          <>
            <option value="A COMBINAR">A COMBINAR</option>
            <option value="DIARIA">DIARIA</option>
            <option value="MENSAL">MENSAL</option>
          </>
        </FormSelect>

        {tipoSalario !== 'A COMBINAR' && (
          <FormInput
            name="salario"
            control={control}
            label="Salário"
            maskProps={{
              mask: 'R$ num',
              blocks: {
                num: {
                  mask: Number,
                  thousandsSeparator: '.',
                  padFractionalZeros: true,
                  scale: 2,
                  radix: ',',
                  mapToRadix: ['.'],
                  signed: false,
                },
              },
            }}
            inputProps={{
              inputMode: 'decimal',
              pattern: '^R\\$ ([0-9]{1,3}(\\.[0-9]{3})*|[0-9]+)(,[0-9]{2})?$',
              placeholder: 'R$ 0,00',
            }}
          />
        )}

        <FormSelect
          name="categoria"
          control={control}
          errors={errors}
          label="Categoria da Vaga"
          placeholder="Selecione o categoria"
        >
          <>
            {CategoriaVagaEnum.options.map(cat => (
              <option key={cat} value={cat}>
                {cat.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        <FormSelect
          name="status"
          control={control}
          errors={errors}
          label="Andamento da Vaga"
        >
          <>
            {StatusVagaEnum.options.map(stat => (
              <option key={stat} value={stat}>
                {stat.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        <FormSelect
          name="tipoContrato"
          control={control}
          label="Tipo de Contrato"
          placeholder="Selecione o tipo de contratação"
        >
          <>
            {TipoContratoEnum.options.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        {categoria !== 'SAUDE' && (
          <FormSelect
            name="nivelExperiencia"
            control={control}
            errors={errors}
            label="Nível de Experiência"
            placeholder="Selecione o nível de experiência"
          >
            <>
              {NivelExperienciaEnum.options.map(nivel => (
                <option key={nivel} value={nivel}>
                  {nivel.replaceAll('_', ' ')}
                </option>
              ))}
            </>
          </FormSelect>
        )}

        <FormTextarea
          name="descricao"
          control={control}
          label="Descrição da Vaga"
          placeholder="Ex: Medico residente com mais de 5 anos de experiência"
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full' }}
        />

        {/* <FormTextarea
          name="requisitos"
          control={control}
          label="Requisitos (Opcional)"
          placeholder="Ex: 5 anos de experiência, ter RQN."
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full', rows: 2 }}
        />

        <FormTextarea
          name="responsabilidades"
          control={control}
          label="Responsabilidades (Opcional)"
          placeholder="Ex: Atuar como médico em clinicas locais."
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full', rows: 2 }}
        /> */}

        {/* Radio para tipo de local de trabalho */}
        <div className="col-span-full flex flex-col gap-2">
          <label className="font-semibold text-gray-700 mb-1">
            Tipo de Local de Trabalho
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="PRESENCIAL"
                name="tipoLocalTrabalho"
                checked={tipoLocalTrabalhoWatch === 'PRESENCIAL'}
                className="form-radio text-primary focus:ring-primary"
                onChange={() => setValue('tipoLocalTrabalho', 'PRESENCIAL')}
              />
              <span className="ml-2 text-primary font-medium">Presencial</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="REMOTO"
                name="tipoLocalTrabalho"
                checked={tipoLocalTrabalhoWatch === 'REMOTO'}
                className="form-radio text-primary focus:ring-primary"
                onChange={() => setValue('tipoLocalTrabalho', 'REMOTO')}
              />
              <span className="ml-2 text-primary font-medium">Remoto</span>
            </label>
          </div>
        </div>
        {/* Só mostra o formulário de localização se NÃO for remoto */}
        {tipoLocalTrabalhoWatch !== 'REMOTO' && (
          <div className="col-span-full">
            <LocalizacaoForm namePrefix="localizacao" />
          </div>
        )}

        {/* <div className="w-full flex gap-2 items-center col-span-full justify-center">
          <button
            className="flex items-center bg-primary text-white text-sm px-3 py-1 rounded-lg shadow-md text-nowrap"
            type="button"
            onClick={() => {
              setHabilidadesAllow(!habilidadesAllow);
            }}
          >
            Adicionar Habilidades?
          </button>
          <button
            className="flex items-center bg-primary text-white text-sm px-3 py-1 rounded-lg shadow-md text-nowrap"
            type="button"
            onClick={() => {
              setBeneficiosAllow(!beneficiosAllow);
            }}
          >
            Adicionar Beneficios?
          </button>
        </div> */}

        {/* {habilidadesAllow && (
          <div className="col-span-full">
            <FormArrayInput
              name="habilidades"
              title="Habilidades Necessárias (Opcional)"
              addButtonText="Adicionar Habilidade"
              value={ }
              fieldConfigs={[
                {
                  name: 'nome',
                  placeholder: 'Nome da Habilidade',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'tipoHabilidade',
                  placeholder: 'Tipo',
                  component: 'select',
                  selectOptions: TipoHabilidadeEnum.options.map(opt => ({
                    value: opt,
                    label: opt.replaceAll('_', ' '),
                  })),
                },
                {
                  name: 'nivelExigido',
                  placeholder: 'Nível',
                  component: 'select',
                  selectOptions: NivelExigidoEnum.options.map(opt => ({
                    value: opt,
                    label: opt.replaceAll('_', ' '),
                  })),
                },
              ]}
              renderChipContent={(habilidade: HabilidadeInput) => (
                <>
                  <span>{habilidade.nome}</span>
                  {habilidade.tipoHabilidade && (
                    <span className="ml-1 opacity-80 text-primary">
                      ({String(habilidade.tipoHabilidade).replaceAll('_', ' ')})
                    </span>
                  )}
                  {habilidade.nivelExigido && (
                    <span className="ml-1 opacity-80 text-primary">
                      [{String(habilidade.nivelExigido).replaceAll('_', ' ')}]
                    </span>
                  )}
                </>
              )}
              initialItemData={{
                nome: '',
                tipoHabilidade: '',
                nivelExigido: '',
              }}
            />
          </div>
        )}
        {beneficiosAllow && (
          <div className="col-span-full">
            <FormArrayInput
              name="beneficios"
              title="Benefícios Oferecidos (Opcional)"
              addButtonText="Adicionar Benefício"
              fieldConfigs={[
                {
                  name: 'nome',
                  placeholder: 'Nome do Benefício',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'descricao',
                  placeholder: 'Descrição',
                  type: 'text',
                },
              ]}
              renderChipContent={(beneficio: BeneficioInput) => (
                <>
                  <span className="text-primary">{beneficio.nome}</span>
                  {beneficio.descricao && (
                    <span className="ml-1 opacity-80 text-primary">
                      : {beneficio.descricao}
                    </span>
                  )}
                </>
              )}
              initialItemData={{ nome: '', descricao: '' }}
            />
          </div>
        )} */}

        {/* Triagens da Vaga */}
        {/* TRIAGEM COMENTADA */}
        {/* <TriagemForm /> */}

        <div className="flex justify-end col-span-full">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Vaga'}
          </PrimaryButton>
        </div>
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};

export default VagaForm;
