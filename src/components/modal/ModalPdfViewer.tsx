// src/components/modal/ModalPdfViewer.tsx
import api from '@/axios';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

interface ModalPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const ModalPdfViewer: React.FC<ModalPdfViewerProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');

  useEffect(() => {
    let currentBlobUrl = '';

    if (isOpen && fileUrl) {
      // Buscar o PDF como blob para exibir no iframe
      api
        .get(fileUrl, {
          responseType: 'blob',
        })
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          currentBlobUrl = url;
          setPdfBlobUrl(url);
        })
        .catch(error => {
          console.log('Erro ao carregar PDF:', error);
          alert('Erro ao carregar o arquivo PDF');
        });
    }

    // Cleanup quando o modal fechar ou URL mudar
    return () => {
      if (currentBlobUrl) {
        window.URL.revokeObjectURL(currentBlobUrl);
      }
      // Também limpar o estado anterior se existir
      setPdfBlobUrl(prev => {
        if (prev) {
          window.URL.revokeObjectURL(prev);
        }
        return '';
      });
    };
  }, [isOpen, fileUrl]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fileName}
      fit={false}
      classNameBody="p-0! h-screen!"
    >
      <div className="w-full h-full">
        {pdfBlobUrl ? (
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={fileName}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando PDF...</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalPdfViewer;
