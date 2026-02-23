/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/components/Clients/ClientList.tsx
import api from '@/axios';
import Card from '@/components/Card';
import { useAdmin } from '@/context/AuthContext';
import { Pagination } from '@/types/pagination.type';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Table, { TableColumn } from '../Table';
import { StatusClienteEnum, StatusClienteEnumInput, StatusContratoEnum, StatusContratoEnumInput } from '@/schemas/statusClienteEnum.schema';
import { FormSelect } from '../input/FormSelect';

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
  contatos?: EmpresaContato[];
  localizacoes?: EmpresaLocalizacao[];
}
interface Cliente {
  id: string;
  tipoServico: string[];
  empresa: Empresa;
  status: StatusClienteEnumInput;
  statusContrato: StatusContratoEnumInput;
  usuarioSistema: {
    email: string;
  };
  // vagas removed
}

function normalizarTable(clientes: Cliente[]) {
  return clientes.map(c => ({
    id: c.id,
    razaoSocial: c.empresa?.razaoSocial ?? '-',
    email: c.usuarioSistema?.email ?? '-',
    cnpj: c.empresa?.cnpj ?? '-',
    statusContrato: c.statusContrato,
    servicos: Array.isArray(c.tipoServico)
      ? c.tipoServico.join(', ')
      : String(c.tipoServico ?? '-'),
    status: c.status,
    // vagasCount removed
  }));
}

const ClienteList: React.FC<{
  onlyProspects?: boolean;
}> = ({ onlyProspects }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchStatusCliente, setSearchStatusCliente] = useState<StatusClienteEnumInput | null>(null);
  const [searchStatusContrato, setSearchStatusContrato] = useState<StatusContratoEnumInput | null>(null);
  const [searchRazao, setSearchRazao] = useState<string>('');
  const [searchCnpj, setSearchCnpj] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const pageSize = 10;

  const router = useRouter();
  const isAdmin = useAdmin();

  const fetchClientes = useCallback(async (opts?: {
    resetPage?: boolean;
    resetFilters?: boolean;
  }) => {
    if (opts?.resetPage) setPage(1);

    setLoading(true);
    const searchValue: Record<string, any> = {};

    if (searchCnpj) {
      searchValue.cnpj = searchCnpj;
    }

    if (searchRazao) {
      searchValue.razaoSocial = searchRazao;
    }

    if (searchStatusCliente) {
      searchValue.status = searchStatusCliente;
    }

    if (searchStatusContrato) {
      searchValue.statusContrato = searchStatusContrato;
    }

    try {
      const params: Record<string, any> = {
        page: opts?.resetPage ? 1 : page,
        pageSize,
        search: opts?.resetFilters ? '' : searchValue,
      };

      const response = await api.get<Pagination<Cliente[]>>(
        '/api/externalWithAuth/cliente-studio/',
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
  }, [page, searchCnpj, searchRazao, searchStatusCliente, searchStatusContrato, pageSize]);

  const handleSearch = () => {
    setSearchClicked(true);
    fetchClientes({ resetPage: true });
  };

  const handleClear = async () => {
    setSearchRazao('');
    setSearchCnpj('');
    setSearchStatusCliente(null);
    setSearchStatusContrato(null);
    setSearchClicked(false);
    await fetchClientes({ resetPage: true, resetFilters: true });
  };

  useEffect(() => {
    if (!searchClicked && clientes.length === 0) {
      fetchClientes({ resetPage: true, resetFilters: true });
    }
  }, [fetchClientes, onlyProspects, pageSize, clientes.length, searchClicked]);

  useEffect(() => {
    fetchClientes();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dadosTabela = useMemo(() => normalizarTable(clientes), [clientes]);

  const columns: TableColumn<any>[] = [
    { label: 'Razão Social', key: 'razaoSocial' },
    { label: 'CNPJ', key: 'cnpj' },
    { label: 'Status Cliente', key: 'status', hiddeBtnCopy: true },
  ];

  if (isAdmin) {
    columns.push(
      {
        label: 'Status Contrato',
        key: 'statusContrato',
        hiddeBtnCopy: true,
      }
    );
  }

  const onRowClick = (row: any) => {
    router.push(`/cliente/${row.id}`);
  };

  const disabledClearButton = () => !searchRazao && !searchCnpj && !searchStatusCliente && !searchStatusContrato;

  return (
    <Card>
      <div className="flex justify-end items-center flex-wrap mb-2">
        <div className="flex gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
          <FormSelect
            name="buscar-status"
            value={searchStatusCliente ?? ''}
            selectProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const value = e.target.value as StatusClienteEnumInput | '';
              setSearchStatusCliente(value ? (value as StatusClienteEnumInput) : null);
            }}
          >
            <option value="">TODOS OS STATUS</option>
            {StatusClienteEnum.options.map(option =>
              <option value={option} key={option}>{option}</option>
            )}
          </FormSelect>

          <FormSelect
            name="buscar-status-contrato"
            value={searchStatusContrato ?? ''}
            selectProps={{
              classNameContainer: 'w-full',
              disabled: loading,
            }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const value = e.target.value as StatusContratoEnumInput | '';
              setSearchStatusContrato(value ? (value as StatusContratoEnumInput) : null);
            }}
          >
            <option value="">TODOS OS CONTRATOS</option>
            {
              StatusContratoEnum.options.map(option =>
                <option value={option} key={option}>{option}</option>
              )
            }
          </FormSelect>

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
            disabled={disabledClearButton()}
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
