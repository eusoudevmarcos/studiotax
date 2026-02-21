/* eslint-disable @typescript-eslint/no-explicit-any */
import { KanbanClienteResponse } from '@/components/list/ClienteListKanban';
import { ClienteWithEmpresaAndVagaInput } from '@/schemas/cliente.schema';
import { KanbanVagaResponse } from '@/schemas/vaga.schema';
import api from '.';

export const getClienteById = async (
  uuid: string /* uuid */
): Promise<ClienteWithEmpresaAndVagaInput> => {
  const response = await api.get(`/api/externalWithAuth/cliente-studio/${uuid}`);
  return response.data;
};

export const getVagasClienteById = async (
  uuid: string /* uuid */
): Promise<KanbanVagaResponse> => {
  const response = await api.get(`/api/externalWithAuth/vaga/cliente/${uuid}`);
  return response.data.data;
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
 * Atualiza o status de uma vaga pelo ID
 * @param {string} id - ID da vaga
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
