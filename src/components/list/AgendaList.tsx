// frontend/components/Agenda/AgendaList.tsx
import api from "@/axios";
import Card from "@/components/Card";
import { Pagination } from "@/types/pagination.type";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Table, { TableColumn } from "../Table";
import { PrimaryButton } from "../button/PrimaryButton";
import { FormInput } from "../input/FormInput";
import { AgendaInput } from "@/schemas/agenda.schema";

const AgendaDetailPage = dynamic(
  () =>
    import("@/pages/agenda/[id]").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);

interface Localizacao {
  cidade?: string;
  uf?: string;
  logradouro?: string;
}

interface EtapaAtual {
  nome: string;
  tipo: string;
}

interface AgendaVaga {
  id: string;
  dataHora: string;
  link?: string;
  tipoEvento: string;
  localizacao?: Localizacao;
  etapaAtual?: EtapaAtual;
  nome: string;
  titulo: string;
}

function normalizarTable(agendas: AgendaVaga[]) {
  return agendas.map((a) => ({
    id: a.id,
    dataHora: a.dataHora ? a.dataHora : "-",
    tipoEvento: a.tipoEvento,
    link: a.link ?? "-",
    etapa: a.etapaAtual?.nome ?? "-",
    tipoEtapa: a.etapaAtual?.tipo ?? "-",
    nome: a.nome ?? "-",
    titulo: a.titulo ?? "-",
  }));
}

const AgendaList: React.FC<{ noTitle?: boolean }> = ({ noTitle = false }) => {
  const [search, setSearch] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filtroNomeCadastrou, setFiltroNomeCadastrou] = useState("");
  const [agendas, setAgendas] = useState<AgendaVaga[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  // Paginação
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  // Handler para pesquisar agendas
  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
    setSearchClicked(true);
  };

  // Handler para limpar pesquisa e filtros
  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setFiltroNomeCadastrou("");
    setSearchClicked(false);
    setPage(1);
  };

  useEffect(() => {
    // Busca agendas toda vez que os filtros mudam
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const response = await api.get<Pagination<AgendaVaga[]>>(
          "/api/externalWithAuth/agenda",
          {
            params: {
              page,
              pageSize,
              search,
            },
          },
        );
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setAgendas(data);
        setTotal(data.length);
        setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
      } catch (_) {
        setAgendas([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    // Auto-carrega agendas só uma vez se não tem pesquisa nem click
    if (!searchClicked && agendas.length === 0 && search === "") {
      fetchAgendas();
    } else if (searchClicked || search !== "") {
      fetchAgendas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, searchClicked]);

  const dadosTabela = useMemo(() => normalizarTable(agendas), [agendas]);

  const dadosFiltrados = useMemo(() => {
    let result = dadosTabela;

    // Filtro geral (busca)
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((a: AgendaVaga & { localizacao?: string }) =>
        [a.dataHora, a.tipoEvento, a.link, a.localizacao, a.nome, a.titulo]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(s)),
      );
    }

    // Filtro específico: Nome de quem cadastrou
    if (filtroNomeCadastrou.trim()) {
      const nomeBusca = filtroNomeCadastrou.toLowerCase().trim();
      result = result.filter((a: AgendaVaga & { nome?: string }) =>
        String(a.nome ?? "").toLowerCase().includes(nomeBusca),
      );
    }

    return result;
  }, [dadosTabela, search, filtroNomeCadastrou]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: TableColumn<any>[] = [
    { label: "Criado Por", key: "nome" },
    { label: "Titulo", key: "titulo" },
    { label: "Data e Hora", key: "dataHora" },
    { label: "Evento", key: "tipoEvento" },
    {
      label: "Link",
      key: "link",
      render(row, index) {
        return (
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
            onClick={(e) => e.stopPropagation()}
          >
            Ir para Google Agenda
          </a>
        );
      },
    },
    // { label: 'Localização', key: 'localizacao' },
    // { label: 'Etapa', key: 'etapa' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowClick = (row: any) => {
    if (!row?.id) return;
    setSelectedAgendaId(row.id);
    setDetailOpen(true);
    setTimeout(() => setDetailVisible(true), 10);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setTimeout(() => {
      setDetailOpen(false);
      setSelectedAgendaId(null);
    }, 300);
  };

  return (
    <>
      <Card noShadow>
        <div className="flex justify-between items-center flex-wrap mb-2">
          {!noTitle && (
            <h3 className="text-2xl font-bold text-primary">Lista de Agendas</h3>
          )}
          <div className="flex flex-wrap gap-2 w-full justify-end items-end">
            <FormInput
              name=""
              type="text"
              placeholder="Buscar agenda..."
              value={searchInput}
              onChange={(e) => setSearchInput(e)}
              inputProps={{
                className:
                  "grow w-full max-w-[200px] px-3 py-2 rounded-lg border border-gray-200 outline-none",
                disabled: loading,
              }}
            />
            <FormInput
              name=""
              type="text"
              placeholder="Nome de quem cadastrou..."
              value={filtroNomeCadastrou}
              onChange={(value) => setFiltroNomeCadastrou(value)}
              inputProps={{
                className:
                  "grow w-full max-w-[200px] px-3 py-2 rounded-lg border border-gray-200 outline-none",
                disabled: loading,
              }}
            />
            <PrimaryButton
              onClick={handleSearch}
              disabled={loading || !searchInput.trim()}
            >
              <span className="material-icons-outlined">search</span>
            </PrimaryButton>
            <PrimaryButton
              variant="negative"
              onClick={handleClear}
              disabled={!searchInput && !search && !filtroNomeCadastrou}
            >
              <span className="material-icons-outlined">delete</span>
            </PrimaryButton>
          </div>
        </div>
        <Table
          columns={columns}
          data={dadosFiltrados}
          loading={loading}
          emptyMessage="Nenhuma agenda encontrada."
          pagination={{
            page,
            pageSize,
            total,
            totalPages,
            onPageChange: setPage,
          }}
          onRowClick={onRowClick}
        />
      </Card>

      {detailOpen && (
        <div
          className="fixed inset-0 z-[9999] flex justify-end bg-black/30"
          onClick={handleCloseDetail}
        >
          <div
            className={`h-full w-full max-w-3xl bg-white shadow-xl transform transition-transform duration-300 ${
              detailVisible ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold text-primary">
                Detalhes da Agenda
              </h3>
              <button
                type="button"
                className="text-2xl leading-none px-2"
                onClick={handleCloseDetail}
              >
                &times;
              </button>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">
              {selectedAgendaId && (
                <AgendaDetailPage id={selectedAgendaId} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgendaList;
