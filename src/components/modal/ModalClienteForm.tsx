import React from 'react';
import ClienteForm from '../form/ClienteForm';
import Modal from './Modal';
import ModalSuccess from './ModalSuccess';

type ModalClienteFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: (cliente: any) => void;
};

const ModalClienteForm: React.FC<ModalClienteFormProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const [step, setStep] = React.useState<'form' | 'success'>('form');

  React.useEffect(() => {
    if (isOpen) {
      setStep('form');
    }
  }, [isOpen]);

  const handleCloseAll = () => {
    setStep('form');
    onClose?.();
  };

  const isEdit = !!initialValues?.id;
  const title = isEdit ? 'Editar Cliente' : 'Cadastrar Cliente';
  const successMessage = isEdit
    ? 'Cliente editado com sucesso!'
    : 'Cliente cadastrado com sucesso!';

  return (
    <>
      <Modal
        isOpen={isOpen && step === 'form'}
        onClose={handleCloseAll}
        title={title}
      >
        <ClienteForm
          initialValues={initialValues}
          onSuccess={cliente => {
            onSuccess?.(cliente);
            setStep('success');
          }}
        />
      </Modal>

      <ModalSuccess
        isOpen={isOpen && step === 'success'}
        onClose={handleCloseAll}
        message={successMessage}
      />
    </>
  );
};

export default ModalClienteForm;
