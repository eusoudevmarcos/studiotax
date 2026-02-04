// src/components/Modal.tsx
import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  backdropClose?: boolean;
  fit?: boolean;
  classNameBody?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  backdropClose = false,
  fit = false,
  classNameBody,
}) => {
  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) onClose(false);
    setShow(false);
    timeoutRef.current = setTimeout(() => setShow(false), 200);
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // e.preventDefault();
    // e.stopPropagation();
    // if (containerRef.current) {
    //   containerRef.current.style.transition =
    //     'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
    //   containerRef.current.style.transform = 'scale(1.02)';
    //   setTimeout(() => {
    //     if (containerRef.current) {
    //       containerRef.current.style.transform = 'scale(1)';
    //       // setTimeout(() => {
    //       //   handleClose();
    //       // }, 300);
    //     }
    //   }, 150);
    // }
    // if (backdropClose && modalRef.current && e.target === e.currentTarget) {
    //   // Animação de scale no containerRef
    //   if (containerRef.current) {
    //     handleClose();
    //   }
    // }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-2 transition-opacity duration-200 bg-[#00000020] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={containerRef}
        className={`bg-white shadow-md relative rounded-2xl transition-transform duration-200
          ${!fit && 'w-full max-w-4xl'}
          ${visible ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center px-6 py-3  text-white bg-primary gap-4 rounded-t-2xl">
          {title && <h3 className="text-xl font-semibold ">{title}</h3>}
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-700 text-2xl font-bold ml-auto cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div
          className={`px-4 py-2 overflow-auto h-full max-h-[84vh] ${classNameBody}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
