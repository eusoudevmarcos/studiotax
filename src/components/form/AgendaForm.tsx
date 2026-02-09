import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import Card from '@/components/Card';
import { FormInput } from '@/components/input/FormInput';
import { FormSelect } from '@/components/input/FormSelect';
import ModalSuccess from '@/components/modal/ModalSuccess';

import { PrimaryButton } from '@/components/button/PrimaryButton';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { AgendaInput, agendaSchema } from '@/schemas/agenda.schema';

import api from '@/axios';
import getAvailableTimes from '@/axios/getAvaliableTimes';
import postCalendar from '@/axios/postCalendar';
import Table, { TableColumn } from '@/components/Table';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { ConnectGoogleButton } from '../button/GoogleAuth';
import { ErrorMessage } from '../input/ErrorMessage';

type Convidado = {
  email: string;
};

export default function ConvidadosTable({
  initialValues,
}: {
  initialValues?: string[];
}) {
  const { setValue } = useFormContext();
  const [convidados, setConvidados] = useState<Convidado[]>(
    Array.isArray(initialValues) ? initialValues.map(email => ({ email })) : []
  );
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (Array.isArray(initialValues)) {
      setConvidados(initialValues.map(email => ({ email })));
      setValue('convidados', initialValues);
    }
  }, [initialValues, setValue]);

  // Sempre que convidados mudar, atualiza o form (como array de string)
  useEffect(() => {
    setValue(
      'convidados',
      convidados.map(c => c.email)
    );
  }, [convidados, setValue]);

  const handleRemove = (index: number) => {
    setConvidados(prev => {
      const novosConvidados = prev.filter((_, i) => i !== index);
      return novosConvidados;
    });
  };

  const handleAddConvidado = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;

    const isConvidado = convidados.find(convidado => convidado.email === email);
    if (!!isConvidado) return;

    const novosConvidados = [...convidados, { email }];
    setConvidados(novosConvidados);
    setEmail('');
  };

  const columns: TableColumn<Convidado>[] = [
    {
      key: 'email',
      label: 'Email do Convidado',
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (_: any, index: number) => (
        <PrimaryButton
          onClick={() => handleRemove(index)}
          className="bg-red-500! !hover:bg-red-800 text-white"
          disabled={!!initialValues}
        >
          <span className="material-icons-outlined">delete</span>
        </PrimaryButton>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end mb-4">
        <FormInput
          label="Email do Convidado"
          name="email"
          noControl
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
        />
        <PrimaryButton
          type="button"
          onClick={handleAddConvidado}
          style={{ maxWidth: '50px' }}
        >
          +
        </PrimaryButton>
      </div>
      <Table
        columns={columns}
        data={convidados}
        emptyMessage="Nenhum convidado adicionado."
      />
    </>
  );
}

type AgendaFormProps = {
  onSuccess: (msg: boolean) => void;
  initialValues?: Partial<AgendaInput>;
};

export const AgendaForm = ({ onSuccess, initialValues }: AgendaFormProps) => {
  const methods = useForm<AgendaInput>({
    resolver: zodResolver(agendaSchema),
    mode: 'onTouched',
    defaultValues: {
      ...initialValues,
      localEvento: 'REMOTO',
      vagaId: initialValues?.vagaId || '',
      candidatoId: initialValues?.candidato?.id || '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const [localEvento, setLocalEvento] = useState<string>('REMOTO');
  const [isEtapa, setIsEtapa] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [errroAvailableTimes, setErrorAvailableTimes] = useState<string | null>(
    null
  );
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Estados para vagas com paginação infinita
  const [vagasData, setVagasData] = useState<any[]>([]);
  const [isLoadingVagas, setIsLoadingVagas] = useState(false);
  const [vagasPage, setVagasPage] = useState(1);
  const [vagasHasMore, setVagasHasMore] = useState(true);
  const [vagasOpened, setVagasOpened] = useState(false);

  // Função para buscar vagas paginadas
  const fetchVagas = async (page = 1) => {
    if (!initialValues?.candidatoId && !initialValues?.candidato?.id) return;
    setIsLoadingVagas(true);
    try {
      const resp = await api.get(
        `/api/externalWithAuth/vaga/candidato/${
          initialValues?.candidatoId || initialValues?.candidato?.id
        }`,
        {
          params: {
            pageSize: 10,
            page,
          },
        }
      );
      const newVagas = resp.data?.data || resp.data || [];
      setVagasData(prev => (page === 1 ? newVagas : [...prev, ...newVagas]));
      // Verifica se há mais páginas
      if (resp.data?.totalPages) {
        setVagasHasMore(page < resp.data.totalPages);
      } else if (Array.isArray(newVagas)) {
        setVagasHasMore(newVagas.length > 0);
      } else {
        setVagasHasMore(false);
      }
    } catch (_) {
      setVagasHasMore(false);
      setVagasData([]);
    } finally {
      setIsLoadingVagas(false);
    }
  };

  // Handler para abrir o select e buscar as vagas
  const handleVagasOpen = () => {
    if (!vagasOpened) {
      setVagasOpened(true);
      setVagasPage(1);
      fetchVagas(1);
    }
  };

  // Handler para rolagem infinita no select de vagas
  const handleVagasScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      vagasHasMore &&
      !isLoadingVagas &&
      target.scrollHeight - target.scrollTop - target.clientHeight < 40
    ) {
      const nextPage = vagasPage + 1;
      setVagasPage(nextPage);
      fetchVagas(nextPage);
    }
  };

  // Resetar vagas quando o formulário for reaberto/outro candidato
  useEffect(() => {
    setVagasData([]);
    setVagasPage(1);
    setVagasHasMore(true);
    setVagasOpened(false);
  }, [initialValues?.candidatoId, initialValues?.candidato?.id]);

  // useEffect(() => {
  // }, [errors]);

  function handleFullDateTime(times: string, e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedDate || !times) return;

    setSelectedTime(times);

    const [hours, minutes] = times.split(':').map(Number);

    const fullDate = new Date(selectedDate);

    fullDate.setHours(hours, minutes, 0, 0);

    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, '0');
    const day = String(fullDate.getDate()).padStart(2, '0');
    const hour = String(fullDate.getHours()).padStart(2, '0');
    const minute = String(fullDate.getMinutes()).padStart(2, '0');

    const dataHora = `${year}-${month}-${day}T${hour}:${minute}:00`;

    setValue('dataHora', dataHora, { shouldValidate: true });
  }

  async function onSubmit(data: AgendaInput) {
    const validationData: any = { ...data };
    const result = agendaSchema.safeParse(validationData);

    if (!result.success) {
      throw new Error(result.error.format.toString());
    }

    try {
      setLoadingSubmit(true);
      const isEdit = !!initialValues;
      // Remove campos auxiliares antes de enviar
      const { data: d, hora: h, ...rest } = result.data as any;

      let payload = { ...rest, localEvento };

      const googleCalendar = await postCalendar(payload);

      payload = { ...rest, link: googleCalendar.meetLink };

      await api.post('/api/externalWithAuth/agenda', payload);

      setSuccessMessage(
        isEdit
          ? 'Agenda editada com sucesso!'
          : 'Agenda criada e sincronizada com Google!'
      );
      setShowSuccessModal(true);
      onSuccess(true);
    } catch (error) {
      console.log('Erro ao salvar:', error);
      onSuccess(false);
    } finally {
      setLoadingSubmit(false);
    }
  }

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    // Formatar a data pro formato YYYY-MM-DD (ajuste de timezone se necessário)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    async function fetchTimes() {
      setLoadingTimes(true);
      try {
        const resp = await getAvailableTimes(dateStr);
        setAvailableTimes(resp.available || []);
      } catch (err: any) {
        setAvailableTimes([]);
        if (err) setErrorAvailableTimes(err.message);
      } finally {
        setLoadingTimes(false);
      }
    }

    fetchTimes();
  }, [selectedDate]);

  const CandidatoVagaComponent = () => {
    return (
      <>
        <Card title="Candidato e Vaga">
          <div>
            <p className="text-primary text-sm">Informações do candidato</p>
            <p>Nome: {initialValues?.candidato?.pessoa?.nome}</p>
            <p>CPF: {initialValues?.candidato?.pessoa?.cpf}</p>
          </div>

          {/* Vagas do candidato */}
          <div className="my-2">
            <div
              onFocus={handleVagasOpen}
              tabIndex={-1}
              style={{ outline: 'none' }}
            >
              <FormSelect
                name="vagaId"
                label={<span className="text-primary">Selecione a Vaga</span>}
                placeholder="Selecione a vaga"
                selectProps={{
                  disabled: isLoadingVagas,
                }}
                onMenuScrollToBottom={handleVagasScroll}
              >
                <>
                  {Array.isArray(vagasData) &&
                    vagasData.map((vaga: any) => (
                      <option
                        key={vaga.id}
                        value={vaga.id}
                        className="flex justify-between"
                      >
                        {vaga.titulo}{' '}
                        {vaga.dataPublicacao ? `- ${vaga.dataPublicacao}` : ''}
                      </option>
                    ))}
                  {isLoadingVagas && (
                    <option disabled value="">
                      Carregando vagas...
                    </option>
                  )}
                  {!isLoadingVagas && vagasData.length === 0 && (
                    <option disabled value="">
                      Nenhuma vaga encontrada
                    </option>
                  )}
                </>
              </FormSelect>
            </div>
            {isLoadingVagas && (
              <span className="text-xs text-gray-500">Carregando vagas...</span>
            )}
            {errors.vagaId && (
              <span className="text-xs text-red-500">
                {errors.vagaId.message}
              </span>
            )}
          </div>
        </Card>
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-3xl mx-auto bg-white rounded-lg space-y-3"
      >
        <ConnectGoogleButton />

        <FormInput name="titulo" label="Titulo" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input type="hidden" {...register('dataHora' as any)} />

          <FormSelect
            name="tipoEvento"
            label="Evento da agenda"
            placeholder="Selecione o evento"
          >
            <>
              <option value="TRIAGEM_INICIAL">Triagem Inicial</option>
              <option value="ENTREVISTA_RH">Entrevista RH</option>
              <option value="ENTREVISTA_GESTOR">Entrevista Gestor</option>
              <option value="TESTE_TECNICO">Teste Técnico</option>
              <option value="TESTE_PSICOLOGICO">Teste Psicológico</option>
              <option value="DINAMICA_GRUPO">Dinâmica de Grupo</option>
              <option value="PROPOSTA">Proposta</option>
              <option value="OUTRO">Outro</option>
            </>
          </FormSelect>

          <FormSelect
            name="localEvento"
            label="Tipo de reunião"
            onChange={e => {
              setLocalEvento(e.target.value);
            }}
          >
            <>
              <option value="REMOTO">Remoto</option>
              <option value="PRESENCIAL">Presencial</option>
            </>
          </FormSelect>
        </div>

        <Card
          title="Data e Hora"
          classNameContent="flex w-full justify-around relative flex-wrap gap-4"
        >
          <DayPicker
            animate
            mode="single"
            captionLayout="dropdown"
            selected={selectedDate}
            onSelect={setSelectedDate}
            defaultMonth={new Date()}
            startMonth={new Date()}
            classNames={{
              today: `border-amber-500`, // Add a border to today's date
              selected: `bg-primary border-amber-500 text-white`,
            }}
            endMonth={
              new Date(new Date().getFullYear() + 5, new Date().getMonth())
            }
            footer={
              selectedDate
                ? `Selecionado: ${selectedDate.toLocaleDateString('pt-BR')} ${
                    selectedTime?.toString() ?? ''
                  }`
                : 'Data não selecionada'
            }
          />

          <div className="flex flex-col gap-1 justify-center items-center">
            <div
              className="w-32 max-h-48 overflow-y-auto border border-cyan-200 rounded shadow-inner flex flex-col items-center p-2"
              style={{ minWidth: '8rem' }}
            >
              <p className="text-primary">Horarios</p>
              {loadingTimes && (
                <div className="flex flex-col items-center justify-center my-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                  <span className="mt-2 text-cyan-700 text-sm">
                    Carregando horários...
                  </span>
                </div>
              )}
              {availableTimes &&
                !loadingTimes &&
                availableTimes.map(times => {
                  return (
                    <button
                      key={times}
                      className={`p-1 rounded cursor-pointer w-full mb-1 ${
                        selectedTime === times ? 'bg-cyan-300' : 'bg-cyan-100'
                      }`}
                      onClick={e => handleFullDateTime(times, e)}
                    >
                      {times}
                    </button>
                  );
                })}
            </div>

            {errroAvailableTimes && !loadingSubmit && (
              <p className="text-red-500 text-sm">{errroAvailableTimes}</p>
            )}
          </div>

          <ErrorMessage
            top="100%"
            message={errors.dataHora?.message ? errors.dataHora?.message : null}
          ></ErrorMessage>
        </Card>

        {localEvento === 'PRESENCIAL' && (
          <LocalizacaoForm namePrefix="localizacao" />
        )}

        {getValues('candidatoId') && <CandidatoVagaComponent />}

        <Card title="Convidados">
          <ConvidadosTable initialValues={initialValues?.convidados} />
        </Card>

        {/* <PrimaryButton
          onClick={() => {
            setIsEtapa(!isEtapa);
          }}
        >
          Adicionar etapas
          {isEtapa ? (
            <span className="material-icons-outlined">arrow_drop_up</span>
          ) : (
            <span className="material-icons-outlined">arrow_drop_down</span>
          )}
        </PrimaryButton> */}

        {isEtapa && (
          <Card
            title="Etapa do Processo Seletivo (OPCIONAL)"
            classNameContent="grid grid-cols-1 md:grid-cols-2 gap-4"
            classNameContainer="animate-[slideInDown_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards,fadeIn_0.6s_linear_forwards]"
          >
            <FormInput name="etapaAtual.nome" label="Nome da Etapa" />
            <FormInput name="etapaAtual.tipo" label="Tipo de Etapa" />
            <FormInput name="etapaAtual.ordem" label="Ordem" type="number" />
            <FormInput name="etapaAtual.descricao" label="Descrição" />
            <FormSelect name="etapaAtual.ativa" label="Ativa?">
              <>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </>
            </FormSelect>
          </Card>
        )}

        <PrimaryButton
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
          disabled={loadingSubmit}
        >
          {initialValues ? 'Salvar Alterações' : 'Cadastrar Agenda'}
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
