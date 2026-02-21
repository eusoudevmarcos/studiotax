// frontend/components/Agenda/AgendaList.tsx
import api from "@/axios";
import Card from "@/components/Card";
import { Pagination } from "@/types/pagination.type";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Table, { TableColumn } from "../Table";
import { PrimaryButton } from "../button/PrimaryButton";
import { FormInput } from "../input/FormInput";
import { AgendaInput } from "@/schemas/agenda.schema";

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
  vagaId?: string;
  etapaAtual?: EtapaAtual;
}

function normalizarTable(agendas: AgendaVaga[]) {
  return agendas.map((a) => ({
    id: a.id,
    dataHora: a.dataHora ? new Date(a.dataHora).toLocaleString("pt-BR") : "-",
    tipoEvento: a.tipoEvento,
    link: a.link ?? "-",
    // localizacao: a.localizacao
    //   ? `${a.localizacao.logradouro ?? '-'}, ${a.localizacao.cidade ?? '-'} - ${
    //       a.localizacao.uf ?? '-'
    //     }`
    //   : '-',
    etapa: a.etapaAtual?.nome ?? "-",
    tipoEtapa: a.etapaAtual?.tipo ?? "-",
  }));
}

const AgendaList: React.FC<{ noTitle?: boolean }> = ({ noTitle = false }) => {
  const [search, setSearch] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [agendas, setAgendas] = useState<AgendaVaga[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  // Handler para limpar pesquisa
  const handleClear = async () => {
    setSearchInput("");
    setSearch("");
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
    const s = search.toLowerCase();
    return dadosTabela.filter((a: AgendaVaga) =>
      [a.dataHora, a.tipoEvento, a.link, a.localizacao]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [dadosTabela, search]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: TableColumn<any>[] = [
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
      router.push(`/agenda/${row.id}`);
    };

  return (
    <Card noShadow>
      <div className="flex justify-between items-center flex-wrap mb-2">
        {!noTitle && (
          <h3 className="text-2xl font-bold text-primary">Lista de Agendas</h3>
        )}
        <div className="flex gap-2 w-full justify-end">
          <FormInput
            name=""
            type="text"
            placeholder="Buscar agenda..."
            value={searchInput}
            onChange={(e) => setSearchInput(e)}
            inputProps={{
              className:
                "grow w-full max-w-[300px] px-3 py-2 rounded-lg border border-gray-200 outline-none",
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
            disabled={!searchInput && !search}
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
  );
};

export default AgendaList;
