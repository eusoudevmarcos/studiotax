import {
  CardKanban,
  CardKanbanInput,
  cardKanbanInputSchema,
} from '@/schemas/kanban.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CardKanbanInput) => Promise<void>;
  initialValues?: CardKanban;
  columnId: string;
  title?: string;
  onDelete?: (id: string) => Promise<void>;
}

export const CardFormModal: React.FC<CardFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  columnId,
  title = 'Novo Card',
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CardKanbanInput>({
    resolver: zodResolver(cardKanbanInputSchema),
    defaultValues: initialValues
      ? {
          titulo: initialValues.titulo,
          descricao: initialValues.descricao || '',
          colunaKanbanId: initialValues.colunaKanbanId,
        }
      : {
          colunaKanbanId: columnId,
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(
        initialValues
          ? {
              titulo: initialValues.titulo,
              descricao: initialValues.descricao || '',
              colunaKanbanId: initialValues.colunaKanbanId,
            }
          : {
              colunaKanbanId: columnId,
            }
      );
    } else {
      // Limpar formulário quando o modal fechar
      reset({
        colunaKanbanId: columnId,
      });
    }
  }, [isOpen, initialValues, columnId, reset]);

  const onSubmitForm = async (data: CardKanbanInput) => {
    try {
      await onSubmit(data);
      reset();
      // Fechar o modal após sucesso
      onClose();
    } catch (error) {
      console.log('Erro ao salvar card:', error);
      // Em caso de erro, não fechar o modal para o usuário poder tentar novamente
      throw error; // Re-lançar o erro para o react-hook-form tratar
    }
  };

  const handleDelete = async () => {
    if (!initialValues || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(initialValues.id);
    } catch (error) {
      console.log('Erro ao deletar card:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <FormInput
          label="Título"
          name="titulo"
          control={control}
          errors={errors}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <Controller
            control={control}
            name="descricao"
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite a descrição do card..."
              />
            )}
          />
          {errors.descricao && (
            <p className="mt-1 text-sm text-red-600">
              {errors.descricao.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {initialValues && onDelete && (
            <PrimaryButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons inline-block mr-2">delete</span>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </PrimaryButton>
          )}
          <PrimaryButton
            type="button"
            onClick={onClose}
            disabled={isDeleting || isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
