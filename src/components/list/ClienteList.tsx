/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/components/Clients/ClientList.tsx
import api from '@/axios';
import Card from '@/components/Card';
import { useAdmin } from '@/context/AuthContext';
import { Pagination } from '@/types/pagination.type';
import { unmask } from '@/utils/mask/unmask';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Table, { TableColumn } from '../Table';

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

function normalizarTable(clientes: Cliente[]) {
  return clientes.map(c => ({
    id: c.id,
    razaoSocial: c.empresa?.razaoSocial ?? '-',
    email: c.usuarioSistema?.email ?? '-',
    cnpj: c.empresa?.cnpj ?? '-',
    dataAbertura: c.empresa?.dataAbertura
      ? new Date(c.empresa.dataAbertura).toLocaleDateString('pt-BR')
      : '-',
    servicos: Array.isArray(c.tipoServico)
      ? c.tipoServico.join(', ')
      : String(c.tipoServico ?? '-'),
    status: c.status,
    vagasCount: c.vagas.length,
  }));
}

const ClienteList: React.FC<{
  onlyProspects?: boolean;
}> = ({ onlyProspects }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);
  const [searchRazao, setSearchRazao] = useState<string>('');
  const [searchCnpj, setSearchCnpj] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const pageSize = 5;

  const router = useRouter();
  const isAdmin = useAdmin();

  // Determina o valor a ser enviado como search, priorizando CNPJ, depois razão social
  const searchValue = searchCnpj.trim()
    ? unmask(searchCnpj.trim())
    : searchRazao.trim();

  // Busca de clientes, disparada somente quando searchClicked ou filtros forem limpos
  const fetchClientes = async (opts?: {
    resetPage?: boolean;
    resetFilters?: boolean;
  }) => {
    if (opts?.resetPage) setPage(1);

    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: opts?.resetPage ? 1 : page,
        pageSize,
        search: opts?.resetFilters ? '' : searchValue,
      };

      const response = await api.get<Pagination<Cliente[]>>(
        '/api/externalWithAuth/cliente',
        {
          params,
        }
      );

      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setClientes(data);
      setTotal(data.length);
      setTotalPages(response.data.totalPages);
    } catch (_) {
      setClientes([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Gatilho: buscar clientes ao clicar em buscar
  const handleSearch = () => {
    setSearchClicked(true);
    fetchClientes({ resetPage: true });
  };

  // Gatilho: limpar filtros + buscar clientes sem filtro
  const handleClear = async () => {
    setSearchRazao('');
    setSearchCnpj('');
    setSearchClicked(false);
    await fetchClientes({ resetPage: true, resetFilters: true });
  };

  useEffect(() => {
    if (!searchClicked && clientes.length === 0) {
      fetchClientes({ resetPage: true, resetFilters: true });
    }
  }, [onlyProspects, pageSize]);

  useEffect(() => {
    fetchClientes();
  }, [page]);

  const dadosTabela = useMemo(() => normalizarTable(clientes), [clientes]);

  const columns: TableColumn<any>[] = [
    { label: 'razaoSocial', key: 'razaoSocial' },
    { label: 'Email acesso', key: 'email' },
    { label: 'CNPJ', key: 'cnpj' },
    { label: 'Abertura', key: 'dataAbertura' },

    { label: 'Status', key: 'status', hiddeBtnCopy: true },
  ];

  if (isAdmin) {
    columns.push(
      // { label: 'Serviços', hiddeBtnCopy: true, key: 'servicos' },
      {
        label: 'Vagas',
        key: 'vagasCount',
        hiddeBtnCopy: true,
      }
    );
  }

  const onRowClick = (row: any) => {
    router.push(`/cliente/${row.id}`);
  };

  return (
    <Card>
      <div className="flex justify-end items-center flex-wrap mb-2">
        <div className="flex gap-2 w-full max-w-[600px]">
          <FormInput
            name="buscar-razao"
            type="text"
            placeholder="Razão social ou Nome Fantasia"
            value={searchRazao}
            inputProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
              if (typeof e === 'string') {
                setSearchRazao(e);
              } else {
                setSearchRazao(e.target.value ?? '');
              }
            }}
          />

          <FormInput
            name="buscar-cnpj"
            placeholder="CNPJ"
            value={searchCnpj}
            maskProps={{ mask: '00.000.000/0000-00' }}
            inputProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
              if (typeof e === 'string') {
                setSearchCnpj(e);
              } else {
                setSearchCnpj(e.target.value ?? '');
              }
            }}
          />

          <PrimaryButton
            className="w-full md:w-auto"
            onClick={handleSearch}
            disabled={loading}
          >
            <span className="md:hidden text-sm!">Pesquisar</span>
            <span className="material-icons-outlined text-sm!">search</span>
          </PrimaryButton>

          <PrimaryButton
            variant="negative"
            onClick={handleClear}
            disabled={!searchRazao && !searchCnpj}
          >
            <span className="material-icons-outlined text-sm!">delete</span>
          </PrimaryButton>
        </div>
      </div>

      <Table
        columns={columns}
        data={dadosTabela}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado."
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

export default ClienteList;
