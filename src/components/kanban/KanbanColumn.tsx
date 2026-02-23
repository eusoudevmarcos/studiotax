import { CardKanban, ColunaKanban, VinculoCard } from '@/schemas/kanban.schema';
import { useDroppable } from '@dnd-kit/core';
import React, { useMemo } from 'react';
import { CreateCardInline } from './CreateCardInline';
import { KanbanCard } from './KanbanCard';

interface ColunaComCards extends ColunaKanban {
  cards: CardKanban[];
}

interface KanbanColumnProps {
  column: ColunaComCards;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: CardKanban) => void;
  onDuplicateCard?: (card: CardKanban) => void;
  onDeleteCard?: (card: CardKanban) => void;
  onCardClick?: (card: CardKanban) => void;
  onEditColumn?: (column: ColunaKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  canAddCard?: boolean;
  isLoading?: boolean;
  isItemAnimating?: (itemId: string) => boolean;
  isCreatingCard?: boolean;
  onCardCreated?: () => void;
  onCancelCreateCard?: () => void;
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDuplicateCard,
  onDeleteCard,
  onCardClick,
  onEditColumn,
  renderVinculos,
  canAddCard = true,
  isLoading = false,
  isItemAnimating,
  isCreatingCard = false,
  onCardCreated,
  onCancelCreateCard,
}) => {
  // Removido useSortable daqui - agora está no wrapper do KanbanBoard
  // Mantemos apenas useDroppable para cards
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    opacity: 1,
    backgroundColor: isOver ? '#f3f4f6' : undefined,
  };

  const sortedCards = useMemo(
    () => [...(column.cards || [])].sort((a, b) => b.ordem - a.ordem), // Ordenação descendente: maior ordem primeiro (último adicionado no topo)
    [column.cards]
  );
  const isAnimating = useMemo(
    () => (isItemAnimating ? isItemAnimating(column.id) : false),
    [isItemAnimating, column.id]
  );

  return (
    <div
      ref={setDroppableRef}
      style={style}
      className={`bg-gray-50 rounded-xl min-w-[320px] max-w-[320px] max-h-[60vh] flex flex-col transition-all duration-300 ease-in ${isAnimating ? 'delete-animating' : ''
        }`}
    >
      {/* Header - drag é gerenciado pelo wrapper */}
      <div className="flex items-center px-4 py-2 justify-between border-b border-gray-300 cursor-grab">
        <div

          className="flex items-center justify-between flex-1  active:cursor-grabbing "
        >
          <h2 className="font-semibold text-gray-800 text-lg">
            {column.titulo}
          </h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {sortedCards.length}
          </span>
        </div>


        {onEditColumn && (
          <button
            onClick={e => {
              e.stopPropagation();
              onEditColumn(column);
            }}
            disabled={isLoading}
            className="ml-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar coluna"
            onMouseDown={e => e.stopPropagation()}
          >
            <span className="material-icons w-4 h-4 align-middle">edit</span>
          </button>
        )}
      </div>




      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[60vh] px-2 py-2">
        {sortedCards.map(card => (
          <KanbanCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDuplicate={onDuplicateCard}
            onDelete={onDeleteCard}
            onClick={onCardClick}
            renderVinculos={renderVinculos}
            isItemAnimating={isItemAnimating}
          />
        ))}
        {/* Card de criação inline */}
        {isCreatingCard && onCardCreated && onCancelCreateCard && (
          <CreateCardInline
            columnId={column.id}
            onSave={onCardCreated}
            onCancel={onCancelCreateCard}
          />
        )}
      </div>

      {/* Botão adicionar card */}
      {canAddCard && onAddCard && !isCreatingCard && (
        <div className="px-2 py-2">
          <button
            onClick={() => onAddCard(column.id)}
            className="w-full text-primary hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            + Adicionar Card
          </button>
        </div>
      )}

    </div>
  );
};

export const KanbanColumn = React.memo<KanbanColumnProps>(
  KanbanColumnComponent,
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    // Verificar se a ordem dos cards mudou
    const prevCardIds = prevProps.column.cards.map(c => c.id).join(',');
    const nextCardIds = nextProps.column.cards.map(c => c.id).join(',');
    const prevCardOrders = prevProps.column.cards.map(c => c.ordem).join(',');
    const nextCardOrders = nextProps.column.cards.map(c => c.ordem).join(',');
    
    return (
      prevProps.column.id === nextProps.column.id &&
      prevProps.column.cards.length === nextProps.column.cards.length &&
      prevCardIds === nextCardIds &&
      prevCardOrders === nextCardOrders &&
      prevProps.column.titulo === nextProps.column.titulo &&
      prevProps.canAddCard === nextProps.canAddCard &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isCreatingCard === nextProps.isCreatingCard
    );
  }
);
