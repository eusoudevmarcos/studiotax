import { KanbanFiltrosInput } from '@/axios/kanban.axios';
import { UsuarioSistema } from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useCallback, useMemo } from 'react';

interface KanbanFiltersProps {
  filtros: KanbanFiltrosInput | null;
  onFiltrosChange: (filtros: KanbanFiltrosInput | null) => void;
  criadores: UsuarioSistema[];
  membros: UsuarioSistema[];
  totalCards?: number;
}

export const KanbanFilters: React.FC<KanbanFiltersProps> = ({
  filtros,
  onFiltrosChange,
  criadores,
  totalCards,
}) => {
  const temFiltrosAtivos = useMemo(() => {
    if (!filtros) return false;
    return !!(
      filtros.usuarioSistemaId ||
      filtros.titulo ||
      filtros.descricao ||
      (filtros.membroIds && filtros.membroIds.length > 0) ||
      filtros.ordenarPor
    );
  }, [filtros]);

  const handleCriadorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFiltrosChange({
        ...filtros,
        usuarioSistemaId: value || undefined,
      });
    },
    [filtros, onFiltrosChange]
  );

  const handleTituloChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFiltrosChange({
        ...filtros,
        titulo: value || undefined,
      });
    },
    [filtros, onFiltrosChange]
  );

  const handleDescricaoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFiltrosChange({
        ...filtros,
        descricao: value || undefined,
      });
    },
    [filtros, onFiltrosChange]
  );

  const handleOrdenarPorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as 'criadoEm' | 'titulo' | 'ordem' | '';
      if (!value) {
        const { ordenarPor: _ordenarPor, ordemDirecao: _ordemDirecao, ...rest } = filtros || {};
        onFiltrosChange(Object.keys(rest).length > 0 ? rest : null);
      } else {
        // Determinar direção padrão baseada no campo
        const ordemDirecao: 'asc' | 'desc' = value === 'titulo' ? 'asc' : 'desc';
        onFiltrosChange({
          ...filtros,
          ordenarPor: value,
          ordemDirecao,
        });
      }
    },
    [filtros, onFiltrosChange]
  );

  const handleLimparFiltros = useCallback(() => {
    onFiltrosChange(null);
  }, [onFiltrosChange]);

  return (
    <div className="flex flex-col items-end justify-center rounded-lg px-2 py-1 text-white bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-[1000px]">
        {/* Filtro por Criador */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Criador
          </label>
          <select
            value={filtros?.usuarioSistemaId || ''}
            onChange={handleCriadorChange}
            className="w-full px-3 py-2 border border-gray-600 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black shadow-none"
          >
            <option value="">Todos</option>
            {criadores.map(criador =>
              criador ? (
                <option key={criador.id} value={criador.id}>
                  {getUsuarioNome(criador)}
                </option>
              ) : null
            )}
          </select>
        </div>

        {/* Filtro por Título */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Título
          </label>
          <input
            type="text"
            value={filtros?.titulo || ''}
            onChange={handleTituloChange}
            placeholder="Buscar por título..."
            className="w-full px-3 py-2 border border-gray-600 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black shadow-none placeholder-gray-400"
          />
        </div>

        {/* Filtro por Descrição */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={filtros?.descricao || ''}
            onChange={handleDescricaoChange}
            placeholder="Buscar por descrição..."
            className="w-full px-3 py-2 border border-gray-600 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black shadow-none placeholder-gray-400"
          />
        </div>


        {/* Filtro por Ordenação */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Ordenar por
          </label>
          <select
            value={filtros?.ordenarPor || ''}
            onChange={handleOrdenarPorChange}
            className="w-full px-3 py-2 border border-gray-600 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black shadow-none"
          >
            <option value="">Padrão</option>
            <option value="criadoEm">Últimos adicionados</option>
            <option value="titulo">Título A-Z</option>
            <option value="ordem">Ordem atual</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 h-4">
        {temFiltrosAtivos && totalCards !== undefined && (
          <span className="text-sm text-white bg-transparent px-2 py-1 rounded">
            {totalCards} {totalCards === 1 ? 'card encontrado' : 'cards encontrados'}
          </span>
        )}
        {temFiltrosAtivos && (
          <button
            onClick={handleLimparFiltros}
            className="flex items-center gap-1 text-sm text-white hover:text-blue-200 hover:bg-gray-700 rounded transition-colors"
          >
            <span className="material-icons align-middle text-lg">close</span>
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};
