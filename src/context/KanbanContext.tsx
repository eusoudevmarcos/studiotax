/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  atualizarCardKanban,
  atualizarEtiquetasDoCard,
  KanbanFiltrosInput,
  moverColuna,
  obterQuadroCompleto,
  reordenarColunaCards,
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
        
        // Atualizar ordem para todos os cards
        // Como a renderização usa ordem descendente (maior primeiro), 
        // atribuímos ordem decrescente: primeiro item = maior ordem
        const totalCards = newCards.length;
        const cardsWithNewOrder = newCards.map((c, index) => ({
          ...c,
          ordem: totalCards - 1 - index,
        }));

        // Criar novo estado atualizando apenas a coluna uma vez
        const finalQuadro: QuadroCompleto = {
          ...updatedQuadro,
          colunas: updatedQuadro.colunas.map(col => {
            if (col.id === sourceColumnId) {
              return { ...col, cards: cardsWithNewOrder };
            }
            return col;
          }),
        };

        // Atualizar estado local (optimistic update)
        setQuadro(finalQuadro);

        // Call API - reordenação em lote (uma única requisição)
        try {
          await reordenarColunaCards(
            sourceColumnId,
            cardsWithNewOrder.map((c) => c.id)
          );
        } catch (err: any) {
          console.log('Erro ao mover card:', err);
          // Revert optimistic update
          setQuadro(originalQuadro);
          throw err;
        }
        return;
      }

      // Colunas diferentes - remover da origem e inserir no destino
      const filteredSourceCards = sortedSourceCards.filter(c => c.id !== cardId);
      const newTargetCardsList = [...sortedTargetCards];
      const updatedCard = { ...card, colunaKanbanId: targetColumnId };
      newTargetCardsList.splice(position, 0, updatedCard);

      // Atualizar ordem para todos os cards (ordem decrescente: primeiro = maior ordem)
      const totalTargetCards = newTargetCardsList.length;
      const targetCardsWithOrder = newTargetCardsList.map((c, index) => ({
        ...c,
        ordem: totalTargetCards - 1 - index,
      }));

      const totalSourceCards = filteredSourceCards.length;
      const sourceCardsWithOrder = filteredSourceCards.map((c, index) => ({
        ...c,
        ordem: totalSourceCards - 1 - index,
      }));

      // Criar novo estado com as colunas atualizadas
      const finalQuadro: QuadroCompleto = {
        ...updatedQuadro,
        colunas: updatedQuadro.colunas.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: sourceCardsWithOrder };
          }
          if (col.id === targetColumnId) {
            return { ...col, cards: targetCardsWithOrder };
          }
          return col;
        }),
      };

      // Atualizar estado local (optimistic update)
      setQuadro(finalQuadro);

      // Call API - mover card e reordenação em lote (3 requisições em vez de N+M)
      try {
        await atualizarCardKanban(cardId, {
          colunaKanbanId: targetColumnId,
        });
        await Promise.all([
          reordenarColunaCards(
            sourceColumnId,
            sourceCardsWithOrder.map((c) => c.id)
          ),
          reordenarColunaCards(
            targetColumnId,
            targetCardsWithOrder.map((c) => c.id)
          ),
        ]);
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
