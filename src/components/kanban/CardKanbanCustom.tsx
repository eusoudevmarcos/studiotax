import { CardKanban, VinculoCard } from '@/schemas/kanban.schema';
import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';

interface CardKanbanCustomProps {
  id?: string;
  title?: string;
  description?: string;
  label?: string;
  metadata?: {
    colunaKanbanId?: string;
    ordem?: number;
    vinculos?: VinculoCard[];
  };
  data?: {
    id: string;
    title: string;
    description?: string;
    label?: string;
    metadata?: {
      colunaKanbanId?: string;
      ordem?: number;
      vinculos?: VinculoCard[];
    };
  };
  onEdit?: (card: CardKanban) => void;
  onDelete?: (card: CardKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  onClick?: () => void;
}

export const CardKanbanCustom: React.FC<CardKanbanCustomProps> = ({
  id,
  title,
  description,
  label,
  metadata,
  data,
  onEdit,
  onDelete,
  renderVinculos,
  onClick,
}) => {
  // react-trello pode passar props diretamente ou via data
  const cardId = id || data?.id || '';
  const cardTitle = title || data?.title || '';
  const cardDescription = description || data?.description;
  const cardLabel = label || data?.label;
  const cardMetadata = metadata || data?.metadata;
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit && cardMetadata) {
      const card: CardKanban = {
        id: cardId,
        titulo: cardTitle,
        descricao: cardDescription || null,
        ordem: cardMetadata.ordem || 0,
        colunaKanbanId: cardMetadata.colunaKanbanId || '',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        vinculos: cardMetadata.vinculos || [],
      };
      onEdit(card);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete && cardMetadata) {
      const card: CardKanban = {
        id: cardId,
        titulo: cardTitle,
        descricao: cardDescription || null,
        ordem: cardMetadata.ordem || 0,
        colunaKanbanId: cardMetadata.colunaKanbanId || '',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        vinculos: cardMetadata.vinculos || [],
      };
      onDelete(card);
    }
  };

  const vinculos = cardMetadata?.vinculos || [];

  return (
    <div
      className="cursor-pointer hover:shadow-md transition-shadow p-3 bg-white rounded-md relative border border-gray-200"
      onClick={onClick}
      style={{ userSelect: 'none' }}
    >
      {/* Menu de ações */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2">
          <button
            ref={btnRef}
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FiMoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
            >
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 rounded-b-md"
                >
                  Excluir
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <h3 className="font-semibold text-gray-800 mb-2 pr-8">{cardTitle}</h3>

      {cardDescription && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{cardDescription}</p>
      )}

      {cardLabel && (
        <div className="text-xs text-gray-500 mb-2 bg-gray-100 px-2 py-1 rounded inline-block">
          {cardLabel}
        </div>
      )}

      {/* Vínculos */}
      {vinculos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {renderVinculos
            ? renderVinculos(vinculos)
            : vinculos.map(vinculo => (
                <span
                  key={vinculo.id}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {vinculo.tipoEntidade}
                </span>
              ))}
        </div>
      )}
    </div>
  );
};
