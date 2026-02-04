import { getHistoricoVaga } from '@/axios/vaga.axios';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

interface HistoricoItem {
  id: string;
  acao: string;
  camposAlterados: string[];
  createdAt: string;
  descricao?: string;
}

interface VagaInfo {
  id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  status?: string;
  dataPublicacao?: string;
  localizacao?: {
    cidade: string;
    uf: string;
  };
}

interface ModalHistoricoVagaProps {
  isOpen: boolean;
  onClose: () => void;
  vagaId: string;
}

const ModalHistoricoVaga: React.FC<ModalHistoricoVagaProps> = ({
  isOpen,
  onClose,
  vagaId,
}) => {
  const [loading, setLoading] = useState(false);
  const [vaga, setVaga] = useState<VagaInfo | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchHistorico = async (pageNum: number = 1) => {
    if (!vagaId) return;

    setLoading(true);
    try {
      const response = await getHistoricoVaga(vagaId, {
        page: pageNum,
        pageSize,
      });

      setVaga(response.vaga);
      setHistorico(response.historico?.data || []);
      setTotal(response.historico?.total || 0);
      setTotalPages(response.historico?.totalPages || 1);
    } catch (error) {
      console.log('Erro ao buscar histórico:', error);
      setHistorico([]);
      setVaga(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vagaId) {
      fetchHistorico(1);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vagaId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAcao = (acao: string) => {
    const acoes: Record<string, string> = {
      CRIACAO: 'Criação',
      ATUALIZACAO: 'Atualização',
      EXCLUSAO: 'Exclusão',
      RELACAO: 'Relação',
      STATUS: 'Status',
      SISTEMA: 'Sistema',
      INTEGRACAO: 'Integração',
      CANDIDATO_ADICIONADO: 'Candidato Adicionado',
      CANDIDATO_REMOVIDO: 'Candidato Removido',
      CANDIDATO_PROXIMA_ETAPA: 'Candidato Próxima Etapa',
    };
    return acoes[acao] || acao;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Histórico da Vaga"
      classNameBody="max-h-[80vh] overflow-y-auto"
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-primary">Carregando...</div>
        </div>
      ) : (
        <>
          {/* Informações da Vaga no Topo */}
          {vaga && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-primary mb-3">
                Informações da Vaga
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Título:
                  </span>
                  <p className="text-sm text-gray-900">{vaga.titulo}</p>
                </div>
                {vaga.categoria && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Categoria:
                    </span>
                    <p className="text-sm text-gray-900">{vaga.categoria}</p>
                  </div>
                )}
                {vaga.status && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Status:
                    </span>
                    <p className="text-sm text-gray-900">{vaga.status}</p>
                  </div>
                )}
                {vaga.dataPublicacao && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Data de Publicação:
                    </span>
                    <p className="text-sm text-gray-900">
                      {vaga.dataPublicacao}
                    </p>
                  </div>
                )}
                {vaga.localizacao && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Localização:
                    </span>
                    <p className="text-sm text-gray-900">
                      {vaga.localizacao.cidade} - {vaga.localizacao.uf}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Histórico */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Histórico de Alterações
            </h3>

            {historico.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum histórico encontrado para esta vaga.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {historico.map(item => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div>
                          <span className="text-sm font-semibold text-primary">
                            Ação:
                          </span>
                          <p className="text-sm text-gray-900 ml-2 inline">
                            {formatAcao(item.acao)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-primary">
                            Data:
                          </span>
                          <p className="text-sm text-gray-900 ml-2 inline">
                            {item.createdAt}
                          </p>
                        </div>
                      </div>

                      {item.camposAlterados &&
                        item.camposAlterados.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-semibold text-primary block mb-1">
                              Campos Atualizados:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {item.camposAlterados.map((campo, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {campo}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {item.descricao && (
                        <div className="mt-3">
                          <span className="text-sm font-semibold text-primary block mb-1">
                            Descrição:
                          </span>
                          <p className="text-sm text-gray-700">
                            {item.descricao}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      Total: {total} registros
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded border text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-primary border-primary bg-white"
                        onClick={() => {
                          const newPage = page - 1;
                          setPage(newPage);
                          fetchHistorico(newPage);
                        }}
                        disabled={page === 1}
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-gray-600">
                        Página {page} de {totalPages}
                      </span>
                      <button
                        className="px-3 py-1 rounded border text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-primary border-primary bg-white"
                        onClick={() => {
                          const newPage = page + 1;
                          setPage(newPage);
                          fetchHistorico(newPage);
                        }}
                        disabled={page === totalPages}
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalHistoricoVaga;
