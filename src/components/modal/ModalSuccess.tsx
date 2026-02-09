import Modal from './Modal';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <span className="material-icons text-[200px]! text-green-500">
          check_circle
        </span>
        <h3 className="text-xl font-semibold text-gray-800 ">Sucesso!</h3>
        <p className="text-gray-600 text-lg">{message}</p>
        <button
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default ModalSuccess;
