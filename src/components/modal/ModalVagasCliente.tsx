import { getVagasClienteById } from '@/axios/vaga.axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Modal from './Modal';

type Vaga = {
  id: string;
  titulo: string;
  dataPublicacao: string;
  status: string;
  categoria: string;
  tipoSalario: string;
  _count: {
    candidaturas: number;
  };
};

type VagasClienteResponse = {
  data: Vaga[];
  totalPaginas: number;
  total: number;
};

export function ModalVagasCliente({
  uuid,
  open,
}: {
  uuid: string;
  open: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [vagasCliente, setVagasCliente] = useState<Vaga[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    if (!uuid) {
      setVagasCliente([]);
      setTotalPaginas(1);
      return;
    }

    const fetchVagasCliente = async () => {
      setLoading(true);
      setErro(null);
      try {
        // A resposta precisa conter totalPaginas/tamanho total
        const response: VagasClienteResponse = await getVagasClienteById(uuid, {
          page: paginaAtual,
          pageSize: 5,
        });
        setVagasCliente(response.data || []);
        setTotalPaginas(response.totalPaginas || 1);
      } catch (e) {
        setErro('Cliente não encontrado ou erro ao buscar dados.');
        setVagasCliente([]);
        setTotalPaginas(1);
      } finally {
        setLoading(false);
      }
    };

    fetchVagasCliente();
  }, [uuid, paginaAtual]);

  const handlePaginaAnterior = () => {
    setPaginaAtual(prev => Math.max(prev - 1, 1));
  };

  const handleProximaPagina = () => {
    setPaginaAtual(prev => Math.min(prev + 1, totalPaginas));
  };

  const handleIrParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
  };

  return (
    <Modal isOpen={open} title="Vagas do Cliente" onClose={() => {}}>
      <div className="min-w-full">
        {loading && <div>Carregando...</div>}

        {!loading && erro && <div className="text-red-500">{erro}</div>}

        {!loading && !erro && vagasCliente.length === 0 && (
          <div>Nenhuma vaga encontrada.</div>
        )}

        {!loading && !erro && vagasCliente.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Publicado</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Categoria</th>
                  <th className="px-4 py-2 text-left">Tipo de Salário</th>
                  <th className="px-4 py-2 text-left">Candidaturas</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {vagasCliente.map(vaga => (
                  <tr key={vaga.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{vaga.titulo}</td>
                    <td className="px-4 py-2 text-secondary">
                      {vaga.dataPublicacao}
                    </td>
                    <td className="px-4 py-2">{vaga.status}</td>
                    <td className="px-4 py-2">{vaga.categoria}</td>
                    <td className="px-4 py-2">{vaga.tipoSalario}</td>
                    <td className="px-4 py-2 flex items-center gap-1">
                      <span className="material-icons-outlined text-base mr-1">
                        group
                      </span>
                      {vaga._count?.candidaturas ?? 0}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/vaga/${vaga.id}`}
                        className="text-primary underline hover:text-secondary text-sm"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !erro && totalPaginas > 1 && (
          <div className="w-full flex justify-center mt-6">
            <nav className="flex gap-2 items-center" aria-label="Paginação">
              <button
                type="button"
                className="px-2 py-1 rounded border border-gray-300 bg-white text-primary disabled:opacity-50"
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, idx) => (
                <button
                  type="button"
                  key={idx + 1}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    paginaAtual === idx + 1
                      ? 'bg-primary text-white'
                      : 'bg-white text-primary'
                  }`}
                  onClick={() => handleIrParaPagina(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                type="button"
                className="px-2 py-1 rounded border border-gray-300 bg-white text-primary disabled:opacity-50"
                onClick={handleProximaPagina}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </button>
            </nav>
          </div>
        )}
      </div>
    </Modal>
  );
}
