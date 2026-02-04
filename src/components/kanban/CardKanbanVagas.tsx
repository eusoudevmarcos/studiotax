import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import BtnGroupActions from './BtnGroupActions';

type TrelloCardProps = {
  id: string;
  title: string;
  label?: string;
  metadata?: any;
  onDuplicate?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const CardKanbanVagas: React.FC<TrelloCardProps> = ({
  id,
  title,
  label,
  metadata,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fecha o popup ao clicar fora
  useEffect(() => {
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

  const handleDuplicate = () => {
    setShowMenu(false);
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleCardClick = async () => {
    await router.push(`/vaga/${id}`);
  };

  return (
    <div
      className="cursor-pointer hover:shadow-sm transition-shadow p-3 bg-gray-100 rounded-md mb-2 relative"
      onClick={handleCardClick}
    >
      <BtnGroupActions
        onDuplicate={() => handleDuplicate()}
        onEdit={() => handleEdit()}
        onDelete={() => handleDelete()}
      />

      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>

      {label && <p className="text-xs text-gray-500 mb-2">{label}</p>}

      {metadata?.categoria && (
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mb-2">
          {metadata.categoria}
        </span>
      )}
    </div>
  );
};
