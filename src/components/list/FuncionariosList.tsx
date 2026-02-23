import api from "@/axios";
import Card from "@/components/Card";
import { Pagination } from "@/types/pagination.type";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { PrimaryButton } from "../button/PrimaryButton";
import { FormInput } from "../input/FormInput";
import Table, { TableColumn } from "../Table";
import { ClienteInput } from "@/schemas/cliente.schema";

// Tipos para Pessoa e Empresa
interface Pessoa {
  nome?: string;
}

type FuncionarioApi = {
  id: string;
  email: string;
  password: string;
  tipoUsuario: string;
  funcionario: {
    id: string;
    setor?: string;
    cargo?: string;
    usuarioSistemaId?: string;
    pessoaId?: string | null;
    pessoa?: Pessoa | null;
  } | null;
  cliente: ClienteInput; // não utilizado para funcionários
};

type FuncionarioTabela = {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: string;
  setor: string;
  cargo: string;
};

function normalizarTable(funcionarios: FuncionarioApi[]): FuncionarioTabela[] {
  return funcionarios.map((f: FuncionarioApi) => {
    let nome = "-";
    if (f.funcionario && f.funcionario.pessoa && f.funcionario.pessoa.nome) {
      nome = f.funcionario.pessoa.nome;
    }
    return {
      id: f.id,
      nome,
      email: f.email,
      tipoUsuario: f.tipoUsuario,
      setor: f.funcionario?.setor || "-",
      cargo: f.funcionario?.cargo || "-",
    };
  });
}

// Colunas da tabela
const columns: TableColumn<FuncionarioTabela>[] = [
  { label: "Nome", key: "nome" },
  { label: "Email", key: "email" },
  { label: "Tipo Usuário", key: "tipoUsuario" },
  { label: "Setor", key: "setor" },
  { label: "Cargo", key: "cargo" },
];

const FuncionariosList: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioApi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para paginação
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Estados controlados dos inputs de busca
  const [searchNomeInput, setSearchNomeInput] = useState<string>("");
  const [searchEmailInput, setSearchEmailInput] = useState<string>("");
  const [searchTipoUsuarioInput, setSearchTipoUsuarioInput] =
    useState<string>("");

  // Filtros aplicados enviados para a API
  const [appliedFilters, setAppliedFilters] = useState<{
    nome: string;
    email: string;
    tipoUsuario: string;
  }>({
    nome: "",
    email: "",
    tipoUsuario: "",
  });

  const router = useRouter();

  /*
    --------- AJUSTE DA PAGINAÇÃO: ---------

    O problema original do código é que haviam dois efeitos (useEffect) rodando chamadas para fetchFuncionarios:
      - Um rodava sempre que `page` mudava (mesmo sem filtros), isso causava chamadas duplicadas ou incorretas.
      - O outro ficava preso à combinação de `page`, `appliedFilters` e `searchClicked`, mas não separava bem os fluxos de busca por filtros x paginação pura.

    Também era usado um sinalizador `searchClicked`, que confunde o gatilho correto da busca filtrada.
    O correto é:
      - Quando o usuário fizer uma busca: aplicar filtros + ir para página 1
      - Quando mudar de página: buscar novamente, levando em conta se há filtro ativo ou não

    Portanto, reescrevemos o controle de efeitos e de chamada da função fetchFuncionarios.
  */

  // Função para buscar funcionários, memoizada para não mudar desnecessariamente
  const fetchFuncionarios = useCallback(
    async (opts?: { page?: number; filters?: typeof appliedFilters }) => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page: opts?.page ?? page,
          pageSize,
        };

        // Decide se aplica filtros baseando-se na presença das chaves em filters
        const filtersToUse = opts?.filters ?? appliedFilters;
        if (filtersToUse.nome.trim()) params.nome = filtersToUse.nome.trim();
        if (filtersToUse.email.trim()) params.email = filtersToUse.email.trim();
        if (filtersToUse.tipoUsuario.trim())
          params.tipoUsuario = filtersToUse.tipoUsuario.trim();

        const response = await api.get<Pagination<FuncionarioApi[]>>(
          "/api/externalWithAuth/funcionario-studiotax",
          { params },
        );
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setFuncionarios(data);
        setTotal(response.data.total ?? data.length);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (_) {
        setFuncionarios([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, appliedFilters],
  );

  // Refaz busca sempre que filtros OU página mudarem
  useEffect(() => {
    fetchFuncionarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  const dadosTabela = useMemo(
    () => normalizarTable(funcionarios),
    [funcionarios],
  );

  // Ao clicar search: aplica valores dos filtros e reseta página (e busca é disparada pelo useEffect)
  const handleSearch = () => {
    setAppliedFilters({
      nome: searchNomeInput,
      email: searchEmailInput,
      tipoUsuario: searchTipoUsuarioInput,
    });
    setPage(1);
  };

  // Limpa as pesquisas, reseta filtros e faz buscar sem filtro
  const handleClear = () => {
    setSearchNomeInput("");
    setSearchEmailInput("");
    setSearchTipoUsuarioInput("");

    setAppliedFilters({
      nome: "",
      email: "",
      tipoUsuario: "",
    });
    setPage(1);
  };

  const onRowClick = (row: FuncionarioTabela) => {
    router.push(`/funcionario/${row.id}`);
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold text-primary">Lista de Funcionários</h3>
      <div className="flex justify-end items-end flex-wrap mb-2 gap-2">
        <FormInput
          name="buscar-nome"
          label="Nome"
          type="text"
          placeholder="Nome"
          value={searchNomeInput}
          inputProps={{
            disabled: loading,
          }}
          onChange={(e) => setSearchNomeInput(e)}
        />

        <FormInput
          name="buscar-email"
          label="E-mail"
          type="text"
          placeholder="Email"
          value={searchEmailInput}
          inputProps={{
            disabled: loading,
          }}
          onChange={(e) => setSearchEmailInput(e)}
        />

        <FormInput
          name="buscar-tipo-usuario"
          label="Tipo Usuario"
          type="text"
          placeholder="Tipo usuário"
          value={searchTipoUsuarioInput}
          inputProps={{
            disabled: loading,
          }}
          onChange={(e) => setSearchTipoUsuarioInput(e)}
        />

        <PrimaryButton
          onClick={handleSearch}
          disabled={
            loading ||
            (!searchNomeInput.trim() &&
              !searchEmailInput.trim() &&
              !searchTipoUsuarioInput.trim())
          }
        >
          <span className="material-icons-outlined">search</span>
        </PrimaryButton>

        <PrimaryButton
          variant="negative"
          onClick={handleClear}
          disabled={
            !(
              searchNomeInput.trim() ||
              searchEmailInput.trim() ||
              searchTipoUsuarioInput.trim()
            )
          }
        >
          <span className="material-icons-outlined">delete</span>
        </PrimaryButton>
      </div>

      <Table
        columns={columns}
        data={dadosTabela}
        loading={loading}
        emptyMessage="Nenhum funcionário encontrado."
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: (p: number) => setPage(p),
        }}
        onRowClick={onRowClick}
      />
    </Card>
  );
};

export default FuncionariosList;
