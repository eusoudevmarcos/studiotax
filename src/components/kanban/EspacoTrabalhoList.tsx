import { PrimaryButton } from '@/components/button/PrimaryButton';
import { PlusIcon } from '@/components/icons';
import { EspacoTrabalhoModal } from '@/components/kanban/EspacoTrabalhoModal';
import ModalDelete from '@/components/modal/ModalDelete';
import { useEspacoTrabalho } from '@/context/EspacoTrabalhoContext';
import { EspacoTrabalho } from '@/schemas/kanban.schema';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const EspacoTrabalhoList: React.FC = () => {
  const router = useRouter();
  const {
    espacosTrabalho,
    loading,
    criarEspaco,
    atualizarEspaco,
    deletarEspaco,
    isItemAnimating,
  } = useEspacoTrabalho();

  const [showEspacoModal, setShowEspacoModal] = useState(false);
  const [showDeleteEspacoModal, setShowDeleteEspacoModal] = useState(false);
  const [selectedEspaco, setSelectedEspaco] =
    useState<EspacoTrabalho | null>(null);
  const [isSavingEspaco, setIsSavingEspaco] = useState(false);
  const [isDeletingEspaco, setIsDeletingEspaco] = useState(false);

  const handleEspacoClick = (espacoId: string) => {
    router.push(`/kanban/espaco/${espacoId}`);
  };

  const handleCreateEspaco = () => {
    setSelectedEspaco(null);
    setShowEspacoModal(true);
  };

  const handleEditEspaco = (espaco: EspacoTrabalho) => {
    setSelectedEspaco(espaco);
    setShowEspacoModal(true);
  };

  const handleSaveEspaco = async (data: { nome: string }) => {
    try {
      setIsSavingEspaco(true);
      if (selectedEspaco) {
        await atualizarEspaco(selectedEspaco.id, data);
      } else {
        await criarEspaco(data);
      }
      setShowEspacoModal(false);
      setSelectedEspaco(null);
    } catch (error) {
      console.log('Erro ao salvar espaço de trabalho:', error);
      throw error;
    } finally {
      setIsSavingEspaco(false);
    }
  };

  const handleDeleteEspacoClick = async (id: string) => {
    if (selectedEspaco && selectedEspaco.id === id) {
      setShowDeleteEspacoModal(true);
    }
  };

  const handleConfirmDeleteEspaco = async () => {
    if (!selectedEspaco) return;
    setShowDeleteEspacoModal(false);
    setShowEspacoModal(false);

    try {
      setIsDeletingEspaco(true);
      await deletarEspaco(selectedEspaco.id);
      setSelectedEspaco(null);
    } catch (error) {
      console.log('Erro ao deletar espaço de trabalho:', error);
    } finally {
      setIsDeletingEspaco(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Espaços de Trabalho
          </h1>
          <PrimaryButton variant='white' onClick={handleCreateEspaco} disabled={loading}>
            {loading ? (
              <>
                <span
                  className="material-icons animate-spin mr-2 text-white"
                  style={{ fontSize: 20 }}
                >
                  autorenew
                </span>
                Carregando...
              </>
            ) : (
              <>
                <PlusIcon />
                Novo Espaço de Trabalho
              </>
            )}
          </PrimaryButton>
        </div>

        {espacosTrabalho.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Nenhum espaço de trabalho encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {espacosTrabalho.map(espaco => {
              const isAnimating = isItemAnimating(espaco.id);
              return (
                <div
                  key={espaco.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-2000 ease-out relative ${isAnimating ? 'delete-animating' : ''
                    }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleEspacoClick(espaco.id)}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {espaco.nome}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {espaco._count?.quadros} quadro
                      {espaco._count?.quadros !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500">{espaco.criadoEm}</p>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditEspaco(espaco);
                    }}
                    disabled={isSavingEspaco || isDeletingEspaco || loading}
                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Editar espaço de trabalho"
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

      {showEspacoModal && (
        <EspacoTrabalhoModal
          isOpen={showEspacoModal}
          onClose={() => {
            setShowEspacoModal(false);
            setSelectedEspaco(null);
          }}
          onSubmit={handleSaveEspaco}
          initialValues={
            selectedEspaco ? { nome: selectedEspaco.nome } : undefined
          }
          title={
            selectedEspaco
              ? 'Editar Espaço de Trabalho'
              : 'Novo Espaço de Trabalho'
          }
          espacoId={selectedEspaco?.id}
          onDelete={handleDeleteEspacoClick}
        />
      )}

      {showDeleteEspacoModal && selectedEspaco && (
        <ModalDelete
          isOpen={showDeleteEspacoModal}
          onClose={() => {
            setShowDeleteEspacoModal(false);
          }}
          isLoading={isDeletingEspaco}
          btn={{
            next: { label: 'Tem certeza?', onClick: handleConfirmDeleteEspaco },
          }}
          message={`Tem certeza que deseja excluir o espaço de trabalho "${selectedEspaco.nome}"? Esta ação não pode ser desfeita e todos os quadros serão excluídos.`}
        />
      )}
    </>
  );
};
