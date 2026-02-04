import Modal from '@/components/modal/Modal';
import VideoPlayer from '@/components/site/VideoPlayer/VideoPlayer';
import { useModal } from '@/hook/useModal';
import { useState } from 'react';
import { ModalPlansMedico } from './ModalPlansMedico';

type ModalVideoRMProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ModalVideoRM({ isOpen, onClose }: ModalVideoRMProps) {
  const [selectedPlan, setSelectedPlan] = useState<null | {
    name: string;
    price: string;
  }>(null);

  const {
    isOpen: isPlansModalOpen,
    openModal: openPlansModal,
    closeModal: closePlansModal,
  } = useModal();

  const {
    isOpen: isVideoModalOpen,
    openModal: openVideoModal,
    closeModal: closeVideoModal,
  } = useModal();

  const {
    isOpen: isModalPlans,
    openModal: openModalPlans,
    closeModal: closeModalPlans,
  } = useModal();

  const handleOpenPlansModal = () => {
    closeVideoModal();
    onClose();
    openModalPlans();
  };

  const handleCloseSelectedPlanModal = () => {
    closeModalPlans();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Plataforma Aura: Tour Completo"
        classNameBody="!p-0"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-full pb-[56.25%] mb-6">
            <div className="absolute top-0 left-0 w-full h-full p-4">
              <VideoPlayer
                src="https://www.youtube.com/watch?v=SUA_Link_Do_Seu_Video_Aqui"
                title="Vídeo Demonstrativo Plataforma Aura"
                width={560}
                height={315}
                autoplay={true}
                muted={true}
                controls={true}
              />
            </div>
          </div>

          <p className="text-center mb-8 text-secondary text-base px-4">
            Explore todos os recursos da nossa plataforma de recrutamento e veja
            como é fácil encontrar o Profissional perfeito.
          </p>

          <a
            onClick={e => {
              e.preventDefault();
              handleOpenPlansModal();
            }}
            href="#planos_medicos"
            className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-[1.1rem] no-underline mt-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 text-center border-0 my-4"
            style={{
              background: 'var(--primary-color)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--box-shadow-sm)',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                'var(--box-shadow-md)';
              (e.currentTarget as HTMLAnchorElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                'var(--primary-color)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                'var(--box-shadow-sm)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
            }}
          >
            Quero Contratar a Plataforma Agora!
          </a>
        </div>
      </Modal>

      <ModalPlansMedico
        isOpen={!!isModalPlans}
        onClose={handleCloseSelectedPlanModal}
      />
    </>
  );
}
