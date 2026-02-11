import {
  ColunaKanban,
  ColunaKanbanInput,
  colunaKanbanInputSchema,
} from '@/schemas/kanban.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

interface ColunaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ColunaKanbanInput) => Promise<void>;
  quadroKanbanId: string;
  initialValues?: ColunaKanban;
  title?: string;
  onDelete?: (id: string) => Promise<void>;
}

export const ColunaFormModal: React.FC<ColunaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  quadroKanbanId,
  initialValues,
  title = 'Nova Coluna',
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ColunaKanbanInput>({
    resolver: zodResolver(colunaKanbanInputSchema),
    defaultValues: initialValues
      ? {
          titulo: initialValues.titulo,
          quadroKanbanId: initialValues.quadroKanbanId,
        }
      : {
          quadroKanbanId,
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(
        initialValues
          ? {
              titulo: initialValues.titulo,
              quadroKanbanId: initialValues.quadroKanbanId,
            }
          : {
              quadroKanbanId,
            }
      );
    }
  }, [isOpen, initialValues, quadroKanbanId, reset]);

  const onSubmitForm = async (data: ColunaKanbanInput) => {
    try {
      await onSubmit(data);
      reset();
      if (onClose) onClose();
    } catch (error) {
      console.log('Erro ao salvar coluna:', error);
    }
  };

  const handleDelete = async () => {
    if (!initialValues || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(initialValues.id);
    } catch (error) {
      console.log('Erro ao deletar coluna:', error);
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
        <div className="flex justify-end gap-2 pt-4">
          {initialValues && onDelete && (
            <PrimaryButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-black disabled:opacity-50 disabled:cursor-not-allowed"
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
