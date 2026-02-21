/* eslint-disable @typescript-eslint/no-explicit-any */
import { KanbanClienteResponse } from '@/components/list/ClienteListKanban';
import { ClienteWithEmpresaInput } from '@/schemas/cliente.schema';
import api from '.';

export const getClienteById = async (
  uuid: string /* uuid */
): Promise<ClienteWithEmpresaInput> => {
  const response = await api.get(`/api/externalWithAuth/cliente-studio/${uuid}`);
  return response.data;
};

export const getCliente = async ({
  page = 1,
  pageSize = 5,
  ...params
}): Promise<KanbanClienteResponse> => {
  const clientes = await api.get('/api/externalWithAuth/cliente-studio/', {
    params: { page, pageSize, ...params },
  });

  return clientes.data;
};

export const saveCliente = async ({ payload }: any) => {
  const response = await api.post(
    '/api/externalWithAuth/cliente-studio/save',
    payload
  );

  return response;
};

/**
 * Atualiza o status do cliente pelo ID
 * @param {string} id - ID do cliente
 * @param {string} status - Novo status
 * @returns {Promise<any>}
 */
export const patchClienteStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<any> => {
  const response = await api.patch(`/api/externalWithAuth/cliente-studio/status`, {
    id,
    status,
  });
  return response.data;
};
