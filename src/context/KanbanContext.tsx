/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  atualizarEtiquetasDoCard,
  KanbanFiltrosInput,
  moverCard,
  moverColuna,
  obterQuadroCompleto,
  toggleChecklistCompleto,
  upsertCardData,
} from '@/axios/kanban.axios';
import { QuadroCompleto } from '@/schemas/kanban.schema';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface KanbanContextType {
  quadro: QuadroCompleto | null;
  loading: boolean;
  error: string | null;
  filtros: KanbanFiltrosInput | null;
  setFiltros: (filtros: KanbanFiltrosInput | null) => void;
  fetchQuadro: (id: string, filtros?: KanbanFiltrosInput) => Promise<void>;
  updateCardLabels: (cardId: string, etiquetaIds: string[]) => Promise<void>;
  updateCardDates: (
    cardId: string,
    data: {
      dataInicio?: string | Date;
      dataEntrega?: string | Date;
      recorrencia?: string;
      lembreteMinutosAntes?: number | null;
    }
  ) => Promise<void>;
  toggleCardChecklistCompleto: (cardId: string, completo: boolean) => Promise<void>;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    position: number
  ) => Promise<void>;
  moveColumn: (columnId: string, newPosition: number) => Promise<void>;
  refreshQuadro: () => Promise<void>;
  refreshAfterMutation: () => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

interface KanbanProviderProps {
  children: React.ReactNode;
  quadroId: string;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({
  children,
  quadroId,
}) => {
  const [quadro, setQuadro] = useState<QuadroCompleto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<KanbanFiltrosInput | null>(null);

  const fetchQuadro = useCallback(async (id: string, filtrosParam?: KanbanFiltrosInput) => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterQuadroCompleto(id, filtrosParam);
      setQuadro(data);
    } catch (err: any) {
      console.log('Erro ao buscar quadro:', err);
      setError(err.message || 'Erro ao carregar quadro');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuadro = useCallback(async () => {
    if (quadroId) {
      await fetchQuadro(quadroId, filtros || undefined);
    }
  }, [quadroId, fetchQuadro, filtros]);

  const moveCardHandler = useCallback(
    async (
      cardId: string,
      sourceColumnId: string,
      targetColumnId: string,
      position: number
    ) => {
      if (!quadro) return;

      // Salvar estado original para possível rollback
      const originalQuadro = quadro;

      // Criar cópia profunda imutável do estado
      const updatedQuadro: QuadroCompleto = {
        ...quadro,
        colunas: quadro.colunas.map(col => ({
          ...col,
          cards: [...col.cards],
        })),
      };

      const sourceColumn = updatedQuadro.colunas.find(
        col => col.id === sourceColumnId
      );
      const targetColumn = updatedQuadro.colunas.find(
        col => col.id === targetColumnId
      );

      if (!sourceColumn || !targetColumn) return;

      const card = sourceColumn.cards.find(c => c.id === cardId);
      if (!card) return;

      // Ordenar cards por ordem descendente (maior ordem primeiro = último adicionado no topo)
      const sortedSourceCards = [...sourceColumn.cards].sort(
        (a, b) => b.ordem - a.ordem
      );
      const sortedTargetCards = [...targetColumn.cards].sort(
        (a, b) => b.ordem - a.ordem
      );

      // Se é a mesma coluna, usar arrayMove e atualizar apenas uma vez
      if (sourceColumnId === targetColumnId) {
        const sourceIndex = sortedSourceCards.findIndex(c => c.id === cardId);
        const newCards = arrayMove(sortedSourceCards, sourceIndex, position);
        
        // Atualizar ordem para todos os cards (ordem descendente: maior ordem primeiro)
        // O array já está ordenado em ordem descendente, então precisamos inverter
        const totalCards = newCards.length;
        newCards.forEach((c, index) => {
          c.ordem = totalCards - 1 - index; // Inverter para manter ordem descendente
        });

        // Criar novo estado atualizando apenas a coluna uma vez
        const finalQuadro: QuadroCompleto = {
          ...updatedQuadro,
          colunas: updatedQuadro.colunas.map(col => {
            if (col.id === sourceColumnId) {
              return { ...col, cards: newCards };
            }
            return col;
          }),
        };

        // Atualizar estado local (optimistic update)
        setQuadro(finalQuadro);

        // Call API
        try {
          await moverCard({
            cardId,
            novaColunaId: targetColumnId,
            novaPosicao: position,
          });
        } catch (err: any) {
          console.log('Erro ao mover card:', err);
          // Revert optimistic update
          setQuadro(originalQuadro);
          throw err;
        }
        return;
      }

      // Colunas diferentes - remover da origem e inserir no destino
      const newSourceCards = sortedSourceCards.filter(c => c.id !== cardId);
      const newTargetCards = [...sortedTargetCards];
      const updatedCard = { ...card, colunaKanbanId: targetColumnId };
      newTargetCards.splice(position, 0, updatedCard);

      // Atualizar ordem para todos os cards na coluna de destino (ordem descendente)
      const totalTargetCards = newTargetCards.length;
      newTargetCards.forEach((c, index) => {
        c.ordem = totalTargetCards - 1 - index; // Inverter para manter ordem descendente
      });

      // Atualizar ordem para todos os cards na coluna de origem (ordem descendente)
      const totalSourceCards = newSourceCards.length;
      newSourceCards.forEach((c, index) => {
        c.ordem = totalSourceCards - 1 - index; // Inverter para manter ordem descendente
      });

      // Criar novo estado com as colunas atualizadas
      const finalQuadro: QuadroCompleto = {
        ...updatedQuadro,
        colunas: updatedQuadro.colunas.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: newSourceCards };
          }
          if (col.id === targetColumnId) {
            return { ...col, cards: newTargetCards };
          }
          return col;
        }),
      };

      // Atualizar estado local (optimistic update)
      setQuadro(finalQuadro);

      // Call API
      try {
        await moverCard({
          cardId,
          novaColunaId: targetColumnId,
          novaPosicao: position,
        });
        // Não fazer refresh automático - o estado já está atualizado
        // Apenas em caso de erro fazemos rollback
      } catch (err: any) {
        console.log('Erro ao mover card:', err);
        // Revert optimistic update
        setQuadro(originalQuadro);
        throw err;
      }
    },
    [quadro]
  );

  // Fetch quando quadroId ou filtros mudarem
  useEffect(() => {
    if (quadroId) {
      fetchQuadro(quadroId, filtros || undefined);
    }
  }, [quadroId, filtros, fetchQuadro]);

  const moveColumnHandler = useCallback(
    async (columnId: string, newPosition: number) => {
      if (!quadro) return;

      // Salvar estado original para possível rollback
      const originalQuadro = quadro;

      // Criar cópia profunda imutável do estado
      const updatedQuadro: QuadroCompleto = {
        ...quadro,
        colunas: quadro.colunas.map(col => ({ ...col })),
      };

      // Ordenar colunas por ordem
      const sortedColumns = [...updatedQuadro.colunas].sort(
        (a, b) => a.ordem - b.ordem
      );

      // Encontrar índice da coluna atual
      const currentIndex = sortedColumns.findIndex(c => c.id === columnId);
      if (currentIndex === -1) return;

      // Usar arrayMove para calcular nova ordem
      const newColumns = arrayMove(sortedColumns, currentIndex, newPosition);

      // Atualizar ordem de todas as colunas
      newColumns.forEach((col, index) => {
        col.ordem = index;
      });

      // Criar novo estado com colunas atualizadas
      const finalQuadro: QuadroCompleto = {
        ...updatedQuadro,
        colunas: newColumns,
      };

      // Atualizar estado local (optimistic update)
      setQuadro(finalQuadro);

      // Call API
      try {
        await moverColuna({
          colunaId: columnId,
          novaPosicao: newPosition,
        });
      } catch (err: any) {
        console.log('Erro ao mover coluna:', err);
        // Revert optimistic update
        setQuadro(originalQuadro);
        throw err;
      }
    },
    [quadro]
  );

  const refreshAfterMutation = useCallback(async () => {
    if (quadroId) {
      try {
        // Não setar loading para true aqui para não bloquear a UI
        const data = await obterQuadroCompleto(quadroId, filtros || undefined);
        setQuadro(data);
      } catch (err: any) {
        console.log('Erro ao atualizar quadro após mutação:', err);
        setError(err.message || 'Erro ao atualizar quadro');
        // Em caso de erro, tentar fazer um fetch completo
        await fetchQuadro(quadroId, filtros || undefined);
      }
    }
  }, [quadroId, fetchQuadro, filtros]);

  const updateCardLabels = useCallback(
    async (cardId: string, etiquetaIds: string[]) => {
      await atualizarEtiquetasDoCard(cardId, etiquetaIds);
      await refreshAfterMutation();
    },
    [refreshAfterMutation]
  );

  const updateCardDates = useCallback(
    async (
      cardId: string,
      data: {
        dataInicio?: string | Date;
        dataEntrega?: string | Date;
        recorrencia?: string;
        lembreteMinutosAntes?: number | null;
      }
    ) => {
      await upsertCardData(cardId, data);
      await refreshAfterMutation();
    },
    [refreshAfterMutation]
  );

  const toggleCardChecklistCompleto = useCallback(
    async (cardId: string, completo: boolean) => {
      await toggleChecklistCompleto(cardId, completo);
      await refreshAfterMutation();
    },
    [refreshAfterMutation]
  );

  const value: KanbanContextType = {
    quadro,
    loading,
    error,
    filtros,
    setFiltros,
    fetchQuadro,
    updateCardLabels,
    updateCardDates,
    toggleCardChecklistCompleto,
    moveCard: moveCardHandler,
    moveColumn: moveColumnHandler,
    refreshQuadro,
    refreshAfterMutation,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
