/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/axios';
import AutocompletePopover from '@/components/utils/AutocompletePopover';
import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import Card from '../Card';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

type CandidatoSearchProps = {
  onSuccess?: (candidatos: any[]) => void;
  onDelete?: () => void | null;
  initialValuesProps?: any[] | null;
  preview?: boolean;
  showInput?: boolean;
};

const CandidatoSearch = ({
  onSuccess,
  onDelete,
  initialValuesProps = [],
  preview = true,
  showInput = true,
}: CandidatoSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryList, setSearchQueryList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [candidatosSelecionados, setCandidatosSelecionados] = useState<any[]>(
    initialValuesProps ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [openModal, setOpenModal] = useState<number | null>(null); // index do candidato aberto no modal

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Dispara a busca automaticamente ao digitar (com debounce)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchQueryList([]);
      setShowAutocomplete(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      if (searchQuery && searchQuery.trim() !== '') {
        setPage(1);
        handleSearch(false);
      } else {
        setError(null);
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line
  }, [searchQuery]);

  // Paginação incremental ao chegar no fim do scroll
  useEffect(() => {
    if (page > 1 && searchQuery.length >= 3) {
      handleSearch(true);
    }
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = async (append: boolean) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setError('Digite um valor para pesquisar.');
      setSearchQueryList([]);
      setShowAutocomplete(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        pageSize,
        search: searchQuery,
      };

      const response = await api.get('/api/externalWithAuth/candidato', {
        params,
      });

      const data = response.data?.data ?? [];
      if (data.length > 0) {
        setSearchQueryList(prev => (append ? [...prev, ...data] : data));
        setShowAutocomplete(true);
      } else if (!append) {
        setError('Candidato não encontrado.');
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Erro ao buscar candidato. Tente novamente.'
      );
      if (!append) {
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidato = (candidato: any) => {
    // Evita duplicidade
    if (candidatosSelecionados.some(c => c.id === candidato.id)) {
      setError('Candidato já adicionado.');
      setShowAutocomplete(false);
      setSearchQuery('');
      return;
    }
    setCandidatosSelecionados(prev => [...prev, candidato]);
    setSearchQuery('');
    setShowAutocomplete(false);
    setSearchQueryList([]);
    setError(null);
    // if (onSuccess) onSuccess([...candidatosSelecionados, candidato]);
  };

  const handleDeleteCandidato = (index: number) => {
    const novos = candidatosSelecionados.filter((_, i) => i !== index);
    setCandidatosSelecionados(novos);
    if (onSuccess) onSuccess(novos);
    if (onDelete) onDelete();
  };

  const BtnDelete = ({ className, onClick }: any) => {
    return (
      <PrimaryButton className={className} onClick={onClick}>
        <span className="material-icons-outlined">delete</span>
      </PrimaryButton>
    );
  };

  const handleConfirmSelection = async () => {
    if (candidatosSelecionados.length === 0) {
      setError('Adicione ao menos um candidato.');
      return;
    }
    setLoading(true);
    try {
      if (onSuccess) onSuccess(candidatosSelecionados);
      setCandidatosSelecionados([]);
    } catch (err: any) {
      setError('Erro ao processar seleção.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showInput && (
        <div className="flex flex-row gap-2 w-full">
          <div className="relative w-full" ref={autocompleteRef}>
            <p className="my-2 font-bold">Pesquisa de candidato</p>
            <FormInput
              name="searchCandidato"
              inputProps={{
                value: searchQuery,
                classNameContainer: 'w-full',
              }}
              onChange={(
                e: string | React.ChangeEvent<HTMLInputElement>
              ) => {
                const value =
                  typeof e === 'string' ? e : e.target.value;
                setSearchQuery(value);
                setShowAutocomplete(true);
              }}
              placeholder={`Buscar por nome ou CPF`}
            />

            <AutocompletePopover
              anchorRef={autocompleteRef as any}
              isOpen={showAutocomplete && searchQueryList.length > 0}
              onRequestClose={() => setShowAutocomplete(false)}
              searchMore={() => setPage(prev => prev + 1)}
              classNameContainer="rounded shadow-md border"
              classNameContent="max-h-60"
            >
              {searchQueryList.map((e: any) => (
                <div
                  key={e.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 border-b"
                  onClick={() => handleSelectCandidato(e)}
                >
                  <div className="font-semibold">{e?.pessoa?.nome}</div>
                  {e?.pessoa?.cpf && (
                    <div className="text-xs text-gray-500">{e.pessoa.cpf}</div>
                  )}
                </div>
              ))}
            </AutocompletePopover>
          </div>
          {loading && (
            <span className="text-gray-500 text-sm flex items-center">
              Buscando...
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {candidatosSelecionados.length > 0 && (
        <div className="space-y-3 mt-4">
          {candidatosSelecionados.map((candidato, idx) => (
            <Card
              key={candidato.id}
              title={preview ? 'Dados do Candidato' : ''}
              classNameContent="flex justify-between"
            >
              {preview && (
                <div className="flex flex-col justify-between">
                  <p>
                    CPF:
                    <span className="text-secondary">
                      {candidato?.pessoa?.cpf ?? '—'}
                    </span>
                  </p>
                  <p>
                    Nome:
                    <span className="text-secondary">
                      {candidato?.pessoa?.nome ?? '—'}
                    </span>
                  </p>
                  {candidato?.especialidade?.nome && (
                    <p>
                      Especialidade:
                      <span className="text-secondary">
                        {candidato.especialidade.nome}
                      </span>
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2 relative">
                <PrimaryButton onClick={() => setOpenModal(idx)}>
                  Ver Candidato
                </PrimaryButton>
                <BtnDelete onClick={() => handleDeleteCandidato(idx)} />
              </div>
            </Card>
          ))}

          {/* Modal para cada candidato */}
          {candidatosSelecionados.map((candidato, idx) => (
            <Modal
              key={candidato.id}
              isOpen={openModal === idx}
              onClose={() => setOpenModal(null)}
            >
              <>
                <BtnDelete
                  className="absolute right-14 top-3"
                  onClick={() => {
                    handleDeleteCandidato(idx);
                    setOpenModal(null);
                  }}
                />
                <div className="p-2">
                  <h3 className="font-bold mb-2">Resumo do Candidato</h3>
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Nome:</span>{' '}
                      {candidato?.pessoa?.nome}
                    </div>
                    {candidato?.pessoa?.cpf && (
                      <div>
                        <span className="font-medium">CPF:</span>{' '}
                        {candidato?.pessoa?.cpf}
                      </div>
                    )}
                    {candidato?.areaCandidato && (
                      <div>
                        <span className="font-medium">Área:</span>{' '}
                        {String(candidato.areaCandidato).replace(/_/g, ' ')}
                      </div>
                    )}
                    {candidato?.especialidade?.nome && (
                      <div>
                        <span className="font-medium">Especialidade:</span>{' '}
                        {candidato.especialidade.nome}
                      </div>
                    )}
                  </div>
                </div>
              </>
            </Modal>
          ))}

          <div className="flex justify-end">
            <PrimaryButton
              className="mt-2"
              onClick={handleConfirmSelection}
              disabled={loading}
            >
              Confirmar Seleção
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidatoSearch;
