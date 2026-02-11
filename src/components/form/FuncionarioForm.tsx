/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/form/FuncionarioForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import api from '@/axios';
import EmpresaForm from '@/components/form/EmpresaForm';
import PessoaForm from '@/components/form/PessoaForm';
import ModalSuccess from '@/components/modal/ModalSuccess';
import {
  FuncionarioInput,
  funcionarioSchema,
  TipoUsuarioEnum,
} from '@/schemas/funcionario.schema';
import { makeName } from '@/utils/makeName';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type FuncionarioFormProps = {
  onSuccess: (msg: any) => void;
  initialValues?: Partial<FuncionarioInput>;
};

export const FuncionarioForm = ({
  onSuccess,
  initialValues,
}: FuncionarioFormProps) => {
  const [loading, setLoading] = useState(false);
  const [disabledFieldsEmpresa, setDisabledFieldsEmpresa] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    'Pesquisar Cliente' | 'Cadastrar Cliente'
  >('Pesquisar Cliente');

  // Estado para mostrar ou ocultar a senha
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Ajuste dos valores iniciais para refletir a estrutura correta do Prisma
  const defaultValues = useMemo(() => {
    if (initialValues) {
      // Garante que os dados estejam no formato esperado pelo schema do Prisma
      let tipoPessoaOuEmpresa: 'funcionario.pessoa' | 'cliente.empresa' =
        'funcionario.pessoa';
      let funcionario: any = initialValues.funcionario || {};
      let cliente: any = initialValues.cliente || {};

      // Se já vier pessoa fora, coloca dentro de funcionario
      if ((initialValues as any).pessoa) {
        tipoPessoaOuEmpresa = 'funcionario.pessoa';
        funcionario = {
          ...funcionario,
          pessoa: (initialValues as any).pessoa,
        };
      }
      // Se já vier empresa fora, coloca dentro de cliente
      if ((initialValues as any).empresa) {
        tipoPessoaOuEmpresa = 'cliente.empresa';
        cliente = {
          ...cliente,
          empresa: (initialValues as any).empresa,
        };
      }
      // Se já vier empresa dentro de cliente, seta tipoPessoaOuEmpresa corretamente
      if (cliente.empresa) {
        tipoPessoaOuEmpresa = 'cliente.empresa';
      }
      // Se já vier pessoa dentro de funcionario, seta tipoPessoaOuEmpresa corretamente
      if (funcionario.pessoa) {
        tipoPessoaOuEmpresa = 'funcionario.pessoa';
      }

      return {
        ...initialValues,
        tipoPessoaOuEmpresa,
        funcionario,
        cliente,
      } as FuncionarioInput;
    }
    return {
      tipoPessoaOuEmpresa: 'funcionario.pessoa',
      funcionario: {
        setor: '',
        cargo: '',
      },
      cliente: {},
    } as Partial<FuncionarioInput>;
  }, [initialValues]);

  const methods = useForm<FuncionarioInput>({
    resolver: zodResolver(funcionarioSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { isValid, isDirty, errors },
  } = methods;

  const tipoPessoaOuEmpresa = watch('tipoPessoaOuEmpresa');
  const tipoUsuario = watch('tipoUsuario');
  const setor = makeName<FuncionarioInput>('funcionario', 'setor');
  const cargo = makeName<FuncionarioInput>('funcionario', 'cargo');

  const isClienteUsuario = tipoUsuario === 'CLIENTE';

  useEffect(() => {
    if (initialValues) {
      reset(defaultValues);
    }
  }, [initialValues, reset, defaultValues]);

  // Quando o tipoUsuario for cliente, força o tipoPessoaOuEmpresa para 'cliente.empresa'
  useEffect(() => {
    if (tipoUsuario === 'CLIENTE') {
      setValue('tipoPessoaOuEmpresa', 'cliente.empresa');
    }
  }, [tipoUsuario, setValue]);

  // Limpa os campos de acordo com o tipoPessoaOuEmpresa
  useEffect(() => {
    if (tipoPessoaOuEmpresa === 'funcionario.pessoa') {
      // Limpa empresa de dentro de cliente
      setValue('cliente', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else if (tipoPessoaOuEmpresa === 'cliente.empresa') {
      // Limpa pessoa de dentro de funcionario
      setValue('funcionario.pessoa', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    trigger('tipoPessoaOuEmpresa');
  }, [tipoPessoaOuEmpresa, setValue, trigger]);

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    try {
      // Monta o objeto para enviar no formato correto do Prisma
      const cleanData: any = {
        ...data,
      };

      // Remove campo auxiliar
      if ('tipoPessoaOuEmpresa' in cleanData) {
        delete cleanData.tipoPessoaOuEmpresa;
      }

      // Ajusta estrutura para o Prisma
      if (tipoPessoaOuEmpresa === 'funcionario.pessoa') {
        // Remove empresa de cliente se existir
        if (cleanData.cliente && cleanData.cliente.empresa) {
          delete cleanData.cliente.empresa;
        }
        // Garante que pessoa está dentro de funcionario
        if ((cleanData as any).pessoa) {
          cleanData.funcionario = {
            ...cleanData.funcionario,
            pessoa: (cleanData as any).pessoa,
          };
          delete cleanData.pessoa;
        }
      } else if (tipoPessoaOuEmpresa === 'cliente.empresa') {
        // Remove pessoa de funcionario se existir
        if (cleanData.funcionario && cleanData.funcionario.pessoa) {
          delete cleanData.funcionario.pessoa;
        }
        // Garante que empresa está dentro de cliente
        if ((cleanData as any).empresa) {
          cleanData.cliente = {
            ...cleanData.cliente,
            empresa: (cleanData as any).empresa,
          };
          delete cleanData.empresa;
        }
      }

      // Remove campos vazios para evitar conflitos com o Prisma
      if (
        cleanData.funcionario &&
        Object.keys(cleanData.funcionario).length === 0
      ) {
        delete cleanData.funcionario;
      }
      if (cleanData.cliente && Object.keys(cleanData.cliente).length === 0) {
        delete cleanData.cliente;
      }

      setLoading(true);

      const url = `/api/externalWithAuth/funcionario/save`;
      const response = await api.post(url, cleanData);

      const isEdit = !!initialValues?.id;
      setSuccessMessage(
        isEdit
          ? 'Funcionário editado com sucesso!'
          : 'Funcionário cadastrado com sucesso!'
      );
      setShowSuccessModal(true);

      onSuccess(response.data);
      reset(response.data);
    } catch (error: any) {
      console.log('Erro ao processar funcionário:', error);
      alert(
        error?.response?.data?.details?.message || 'Erro ao salvar funcionário'
      );
    } finally {
      setLoading(false);
    }
  }

  const onSuccessClienteSearch = (cliente: any) => {
    setValue('clienteId', cliente.id);
    setDisabledFieldsEmpresa(true);
  };

  const onDeleteClienteSearch = () => {
    const currentValues = methods.getValues();
    // Limpa empresa de dentro de cliente
    reset({
      ...currentValues,
      cliente: { ...currentValues.cliente, empresa: undefined },
    });
    setDisabledFieldsEmpresa(false);
  };

  // UseEffect para depurar erros
  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //   }
  // }, [errors]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-6"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 border-b-[1px] border-gray-400 py-4">
          <h4 className="col-span-full">Dados de Acesso</h4>
          <FormInput
            name="email"
            label="Email de login"
            inputProps={{ type: 'email', classNameContainer: 'col-span-2' }}
          />

          {/* Campo de senha com funcionalidade de mostrar/ocultar */}
          <div className="relative col-span-2">
            <FormInput
              name="password"
              label="Senha"
              inputProps={{
                type: showPassword ? 'text' : 'password',
                classNameContainer: `w-full`,
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-8 z-10 flex items-center"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <span
                className={`material-icons-outlined transition-all duration-300 ease-in-out text-primary
                  ${
                    showPassword
                      ? 'scale-110 rotate-0 opacity-100'
                      : 'scale-90 -rotate-12 opacity-70'
                  }
                `}
                style={{
                  transitionProperty: 'transform, opacity',
                  willChange: 'transform, opacity',
                  display: 'inline-block',
                }}
              >
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3>Dados do Sistema</h3>

          <FormSelect
            name="tipoUsuario"
            label="Acessos e permissões do funcionario"
            selectProps={{
              classNameContainer: 'col-span-full',
            }}
            placeholder="Selecione o Tipo de Usuario"
          >
            <>
              {TipoUsuarioEnum.options.map(tipo => (
                <option key={tipo} value={tipo}>
                  {(() => {
                    switch (tipo) {
                      case 'ADMIN_SISTEMA':
                        return 'Administrador do Sistema';
                      case 'ADMINISTRATIVO':
                        return 'Administrativo';
                      case 'MODERADOR':
                        return 'Moderador (Gerente)';
                      case 'RECRUTADOR':
                        return 'Recrutador';
                      case 'VENDEDOR':
                        return 'Vendedor';
                      case 'CLIENTE':
                        return 'Cliente';
                      default:
                        return tipo;
                    }
                  })()}
                </option>
              ))}
            </>
          </FormSelect>

          <FormSelect
            name="tipoPessoaOuEmpresa"
            label="Tipo de funcionário"
            selectProps={{
              disabled: !tipoUsuario || isClienteUsuario,
            }}
          >
            <>
              {!isClienteUsuario && (
                <option value="funcionario.pessoa">Pessoa</option>
              )}
              <option value="cliente.empresa">
                {isClienteUsuario ? 'Cliente' : 'Empresa'}
              </option>
            </>
          </FormSelect>

          {!isClienteUsuario ? (
            <div className="flex w-full gap-2">
              <FormInput
                name={setor}
                label="Setor"
                inputProps={{ classNameContainer: 'flex-1 w-full' }}
              />
              <FormInput
                name={cargo}
                label="Cargo"
                inputProps={{ classNameContainer: 'flex-1 w-full' }}
              />
            </div>
          ) : null}

          {tipoPessoaOuEmpresa === 'funcionario.pessoa' ? (
            tipoUsuario && <PessoaForm namePrefix="funcionario.pessoa" />
          ) : (
            <>
              <EmpresaForm namePrefix="cliente.empresa" />
            </>
          )}
        </div>

        <PrimaryButton
          type="submit"
          className="w-full text-black font-semibold py-3 rounded-md transition-colors"
          disabled={loading || !isDirty}
        >
          {loading
            ? 'Carregando...'
            : initialValues
            ? 'Salvar Alterações'
            : 'Cadastrar Funcionário'}
        </PrimaryButton>
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};
