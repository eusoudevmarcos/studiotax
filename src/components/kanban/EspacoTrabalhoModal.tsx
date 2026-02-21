import {
  EspacoTrabalhoInput,
  espacoTrabalhoInputSchema,
} from "@/schemas/kanban.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../button/PrimaryButton";
import { FormInput } from "../input/FormInput";
import Modal from "../modal/Modal";
import { useEspacoTrabalho } from "@/context/EspacoTrabalhoContext";

interface EspacoTrabalhoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EspacoTrabalhoInput) => Promise<void>;
  initialValues?: EspacoTrabalhoInput;
  title?: string;
  espacoId?: string;
  onDelete?: (id: string) => Promise<void>;
}

export const EspacoTrabalhoModal: React.FC<EspacoTrabalhoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = "Novo Espaço de Trabalho",
  espacoId,
  onDelete,
}) => {
  const { atualizarEspaco } = useEspacoTrabalho();

  const [isDeleting, setIsDeleting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EspacoTrabalhoInput>({
    resolver: zodResolver(espacoTrabalhoInputSchema),
    defaultValues: initialValues || { nome: "" },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialValues || { nome: "" });
    }
  }, [isOpen, initialValues, reset]);

  const onSubmitForm = async (data: EspacoTrabalhoInput) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.log("Erro ao salvar espaço de trabalho:", error);
    }
  };

  const handleDelete = async () => {
    if (!espacoId || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(espacoId);
    } catch (error) {
      console.log("Erro ao deletar espaço de trabalho:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2">
        <FormInput
          label="Titulo"
          name="nome"
          control={control}
          errors={errors}
        />
        <div className="flex justify-end gap-2 pt-4">
          {espacoId && onDelete && (
            <PrimaryButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="bg-red-500! hover:bg-red-600! text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
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
          <PrimaryButton type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
