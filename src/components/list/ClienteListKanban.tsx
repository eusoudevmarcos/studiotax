import api from '@/axios';
import { getCliente, patchClienteStatus } from '@/axios/cliente.axios';
import { TrelloBoardWrapper } from '@/components/kanban/TrelloBoardWrapper';
import { StatusClienteEnumInput } from '@/schemas/statusClienteEnum.schema';
import { unmask } from '@/utils/mask/unmask';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { CardKanbanClientes } from '../kanban/CardKanbanClientes';

// Tipo Lane compatível com react-trello
interface Lane {
  id: string;
  title: string;
  label?: string;
  cards: any[];
  [key: string]: any;
}

interface EmpresaContato {
  telefone?: string;
  whatsapp?: string;
}
interface EmpresaLocalizacao {
  cidade: string;
  estado: string;
}
interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataAbertura?: string;
  contatos?: EmpresaContato[];
  localizacoes?: EmpresaLocalizacao[];
}
interface Cliente {
  id: string;
  tipoServico: string[];
  empresa: Empresa;
  status: string;
  usuarioSistema: {
    email: string;
  };
  vagas: {
    agendaVaga: number;
    triagens: number;
    beneficios: number;
    anexos: number;
    habilidades: number;
    candidaturas: number;
  }[];
}

const PAGE_SIZE = 8;

// BoardData para Kanban específico do Cliente
export type KanbanClienteResponse = {
  lanes: Lane[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const ClienteList: React.FC<{
  onlyProspects?: boolean;
}> = ({ onlyProspects }) => {
  // States de paginação e filtros
  const [loading, setLoading] = useState<boolean>(false);
  const [searchRazao, setSearchRazao] = useState<string>('');
  const [searchCnpj, setSearchCnpj] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openRemover, setOpenRemover] = useState(false);
  const [itemRemover, setItemRemover] = useState<Cliente | null>(null);
  const [removerLoading, setRemoverLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaQuery, setCategoriaQuery] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const boardWrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const searchValue = searchCnpj.trim()
    ? unmask(searchCnpj.trim())
    : searchRazao.trim();

  // KanbanData state inicial (baseado no VagaList)
  const resetKanbanClienteData: KanbanClienteResponse = {
    lanes: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
  };

  const [kanbanData, setKanbanData] = useState<KanbanClienteResponse>(
    resetKanbanClienteData
  );

  // Handler para abrir editor (atenção: igual VagaList!)
  const handleEditCard = (cliente: Cliente) => {
    if (!cliente) return;
    router.push(`/cliente/${cliente.id}/editar`);
  };

  // Handler de duplicar - opcional, aqui apenas chame o editar
  const handleDuplicateCard = (cliente: Cliente) => {
    if (!cliente) return;
    router.push(`/cliente/${cliente.id}/duplicar`);
  };

  // Handler de deletar inicia o modal
  const handleDeleteCard = (cliente: Cliente) => {
    setItemRemover(cliente);
    setOpenRemover(true);
  };

  // Handler da confirmação do delete
  const handleRemoverConfirm = async () => {
    if (!itemRemover) return;
    setRemoverLoading(true);
    try {
      await api.delete(`/api/externalWithAuth/cliente/${itemRemover.id}`);
      setOpenRemover(false);
      setItemRemover(null);
      fetchClientes();
    } catch (e) {
      // exibir erro, opcional
    } finally {
      setRemoverLoading(false);
    }
  };

  // Handler do clique fora/cancelar remover
  const handleRemoverCancel = () => {
    setOpenRemover(false);
    setItemRemover(null);
  };

  // Busca de clientes (AJAX)
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCliente({
        ...(categoriaQuery ? { categoria: categoriaQuery } : {}),
        ...(searchQuery ? { titulo: searchQuery } : {}),
        page,
        pageSize,
      });
      setKanbanData(result);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (e) {
      setTotal(0);
      setTotalPages(1);
      setKanbanData(resetKanbanClienteData);
    } finally {
      setLoading(false);
    }
  }, [page, searchValue, onlyProspects]);

  const handleSearch = () => {
    setPage(1);
    // fetchClientes será chamado pelo useEffect
  };
  const handleClear = () => {
    setSearchRazao('');
    setSearchCnpj('');
    setPage(1);
    // fetchClientes será chamado pelo useEffect
  };

  // Atualizar dados quando mudar page, onlyProspects, ou search
  useEffect(() => {
    fetchClientes();
  }, [page, onlyProspects, searchValue, fetchClientes]);

  // Handler do movimento de card entre colunas corrigido:
  // O react-trello espera que, ao mover um card, a atualização do state dos dados do Board seja feita manualmente.
  // Se nada for feito (ou seja, state não é atualizado OTIMISTICAMENTE), ele tenta manipular os dados internamente, mas com um objeto que não segue o modelo esperado, causando o erro.
  //
  // Solução: A cada movimentação de card, fazemos o PATCH e, se for sucesso, rodamos fetchClientes() para garantir que o board é re-renderizado com dados corretos do backend.

  const handleCardMove = async (
    cardId: string,
    sourceLaneId: string,
    targetLaneId: string
  ) => {
    // Aqui NÃO fazemos nenhuma manipulação local do state do board (deixamos só o fetch do backend),
    // evitando problemas de inconsistência e de dados 'undefined'
    try {
      await patchClienteStatus({
        id: cardId, // o id do cliente é o id do card!
        status: targetLaneId as StatusClienteEnumInput, // status novo é o LANE de destino
      });
      // Após sucesso, atualiza a lista a partir da API para sincronizar
      fetchClientes();
    } catch (err) {
      console.log('Erro ao atualizar status', err);
      // opcional: mostrar um toast/toastr
    }
  };

  return (
    <>
      <div className="flex justify-end items-center flex-wrap mb-2">
        <div className="flex gap-2 w-full max-w-[700px] items-end">
          <FormInput
            name="buscar-razao"
            label="Razão Social"
            type="text"
            placeholder=" Digite a Razão social"
            value={searchRazao}
            inputProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={e => setSearchRazao(e?.target?.value ?? e)}
          />

          <FormInput
            name="buscar-cnpj"
            placeholder="00.000.000/0000-00"
            label="CNPJ"
            value={searchCnpj}
            maskProps={{ mask: '00.000.000/0000-00' }}
            inputProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={e => setSearchCnpj(e?.target?.value ?? e)}
          />

          <PrimaryButton
            onClick={handleSearch}
            disabled={!searchValue || loading}
          >
            <span className="material-icons-outlined">search</span>
          </PrimaryButton>

          <PrimaryButton
            variant="negative"
            onClick={handleClear}
            disabled={(!searchRazao && !searchCnpj) || loading}
          >
            <span className="material-icons-outlined">delete</span>
          </PrimaryButton>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-secondary">Carregando clientes...</p>
        </div>
      ) : (
        kanbanData && (
          <div
            ref={boardWrapperRef}
            style={{
              overflowX: 'auto',
              minHeight: '10vh',
              maxHeight: '70vh',
              width: '100%',
              WebkitOverflowScrolling: 'touch',
            }}
            className="board-horizontal-scroll draggable-x"
          >
            <TrelloBoardWrapper
              data={kanbanData}
              style={{
                minHeight: '10vh',
                maxHeight: '70vh',
                backgroundColor: 'transparent',
                boxShadow:
                  'inset 6px 0 10px -8px #c3b3e7, inset -6px 0 10px -8px #c3b3e7',
                scrollbarColor: '#8c53ff #e5e5e5',
                scrollbarWidth: 'thin',
                width: 'max-content',
                minWidth: '100%',
              }}
              laneStyle={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '10px',
              }}
              onCardMoveAcrossLanes={handleCardMove}
              components={{
                Card: (props: any) => (
                  <CardKanbanClientes
                    {...props}
                    onEdit={_id => {
                      if (props && props.data) {
                        handleEditCard(props.data);
                      }
                    }}
                    onDuplicate={_id => {
                      if (props && props.data) {
                        handleDuplicateCard(props.data);
                      }
                    }}
                    onDelete={_id => {
                      handleDeleteCard(props.data);
                    }}
                  />
                ),
              }}
            />
          </div>
        )
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages} ({total} clientes)
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal de remoção - igual VagaList */}
      {openRemover && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Remover Cliente</h2>
            <p className="mb-4">
              Deseja remover o cliente{' '}
              <span className="font-bold">
                {itemRemover?.empresa?.razaoSocial ?? ''}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                onClick={handleRemoverCancel}
                disabled={removerLoading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                onClick={handleRemoverConfirm}
                disabled={removerLoading}
              >
                {removerLoading ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .board-horizontal-scroll {
          cursor: grab;
        }
        .board-horizontal-scroll.scroll-grabbing {
          cursor: grabbing !important;
        }
        .board-horizontal-scroll,
        .board-horizontal-scroll * {
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default ClienteList;
