import { UsuarioSistema } from '@/schemas/kanban.schema';

/**
 * Extrai o nome do usuário a partir da estrutura usuarioSistema
 * Prioridade: funcionario.pessoa.nome > cliente.empresa.nomeFantasia > cliente.empresa.razaoSocial > email
 * 
 * @param usuarioSistema - Objeto usuarioSistema ou null/undefined
 * @returns Nome do usuário ou "Usuário desconhecido" se não houver dados
 */
export function getUsuarioNome(
  usuarioSistema: UsuarioSistema | null | undefined
): string {
  if (!usuarioSistema) return 'Usuário desconhecido';
  console.log('usuarioSistema', usuarioSistema);
  if (usuarioSistema.funcionario?.pessoa?.nome) {
    return usuarioSistema.funcionario.pessoa.nome;
  } else if (usuarioSistema.cliente?.empresa?.nomeFantasia) {
    return usuarioSistema.cliente.empresa.nomeFantasia;
  } else if (usuarioSistema.cliente?.empresa?.razaoSocial) {
    return usuarioSistema.cliente.empresa.razaoSocial;
  }

  return usuarioSistema.email || 'Usuário desconhecido';
}
