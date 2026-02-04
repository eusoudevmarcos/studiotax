import { PrimaryButton } from '@/components/button/PrimaryButton';
import { PlusIcon } from '@/components/icons';
import { EspacoTrabalhoModal } from '@/components/kanban/EspacoTrabalhoModal';
import { QuadroModal } from '@/components/kanban/QuadroModal';
import ModalDelete from '@/components/modal/ModalDelete';
import { useEspacoTrabalho } from '@/context/EspacoTrabalhoContext';
import { QuadroKanban, QuadroKanbanInput } from '@/schemas/kanban.schema';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface EspacoTrabalhoDetailProps {
  espacoId: string;
}

export const EspacoTrabalhoDetail: React.FC<EspacoTrabalhoDetailProps> = ({
  espacoId,
}) => {
  const router = useRouter();
  const {
    espacoTrabalhoAtual,
    loading,
    atualizarEspaco,
    deletarEspaco,
    criarQuadro,
    atualizarQuadro,
    deletarQuadro,
    isItemAnimating,
  } = useEspacoTrabalho();

  const [showQuadroModal, setShowQuadroModal] = useState(false);
  const [showEspacoModal, setShowEspacoModal] = useState(false);
  const [showDeleteQuadroModal, setShowDeleteQuadroModal] = useState(false);
  const [showDeleteEspacoModal, setShowDeleteEspacoModal] = useState(false);
  const [selectedQuadro, setSelectedQuadro] = useState<QuadroKanban | null>(
    null
  );
  const [quadroToDelete, setQuadroToDelete] = useState<QuadroKanban | null>(
    null
  );
  const [isSavingQuadro, setIsSavingQuadro] = useState(false);
  const [isDeletingQuadro, setIsDeletingQuadro] = useState(false);
  const [isSavingEspaco, setIsSavingEspaco] = useState(false);
  const [isDeletingEspaco, setIsDeletingEspaco] = useState(false);

  const handleQuadroClick = (quadro: QuadroKanban) => {
    router.push(`/kanban/espaco/${espacoId}/quadro/${quadro.id}`);
  };

  const handleCreateQuadro = () => {
    setSelectedQuadro(null);
    setShowQuadroModal(true);
  };

  const handleEditQuadro = (quadro: QuadroKanban) => {
    setSelectedQuadro(quadro);
    setShowQuadroModal(true);
  };

  const handleSaveQuadro = async (data: QuadroKanbanInput) => {
    try {
      setIsSavingQuadro(true);
      if (selectedQuadro) {
        await atualizarQuadro(selectedQuadro.id, data);
        setShowQuadroModal(false);
        setSelectedQuadro(null);
      } else {
        const novoQuadro = await criarQuadro(data);
        router.push(`/kanban/espaco/${espacoId}/quadro/${novoQuadro.id}`);
      }
    } catch (error) {
      console.log('Erro ao salvar quadro:', error);
      throw error;
    } finally {
      setIsSavingQuadro(false);
    }
  };

  const handleDeleteQuadroClick = async (quadroId: string) => {
    const quadro = selectedQuadro;
    if (quadro && quadro.id === quadroId) {
      setQuadroToDelete(quadro);
      setShowDeleteQuadroModal(true);
    }
  };

  const handleConfirmDeleteQuadro = async () => {
    if (!quadroToDelete) return;
    setShowDeleteQuadroModal(false);
    setShowQuadroModal(false);

    try {
      setIsDeletingQuadro(true);
      await deletarQuadro(quadroToDelete.id);
      setQuadroToDelete(null);
      setSelectedQuadro(null);
    } catch (error) {
      console.log('Erro ao deletar quadro:', error);
    } finally {
      setIsDeletingQuadro(false);
    }
  };

  const handleEditEspaco = () => {
    setShowEspacoModal(true);
  };

  const handleSaveEspaco = async (data: { nome: string }) => {
    try {
      setIsSavingEspaco(true);
      await atualizarEspaco(espacoId, data);
      setShowEspacoModal(false);
    } catch (error) {
      console.log('Erro ao atualizar espaço de trabalho:', error);
      throw error;
    } finally {
      setIsSavingEspaco(false);
    }
  };

  const handleDeleteEspacoClick = async (id: string) => {
    if (espacoId === id) {
      setShowDeleteEspacoModal(true);
    }
  };

  const handleConfirmDeleteEspaco = async () => {
    setShowDeleteEspacoModal(false);

    try {
      setIsDeletingEspaco(true);
      await deletarEspaco(espacoId);
      router.push('/kanban');
    } catch (error) {
      console.log('Erro ao deletar espaço de trabalho:', error);
    } finally {
      setIsDeletingEspaco(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando espaço de trabalho...</div>
      </div>
    );
  }

  if (!espacoTrabalhoAtual) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Espaço de trabalho não encontrado</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">
                  {espacoTrabalhoAtual.nome}
                </h1>

                <button
                  onClick={handleEditEspaco}
                  disabled={isSavingEspaco || isDeletingEspaco}
                  className="p-2 text-white hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Editar espaço de trabalho"
                >
                  <span className="material-icons w-5 h-5" style={{ fontSize: 20 }}>
                    edit
                  </span>
                </button>
              </div>

              <p className="text-sm text-white mt-1">
                {espacoTrabalhoAtual.quadros?.length ?? 0} quadro
                {espacoTrabalhoAtual.quadros?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <PrimaryButton variant='white' onClick={handleCreateQuadro}>
              <PlusIcon />
              Novo Quadro
            </PrimaryButton>
          </div>
        </div>

        {espacoTrabalhoAtual.quadros &&
          espacoTrabalhoAtual.quadros.length === 0 ? (
          <div className="text-center py-12 ">
            <p className="text-gray-500 mb-4">Nenhum quadro criado ainda.</p>
            {/* <PrimaryButton onClick={handleCreateQuadro}>
              <PlusIcon />
              Criar Primeiro Quadro
            </PrimaryButton> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {espacoTrabalhoAtual.quadros?.map(quadro => {
              const isAnimating = isItemAnimating(quadro.id);
              return (
                <div
                  key={quadro.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-2000 ease-out relative ${isAnimating ? 'delete-animating' : ''
                    }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleQuadroClick(quadro)}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {quadro.titulo}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Criado em{' '}
                      {new Date(quadro.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditQuadro(quadro);
                    }}
                    disabled={isSavingQuadro || isDeletingQuadro}
                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Editar quadro"
                  >
                    <span className="material-icons w-4 h-4" style={{ fontSize: 16 }}>
                      edit
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showQuadroModal && espacoTrabalhoAtual && (
        <QuadroModal
          isOpen={showQuadroModal}
          onClose={() => {
            setShowQuadroModal(false);
            setSelectedQuadro(null);
          }}
          onSubmit={handleSaveQuadro}
          espacoTrabalhoId={espacoTrabalhoAtual.id}
          initialValues={selectedQuadro || undefined}
          title={selectedQuadro ? 'Editar Quadro' : 'Novo Quadro'}
          quadroId={selectedQuadro?.id}
          onDelete={handleDeleteQuadroClick}
        />
      )}

      {showDeleteQuadroModal && quadroToDelete && (
        <ModalDelete
          isOpen={showDeleteQuadroModal}
          onClose={() => {
            setShowDeleteQuadroModal(false);
            setQuadroToDelete(null);
          }}
          isLoading={isDeletingQuadro}
          btn={{
            next: { label: 'Tem certeza?', onClick: handleConfirmDeleteQuadro },
          }}
          message={`Tem certeza que deseja excluir o quadro "${quadroToDelete.titulo}"?`}
        />
      )}

      {showEspacoModal && espacoTrabalhoAtual && (
        <EspacoTrabalhoModal
          isOpen={showEspacoModal}
          onClose={() => setShowEspacoModal(false)}
          onSubmit={handleSaveEspaco}
          initialValues={{ nome: espacoTrabalhoAtual.nome }}
          title="Editar Espaço de Trabalho"
          espacoId={espacoId}
          onDelete={handleDeleteEspacoClick}
        />
      )}

      {showDeleteEspacoModal && espacoTrabalhoAtual && (
        <ModalDelete
          isOpen={showDeleteEspacoModal}
          onClose={() => setShowDeleteEspacoModal(false)}
          isLoading={isDeletingEspaco}
          btn={{
            next: { label: 'Tem certeza?', onClick: handleConfirmDeleteEspaco },
          }}
          message={`Tem certeza que deseja excluir o espaço de trabalho "${espacoTrabalhoAtual.nome}"? Esta ação não pode ser desfeita e todos os quadros serão excluídos.`}
        />
      )}
    </>
  );
};
