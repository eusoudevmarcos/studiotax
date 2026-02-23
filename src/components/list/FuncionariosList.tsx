import api from '@/axios';
import Card from '@/components/Card';
import { Pagination } from '@/types/pagination.type';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Table, { TableColumn } from '../Table';
import { ClienteInput } from '@/schemas/cliente.schema';

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
    let nome = '-';
    if (f.funcionario && f.funcionario.pessoa && f.funcionario.pessoa.nome) {
      nome = f.funcionario.pessoa.nome;
    }
    return {
      id: f.id,
      nome,
      email: f.email,
      tipoUsuario: f.tipoUsuario,
      setor: f.funcionario?.setor || '-',
      cargo: f.funcionario?.cargo || '-',
    };
  });
}

// Colunas da tabela
const columns: TableColumn<FuncionarioTabela>[] = [
  { label: 'Nome', key: 'nome' },
  { label: 'Email', key: 'email' },
  { label: 'Tipo Usuário', key: 'tipoUsuario' },
  { label: 'Setor', key: 'setor' },
  { label: 'Cargo', key: 'cargo' },
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
  const [searchNomeInput, setSearchNomeInput] = useState<string>('');
  const [searchEmailInput, setSearchEmailInput] = useState<string>('');
  const [searchTipoUsuarioInput, setSearchTipoUsuarioInput] =
    useState<string>('');

  // Filtros aplicados enviados para a API
  const [appliedFilters, setAppliedFilters] = useState<{
    nome: string;
    email: string;
    tipoUsuario: string;
    // Se quiser expandir para setor/cargo, adicione aqui
  }>({
    nome: '',
    email: '',
    tipoUsuario: '',
  });

  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  const router = useRouter();

  // Busca para API apenas com filtros aplicados;
  const fetchFuncionarios = async (
    aplicarFiltros = false,
    pageOverride?: number
  ) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: Record<string, any> = {
        page: typeof pageOverride === 'number' ? pageOverride : page,
        pageSize,
      };

      // Apenas envia filtros aplicados na API (appliedFilters)
      if (aplicarFiltros) {
        if (appliedFilters.nome.trim())
          params.nome = appliedFilters.nome.trim();
        if (appliedFilters.email.trim())
          params.email = appliedFilters.email.trim();
        if (appliedFilters.tipoUsuario.trim())
          params.tipoUsuario = appliedFilters.tipoUsuario.trim();
      }
      const response = await api.get<Pagination<FuncionarioApi[]>>(
        '/api/externalWithAuth/funcionario-studiotax',
        { params }
      );
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
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
  };

  // Busca inicial SEM filtros ao montar
  useEffect(() => {
    fetchFuncionarios(false, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fazer busca com filtros apenas quando clicar em Search OU mudar página após Search
  useEffect(() => {
    if (searchClicked) {
      fetchFuncionarios(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters, searchClicked]);

  const dadosTabela = useMemo(
    () => normalizarTable(funcionarios),
    [funcionarios]
  );

  // Ao clicar search: aplica valores dos filtros e reseta página
  const handleSearch = () => {
    setAppliedFilters({
      nome: searchNomeInput,
      email: searchEmailInput,
      tipoUsuario: searchTipoUsuarioInput,
    });
    setPage(1);
    setSearchClicked(true);
  };

  // Limpa as pesquisas, reseta filtros e faz buscar sem filtro
  const handleClear = async () => {
    setSearchNomeInput('');
    setSearchEmailInput('');
    setSearchTipoUsuarioInput('');

    setAppliedFilters({
      nome: '',
      email: '',
      tipoUsuario: '',
    });
    setPage(1);
    setSearchClicked(false);
    await fetchFuncionarios(false, 1);
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
          onChange={e => setSearchNomeInput(e)}
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
          onChange={e => setSearchEmailInput(e)}
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
          onChange={e => setSearchTipoUsuarioInput(e)}
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
