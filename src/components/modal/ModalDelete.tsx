import { useEffect, useState } from 'react';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  isLoading?: boolean;
  btn?: {
    next?: {
      label: React.ReactNode;
      onClick: () => void;
    };
  };
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  message,
  isLoading = false,
  btn,
}) => {
  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[60] p-2 transition-opacity duration-200 bg-[#00000040] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white shadow-md relative rounded-2xl transition-transform duration-200 w-full max-w-md ${
          visible ? 'scale-100' : 'scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-3 text-white bg-primary gap-4 rounded-t-2xl">
          {message && <h3 className="text-xl font-semibold">{message}</h3>}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-700 text-2xl font-bold ml-auto cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="px-4 py-2 overflow-auto h-full max-h-[84vh]">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="material-icons-outlined text-[100px]! text-red-500">
              delete_forever
            </span>

            <div className="flex gap-2">
              {btn?.next && (
                <button
                  className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={btn?.next?.onClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'Excluindo...' : btn?.next?.label}
                </button>
              )}
              <button
                className="mt-6 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isLoading}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSuccess;
