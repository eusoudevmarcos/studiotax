import { useKanban } from '@/context/KanbanContext';
import { CardKanban, VinculoCard } from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Utilitário para Material Icons (icones do Google Font)
const MaterialIcon = ({
  name,
  className = '',
  style = {},
  ...rest
}: React.HTMLAttributes<HTMLElement> & { name: string }) => (
  <span
    className={`material-icons ${className}`}
    style={{ fontSize: '1em', verticalAlign: 'middle', ...style }}
    {...rest}
  >
    {name}
  </span>
);

interface KanbanCardProps {
  card: CardKanban;
  onEdit?: (card: CardKanban) => void;
  onDuplicate?: (card: CardKanban) => void;
  onDelete?: (card: CardKanban) => void;
  onClick?: (card: CardKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  isItemAnimating?: (itemId: string) => boolean;
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({
  card,
  onEdit,
  onDuplicate,
  onDelete,
  onClick,
  renderVinculos,
  isItemAnimating,
}) => {
  const { toggleCardChecklistCompleto } = useKanban();
  const [localChecklistCompleto, setLocalChecklistCompleto] = React.useState<boolean>(
    card.checklistCompleto || false
  );

  // Sincronizar estado local quando o card prop mudar
  React.useEffect(() => {
    setLocalChecklistCompleto(card.checklistCompleto || false);
  }, [card.checklistCompleto]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    if (onEdit) {
      onEdit(card);
    }
  };

  const handleDuplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDuplicate) {
      onDuplicate(card);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete(card);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // impede o menu padrão do navegador
    setShowMenu(true);
  };

  const vinculos = card.vinculos || [];
  const isAnimating = isItemAnimating ? isItemAnimating(card.id) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-pointer hover:shadow-sm border hover:border-black transition-all duration-500 ease-out px-3 py-2 rounded-xl relative mb-2 ${localChecklistCompleto
        ? 'bg-green-50 border-green-400'
        : 'bg-white border-gray-300'
        } ${isAnimating ? 'delete-animating' : ''}`}
      onClick={() => onClick?.(card)}
      onContextMenu={handleContextMenu}
    >
      {/* Menu de ações */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-10">
          <button
            ref={btnRef}
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            onMouseDown={e => e.stopPropagation()}
          >
            <MaterialIcon name="more_vert" className="w-4 h-4 text-gray-600" />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20"
              onMouseDown={e => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                >
                  Editar
                </button>
              )}

              {onDuplicate && (
                <button
                  onClick={handleDuplate}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                >
                  Duplicar
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

      <div className="flex items-center gap-2 mb-2 pr-10">
        <input
          type="checkbox"
          checked={localChecklistCompleto}
          onChange={async (e) => {
            e.stopPropagation();
            const novoEstado = !localChecklistCompleto;
            setLocalChecklistCompleto(novoEstado);
            try {
              await toggleCardChecklistCompleto(card.id, novoEstado);
            } catch (error) {
              setLocalChecklistCompleto(!novoEstado);
              console.log('Erro ao atualizar status do card:', error);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className={`h-4 w-4 cursor-pointer rounded shrink-0 focus:ring-2 focus:ring-green-500 ${localChecklistCompleto
            ? 'border-green-500 text-green-600'
            : 'border-gray-300 text-green-600'
            }`}
        />
        <h3 className="font-semibold text-gray-800 flex-1 break-words">
          {card.titulo}
        </h3>
      </div>

      {/* Indicadores visuais: apenas data de entrega e criador */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {/* Data de entrega */}
        {card.datas?.dataEntrega && (() => {
          const dataEntrega = new Date(card.datas.dataEntrega);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          dataEntrega.setHours(0, 0, 0, 0);
          const isAtrasado = dataEntrega < hoje;
          return (
            <span
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${isAtrasado
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
                }`}
              title={`Data de entrega: ${dataEntrega.toLocaleDateString('pt-BR')}`}
            >
              <MaterialIcon name="calendar_today" className="h-3 w-3" />
              {dataEntrega.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          );
        })()}

        {/* Criador do card */}
        {card.usuarioSistema && (
          <span
            className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
            title={`Criado por: ${getUsuarioNome(card.usuarioSistema)}`}
          >
            <MaterialIcon name="person" className="h-3 w-3" />
            <span className="truncate max-w-[100px]">
              {getUsuarioNome(card.usuarioSistema)}
            </span>
          </span>
        )}
      </div>

      {card.descricao && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {card.descricao}
        </p>
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

export const KanbanCard = React.memo<KanbanCardProps>(
  KanbanCardComponent,
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.card.titulo === nextProps.card.titulo &&
      prevProps.card.descricao === nextProps.card.descricao &&
      prevProps.card.vinculos?.length === nextProps.card.vinculos?.length &&
      prevProps.card.datas?.dataEntrega === nextProps.card.datas?.dataEntrega &&
      prevProps.card.usuarioSistemaId === nextProps.card.usuarioSistemaId &&
      prevProps.card.checklistCompleto === nextProps.card.checklistCompleto
    );
  }
);
