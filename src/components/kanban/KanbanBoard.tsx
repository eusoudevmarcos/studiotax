import { useKanban } from '@/context/KanbanContext';
import { CardKanban, ColunaKanban, VinculoCard } from '@/schemas/kanban.schema';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useCallback, useMemo, useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

// Wrapper para coluna
const ColumnWrapper: React.FC<{
  columnId: string;
  cardIds: string[];
  children: React.ReactNode;
  column: ColunaKanban;
}> = ({ columnId, cardIds, children, column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? 'none' : undefined,
  } as React.CSSProperties;

  return (
    <SortableContext
      id={columnId}
      items={cardIds}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {children}
      </div>
    </SortableContext>
  );
};

interface KanbanBoardProps {
  quadroId: string;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: CardKanban) => void;
  onDeleteCard?: (card: CardKanban) => void;
  onCardClick?: (card: CardKanban) => void;
  onEditColumn?: (column: ColunaKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  canAddCard?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  animatingItemId?: string | null;
  isItemAnimating?: (itemId: string) => boolean;
  creatingCardColumnId?: string | null;
  onCardCreated?: () => void;
  onCancelCreateCard?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  quadroId: _quadroId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardClick,
  onEditColumn,
  renderVinculos,
  canAddCard = true,
  loading = false,
  onRefresh: _onRefresh,
  animatingItemId: _animatingItemId,
  isItemAnimating,
  creatingCardColumnId,
  onCardCreated,
  onCancelCreateCard,
}) => {
  const { quadro, moveCard: moveCardContext, moveColumn: moveColumnContext } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columnIds = useMemo(
    () => quadro?.colunas.map(col => col.id) || [],
    [quadro]
  );

  const getColumnCardIds = useCallback(
    (columnId: string) => {
      const column = quadro?.colunas.find(col => col.id === columnId);
      return column?.cards.map(card => card.id) || [];
    },
    [quadro]
  );

  // Descobrir tipo do item ativo
  const activeType = useMemo(() => {
    if (!activeId || !quadro) return null;
    
    // Verificar se é coluna
    if (quadro.colunas.some(col => col.id === activeId)) {
      return 'column';
    }
    
    // Verificar se é card
    for (const column of quadro.colunas) {
      if (column.cards.some(c => c.id === activeId)) {
        return 'card';
      }
    }
    
    return null;
  }, [activeId, quadro]);

  const activeCard = useMemo(() => {
    if (activeType !== 'card' || !activeId || !quadro) return null;
    for (const column of quadro.colunas) {
      const card = column.cards.find(c => c.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, activeType, quadro]);

  const activeColumn = useMemo(() => {
    if (activeType !== 'column' || !activeId || !quadro) return null;
    return quadro.colunas.find(col => col.id === activeId) || null;
  }, [activeId, activeType, quadro]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // O dnd-kit gerencia automaticamente a visualização
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);

    if (!over || !quadro || active.id === over.id) return;

    // Mover CARD
    if (activeType === 'card') {
      const cardId = active.id as string;
      const sourceColumn = quadro.colunas.find(col =>
        col.cards.some(c => c.id === cardId)
      );

      if (!sourceColumn) return;

      const sortedSourceCards = [...sourceColumn.cards].sort(
        (a, b) => b.ordem - a.ordem
      );
      const sourceIndex = sortedSourceCards.findIndex(c => c.id === cardId);

      // Verifica se over é coluna
      const isOverColumn = columnIds.includes(over.id as string);

      if (isOverColumn) {
        const targetColumn = quadro.colunas.find(col => col.id === over.id);
        if (!targetColumn || sourceColumn.id === targetColumn.id) return;

        const targetIndex = targetColumn.cards.length;

        try {
          await moveCardContext(cardId, sourceColumn.id, targetColumn.id, targetIndex);
        } catch (error) {
          console.log('Erro ao mover card:', error);
        }
      } else {
        // over é outro card
        const targetColumn = quadro.colunas.find(col =>
          col.cards.some(c => c.id === over.id)
        );

        if (!targetColumn) return;

        const sortedTargetCards = [...targetColumn.cards].sort(
          (a, b) => b.ordem - a.ordem
        );
        const targetCardIndex = sortedTargetCards.findIndex(c => c.id === over.id);

        if (sourceColumn.id === targetColumn.id) {
          const newCards = arrayMove(sortedSourceCards, sourceIndex, targetCardIndex);
          const finalPosition = newCards.findIndex(c => c.id === cardId);

          try {
            await moveCardContext(cardId, sourceColumn.id, targetColumn.id, finalPosition);
          } catch (error) {
            console.log('Erro ao mover card:', error);
          }
        } else {
          try {
            await moveCardContext(cardId, sourceColumn.id, targetColumn.id, targetCardIndex);
          } catch (error) {
            console.log('Erro ao mover card:', error);
          }
        }
      }
    }
    // Mover COLUNA
    else if (activeType === 'column') {
      const sortedColumns = [...quadro.colunas].sort((a, b) => a.ordem - b.ordem);
      
      const oldIndex = sortedColumns.findIndex(c => c.id === active.id);
      const newIndex = sortedColumns.findIndex(c => c.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      try {
        await moveColumnContext(active.id as string, newIndex);
      } catch (error) {
        console.log('Erro ao mover coluna:', error);
      }
    }
  }, [quadro, columnIds, moveCardContext, moveColumnContext, activeType]);

  // Colunas ordenadas
  const sortedColumns = useMemo(() => {
    if (!quadro) return [];
    return [...quadro.colunas].sort((a, b) => a.ordem - b.ordem);
  }, [quadro]);

  if (loading || !quadro) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando quadro...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full overflow-x-auto">
        <div className="flex gap-4 py-4 min-w-min">
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {sortedColumns.map((column) => {
              const cardIds = getColumnCardIds(column.id);
              
              return (
                <ColumnWrapper
                  key={column.id}
                  columnId={column.id}
                  cardIds={cardIds}
                  column={column}
                >
                  <KanbanColumn
                    column={column}
                    onAddCard={onAddCard}
                    onEditCard={onEditCard}
                    onDeleteCard={onDeleteCard}
                    onCardClick={onCardClick}
                    onEditColumn={onEditColumn}
                    renderVinculos={renderVinculos}
                    canAddCard={canAddCard}
                    isLoading={loading}
                    isItemAnimating={isItemAnimating}
                    isCreatingCard={creatingCardColumnId === column.id}
                    onCardCreated={onCardCreated}
                    onCancelCreateCard={onCancelCreateCard}
                  />
                </ColumnWrapper>
              );
            })}
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="opacity-90">
            <KanbanCard
              card={activeCard}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onClick={onCardClick}
              renderVinculos={renderVinculos}
            />
          </div>
        )}
        {activeColumn && (
          <div 
            className="opacity-95"
            style={{
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
              transform: 'rotate(2deg)',
            }}
          >
            <KanbanColumn
              column={activeColumn}
              onAddCard={onAddCard}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onCardClick={onCardClick}
              renderVinculos={renderVinculos}
              canAddCard={canAddCard}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
