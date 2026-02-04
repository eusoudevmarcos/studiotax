import { criarCardKanban } from '@/axios/kanban.axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { CardKanbanInput } from '@/schemas/kanban.schema';
import React, { useEffect, useRef, useState } from 'react';

interface CreateCardInlineProps {
  columnId: string;
  onSave: () => void;
  onCancel: () => void;
  onError?: (error: any) => void;
}

export const CreateCardInline: React.FC<CreateCardInlineProps> = ({
  columnId,
  onSave,
  onCancel,
  onError,
}) => {
  const [titulo, setTitulo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus no input quando o componente é montado
    inputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!titulo.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      const cardData: CardKanbanInput = {
        titulo: titulo.trim(),
        colunaKanbanId: columnId,
      };
      await criarCardKanban(cardData);
      setTitulo('');
      onSave();
    } catch (error) {
      console.log('Erro ao criar card:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitulo('');
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="px-3 py-2 bg-white rounded-xl relative border border-gray-200 mb-2 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite o título do card..."
        className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
        disabled={isSaving}
      />
      <div className="flex gap-2 justify-end">
        <PrimaryButton
          variant="secondary"
          onClick={handleCancel}
          disabled={isSaving}
          type="button"
        >
          Cancelar
        </PrimaryButton>
        <PrimaryButton
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={!titulo.trim() || isSaving}
          type="button"
        >
          Salvar
        </PrimaryButton>
      </div>
    </div>
  );
};
