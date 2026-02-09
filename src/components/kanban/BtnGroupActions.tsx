import React, { useEffect, useRef, useState } from 'react';

type BtnGroupActionsProps = {
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const BtnGroupActions: React.FC<BtnGroupActionsProps> = ({
  onDuplicate,
  onEdit,
  onDelete,
}) => {
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
      onDuplicate();
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="absolute right-2 top-2 flex gap-2 z-2">
      <button
        ref={btnRef}
        type="button"
        title="Opções"
        className="hover:bg-white text-gray-600 p-1 transition flex items-center justify-center"
        onClick={() => setShowMenu(v => !v)}
      >
        <span className="material-icons text-[16px]!">more_vert</span>
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0  w-28 bg-white border border-gray-200 rounded shadow-lg flex flex-col animate-fadeIn z-9999"
          style={{ zIndex: 20, top: '20px' }}
        >
          <button
            title="Duplicar"
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-gray-100 text-gray-600 transition bg-white border-0"
            onClick={handleDuplicate}
          >
            <span className="material-icons text-[12px]!">copy_all</span>
            Duplicar
          </button>
          <button
            title="Editar"
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-blue-100 text-blue-600 transition bg-white border-0"
            onClick={handleEdit}
          >
            <span className="material-icons text-[12px]!">edit</span>
            Editar
          </button>
          <button
            title="Deletar"
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-red-100 text-red-600 transition bg-white border-0"
            onClick={handleDelete}
          >
            <span className="material-icons text-[12px]!">delete</span>
            Deletar
          </button>
        </div>
      )}
    </div>
  );
};

export default BtnGroupActions;
