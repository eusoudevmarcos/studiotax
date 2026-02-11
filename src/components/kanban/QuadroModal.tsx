import {
  QuadroKanbanInput,
  quadroKanbanInputSchema,
} from '@/schemas/kanban.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

interface QuadroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuadroKanbanInput) => Promise<void>;
  espacoTrabalhoId: string;
  initialValues?: QuadroKanbanInput;
  title?: string;
  quadroId?: string;
  onDelete?: (id: string) => Promise<void>;
}

export const QuadroModal: React.FC<QuadroModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  espacoTrabalhoId,
  initialValues,
  title = 'Novo Quadro',
  quadroId,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuadroKanbanInput>({
    resolver: zodResolver(quadroKanbanInputSchema),
    defaultValues: initialValues
      ? {
          titulo: initialValues.titulo,
          espacoTrabalhoId: initialValues.espacoTrabalhoId,
        }
      : {
          espacoTrabalhoId,
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(
        initialValues
          ? {
              titulo: initialValues.titulo,
              espacoTrabalhoId: initialValues.espacoTrabalhoId,
            }
          : {
              espacoTrabalhoId,
            }
      );
    }
  }, [isOpen, initialValues, espacoTrabalhoId, reset]);

  const onSubmitForm = async (data: QuadroKanbanInput) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.log('Erro ao salvar quadro:', error);
    }
  };

  const handleDelete = async () => {
    if (!quadroId || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(quadroId);
    } catch (error) {
      console.log('Erro ao deletar quadro:', error);
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
          {quadroId && onDelete && (
            <PrimaryButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons inline-block mr-2" style={{ fontSize: 18 }}>
                delete
              </span>
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
