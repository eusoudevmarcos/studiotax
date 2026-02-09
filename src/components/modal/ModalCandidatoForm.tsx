import React from 'react';
import CandidatoForm from '../form/CandidatoForm';
import Modal from './Modal';
import ModalSuccess from './ModalSuccess';

type ModalCandidatoFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: (candidato: any) => void;
};

const ModalCandidatoForm: React.FC<ModalCandidatoFormProps> = ({
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
  const title = isEdit ? 'Editar Profissional' : 'Cadastrar Profissional';
  const successMessage = isEdit
    ? 'Profissional editado com sucesso!'
    : 'Profissional cadastrado com sucesso!';

  return (
    <>
      <Modal
        isOpen={isOpen && step === 'form'}
        onClose={handleCloseAll}
        title={title}
      >
        <CandidatoForm
          initialValues={initialValues}
          onSuccess={candidato => {
            onSuccess?.(candidato);
            setStep('success');
          }}
          disableSuccessModal
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

export default ModalCandidatoForm;
