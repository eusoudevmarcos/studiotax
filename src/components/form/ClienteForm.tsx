/* eslint-disable @typescript-eslint/no-explicit-any */
import EmpresaForm from '@/components/form/EmpresaForm';
import {
  clienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaInput,
} from '@/schemas/cliente.schema';

import { saveCliente } from '@/axios/cliente.axios';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { getError } from '@/utils/getError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormArrayInput } from '@/components/input/FormArrayInput';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type ClienteFormProps = {
  formContexto?: UseFormReturn<ClienteWithEmpresaInput>;
  onSubmit?: (data: ClienteWithEmpresaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<ClienteWithEmpresaAndPlanosSchema>;
  set?: { isProspect: boolean };
};

// Função auxiliar para extrair os ids dos planos
const getPlanoIds = (planos: any[] | undefined): string[] => {
  if (!Array.isArray(planos) || planos.length === 0) return [];
  if (typeof planos[0] === 'string') {
    return planos.map(id => id as string);
  }
  if (typeof planos[0] === 'object' && planos[0] !== null) {
    if ('planoId' in planos[0]) {
      return planos.map((p: any) => String(p.planoId));
    }
    if ('id' in planos[0]) {
      return planos.map((p: any) => String(p.id));
    }
  }
  return [];
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorLabel, setErrorLabel] = useState<null | string>(null);

  const errorLabelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (errorLabel && errorLabelRef.current) {
      errorLabelRef.current.focus();
    }
  }, [errorLabel]);

  const normInitialValues = React.useMemo(() => {
    return initialValues;
  }, [initialValues]);

  const methods = useForm<ClienteWithEmpresaAndPlanosSchema>({
    resolver: zodResolver(clienteWithEmpresaAndPlanosSchema),
    mode: 'onBlur',
    defaultValues: normInitialValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  useEffect(() => {
    // Apenas para debug
    console.log(errors);
  }, [errors]);

  const emails = watch('emails') || [];
  const telefones = watch('telefones') || [];

  const handleEmailsChange = (emails: any) => {
    setValue('emails', emails);
  };

  const handleTelefonesChange = (emails: any) => {
    setValue('telefones', emails);
  };

  const submitHandler = async (data: ClienteWithEmpresaAndPlanosSchema) => {
    setErrorLabel(null);

    const payload: any = {
      ...data,
    };

    if (onSubmit) onSubmit(payload);

    setLoading(true);

    try {
      const response = await saveCliente({ payload });

      if (response.status >= 200 && response.status < 300) {
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-3 flex flex-col"
        autoComplete="off"
      >
        {errorLabel && (
          <p
            ref={errorLabelRef}
            tabIndex={-1}
            className="bg-red-500 p-2 text-center text-black"
            aria-live="assertive"
          >
            {errorLabel}
          </p>
        )}
        <h3 className="block text-primary text-xl font-bold mb-2">
          Status do cliente
        </h3>
        <FormSelect
          name="status"
          placeholder="Selecione o status do Cliente"
          selectProps={{ disabled: loading }}
        >
          <>
            {StatusClienteEnum.options.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </>
        </FormSelect>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="block text-primary text-xl font-bold mb-2">Cliente</h3>
          <EmpresaForm namePrefix="empresa" disabledFields={loading} />

          {getError(errors, 'empresa') &&
            typeof getError(errors, 'empresa') === 'string' && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'empresa')}
              </p>
            )}
        </div>

        <label className="block text-primary text-xl font-bold mb-2 border-t border-gray-200 pt-4">
          Contatos
        </label>

        <FormArrayInput
          name="emails"
          title="Adicione os E-mail´s para entrar em contato"
          ValuesArrayString
          value={emails}
          onChange={handleEmailsChange}
          fieldConfigs={[
            {
              name: 'email',
              placeholder: 'Adicione os E-mails',
              inputProps: {
                minLength: 4,
                classNameContainer: 'w-full',
              },
              type: 'email',
            },
          ]}
          renderChipContent={link => <span>{link}</span>}
        />

        <FormArrayInput
          name="telefones"
          title="Adicione os Telefones/Celulares para entrar em contato"
          ValuesArrayString
          value={telefones}
          onChange={handleTelefonesChange}
          fieldConfigs={[
            {
              name: 'telefone',
              placeholder: 'Adicione os Telefones',
              inputProps: {
                minLength: 4,
                classNameContainer: 'w-full',
              },
              maskProps: { mask: ['(00) 0000-0000', '(00) 00000-0000'] },
              type: 'phone',
            },
          ]}
          renderChipContent={link => <span>{link}</span>}
        />

        {/* {status === 'ATIVO' && (
          <div className="border-t border-gray-200 pt-4">
            <PlanosForm
              errors={errors}
              initialValues={initialValues?.planos || []}
              onChange={planosSelecionados => {
                setValue('planos', planosSelecionados);
              }}
              disabledFields={loading}
            />

            {getError(errors, 'planos') && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'planos')}
              </p>
            )}
          </div>
        )} */}

        <div className="border-t border-gray-200 pt-4">
          <PrimaryButton
            className="self-end w-full flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-icons-outlined animate-spin text-md text-black">
                  autorenew
                </span>
              </span>
            ) : initialValues ? (
              'Editar Cliente'
            ) : (
              'Cadastrar Cliente'
            )}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClienteForm;
