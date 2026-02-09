import { useState } from 'react';
import Modal from './Modal';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  onClickConfirm?: () => void;
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  onClickConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <span className="material-icons-outlined text-red-500 text-[100px]!">
          delete_forever
        </span>
        <h3 className="text-xl font-semibold text-red-800 ">
          Tem certeza que deseja deletar a vaga?
        </h3>

        <p className="text-amber-500">Essa ação não podera mais ser desfeita</p>
        <div className="flex gap-2">
          <button
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={e => {
              if (onClickConfirm) onClickConfirm();
              setLoading(prev => !prev);
            }}
            disabled={loading}
          >
            CONFIRMAR
          </button>
          <button
            className="mt-6 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            FECHAR
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSuccess;
