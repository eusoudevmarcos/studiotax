// pages/agenda/[id].tsx
import api from "@/axios";
import Card from "@/components/Card";
import { EditPenIcon, TrashIcon } from "@/components/icons";
import { useCliente } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

// Dynamic imports para componentes pesados
const AgendaForm = dynamic(
  () =>
    import("@/components/form/AgendaForm").then((mod) => ({
      default: mod.AgendaForm,
    })),
  {
    loading: () => (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-primary">Carregando formulário...</span>
      </div>
    ),
    ssr: false,
  },
);

const Modal = dynamic(() => import("@/components/modal/Modal"), {
  ssr: false,
});

import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";

interface AgendaPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialAgenda?: any;
  initialError?: string | null;
}

const AgendaPage: React.FC<AgendaPageProps> = ({
  initialAgenda,
  initialError,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const isCliente = useCliente();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [agenda, setAgenda] = useState<any | null>(initialAgenda || null);
  const [loading, setLoading] = useState(!initialAgenda);
  const [erro, setErro] = useState<string | null>(initialError || null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const fetchAgenda = useCallback(async () => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    setErro(null);
    try {
      const res = await api.get(`/api/externalWithAuth/agenda/${id}`);
      setAgenda(res.data);
    } catch (_) {
      setErro("Agenda não encontrada ou erro ao buscar dados.");
      setAgenda(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Só busca se não tiver dados iniciais do SSR
    if (!initialAgenda) {
      fetchAgenda();
    }
  }, [fetchAgenda, initialAgenda]);

  const handleTrash = useCallback(async () => {
    if (!agenda) return;
    if (confirm("Tem certeza que deseja excluir esta agenda?")) {
      try {
        await api.delete(`/api/externalWithAuth/agenda/${agenda.id}`);
        router.push("/agendas");
      } catch {
        alert("Erro ao excluir agenda.");
      }
    }
  }, [agenda, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  if (!agenda) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary w-full">
            Detalhes da Agenda
          </h1>
          {isCliente && (
            <div className="flex gap-2">
              <button
                className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110"
                onClick={() => setShowModalEdit(true)}
              >
                <EditPenIcon />
              </button>
              <button
                className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110"
                onClick={handleTrash}
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Sessão Dados da Agenda */}
          <Card title="Dados da Agenda">
            <div>
              <span className="font-medium">Titulo:</span>
              <span className="text-secondary ml-2">{agenda.titulo}</span>
            </div>
            <div>
              <span className="font-medium">Data e Hora:</span>
              <span className="text-secondary ml-2">{agenda.dataHora}</span>
            </div>
            <div>
              <span className="font-medium">Tipo do Evento:</span>
              <span className="text-secondary ml-2">
                {agenda.tipoEvento?.replace(/_/g, " ") || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium">local Evento:</span>
              <span className="text-secondary ml-2">
                {agenda.localEvento || "N/A"}
              </span>
            </div>
            <div>
              <span>{agenda.link}</span>
              <a
                href={agenda.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 ml-2"
              >
                Ir para
              </a>
            </div>
          </Card>

          {/* Sessão Localização */}
          {agenda.localizacao && (
            <Card title="Localização">
              {agenda.localizacao.cidade && (
                <div>
                  <span className="font-medium">Cidade:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.cidade}
                  </span>
                </div>
              )}
              {agenda.localizacao.estado && (
                <div>
                  <span className="font-medium">Estado:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.estado}
                  </span>
                </div>
              )}
              {agenda.localizacao.cep && (
                <div>
                  <span className="font-medium">CEP:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.cep}
                  </span>
                </div>
              )}
              {agenda.localizacao.bairro && (
                <div>
                  <span className="font-medium">Bairro:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.bairro}
                  </span>
                </div>
              )}
              {agenda.localizacao.uf && (
                <div>
                  <span className="font-medium">UF:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.uf}
                  </span>
                </div>
              )}
              {agenda.localizacao.complemento && (
                <div>
                  <span className="font-medium">Complemento:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.complemento}
                  </span>
                </div>
              )}
              {agenda.localizacao.logradouro && (
                <div>
                  <span className="font-medium">Logradouro:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.logradouro}
                  </span>
                </div>
              )}
              {agenda.localizacao.regiao && (
                <div>
                  <span className="font-medium">Região:</span>
                  <span className="text-secondary ml-2">
                    {agenda.localizacao.regiao}
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Sessão Vaga */}
          {agenda.vaga && (
            <Card title="Vaga Associada">
              <div>
                <span className="font-medium">Título:</span>
                <span className="text-secondary ml-2">
                  {agenda.vaga.titulo || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="text-secondary ml-2">
                  {agenda.vaga.status || "N/A"}
                </span>
              </div>
              {/* Adicione mais campos relevantes da vaga se necessário */}
            </Card>
          )}

          {/* Sessão Etapa Atual */}
          {agenda.etapaAtual && (
            <Card title="Etapa Atual do Processo Seletivo">
              <div>
                <span className="font-medium">Nome:</span>
                <span className="text-secondary ml-2">
                  {agenda.etapaAtual.nome}
                </span>
              </div>
              <div>
                <span className="font-medium">Tipo:</span>
                <span className="text-secondary ml-2">
                  {agenda.etapaAtual.tipo}
                </span>
              </div>
              <div>
                <span className="font-medium">Ordem:</span>
                <span className="text-secondary ml-2">
                  {agenda.etapaAtual.ordem}
                </span>
              </div>
              <div>
                <span className="font-medium">Descrição:</span>
                <span className="text-secondary ml-2">
                  {agenda.etapaAtual.descricao || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium">Ativa:</span>
                <span className="text-secondary ml-2">
                  {agenda.etapaAtual.ativa ? "Sim" : "Não"}
                </span>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Modal de edição pode ser implementado futuramente */}
      <SessionProviderWrapper>
        <Modal
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          title="Editar Agenda"
        >
          <AgendaForm onSuccess={() => {}} initialValues={agenda} />
        </Modal>
      </SessionProviderWrapper>
    </div>
  );
};

export default AgendaPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    // Criar instância de API para servidor
    const serverApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3000",
      withCredentials: true,
      headers: context.req.headers.cookie
        ? { Cookie: context.req.headers.cookie }
        : {},
    });

    const res = await serverApi.get(`/api/externalWithAuth/agenda/${id}`);

    return {
      props: {
        initialAgenda: res.data,
        initialError: null,
      },
    };
  } catch (error) {
    return {
      props: {
        initialAgenda: null,
        initialError: "Agenda não encontrada ou erro ao buscar dados.",
      },
    };
  }
};
