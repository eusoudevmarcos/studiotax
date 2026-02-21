import {
  atualizarCardKanban,
  atualizarColunaKanban,
  atualizarQuadroKanban,
  criarCardKanban,
  criarColunaKanban,
  deletarCardKanban,
  deletarColunaKanban,
  duplicarCardKanban
} from '@/axios/kanban.axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { PlusIcon } from '@/components/icons';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanFilters } from '@/components/kanban/KanbanFilters';
import ModalDelete from '@/components/modal/ModalDelete';
import { KanbanProvider, useKanban } from '@/context/KanbanContext';
import { useDeleteAnimation } from '@/hooks/useDeleteAnimation';
import {
  CardKanban,
  CardKanbanInput,
  ColunaKanban,
  ColunaKanbanInput,
  QuadroKanbanInput,
  UsuarioSistema,
  VinculoCard,
} from '@/schemas/kanban.schema';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Dynamic imports para modais pesados
const CardFormModal = dynamic(
  () => import('@/components/kanban/CardFormModal').then(mod => ({ default: mod.CardFormModal })),
  { ssr: false }
);

const CardViewModal = dynamic(
  () => import('@/components/kanban/CardViewModal').then(mod => ({ default: mod.CardViewModal })),
  { ssr: false }
);

const ColunaFormModal = dynamic(
  () => import('@/components/kanban/ColunaFormModal').then(mod => ({ default: mod.ColunaFormModal })),
  { ssr: false }
);

const QuadroModal = dynamic(
  () => import('@/components/kanban/QuadroModal').then(mod => ({ default: mod.QuadroModal })),
  { ssr: false }
);

interface QuadroKanbanViewProps {
  quadroId: string;
}

const QuadroKanbanViewContent: React.FC<{ quadroId: string }> = ({
  quadroId,
}) => {
  const { quadro, refreshAfterMutation, filtros, setFiltros } = useKanban();
  const { isItemAnimating, startDeleteAnimation, animatingItemId } =
    useDeleteAnimation();

  // Modais
  const [showCardModal, setShowCardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteColunaModal, setShowDeleteColunaModal] = useState(false);
  const [showColunaModal, setShowColunaModal] = useState(false);
  const [showQuadroModal, setShowQuadroModal] = useState(false);

  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<CardKanban | null>(null);
  const [selectedColuna, setSelectedColuna] = useState<ColunaKanban | null>(
    null
  );
  const [cardToDelete, setCardToDelete] = useState<CardKanban | null>(null);
  const [colunaToDelete, setColunaToDelete] = useState<ColunaKanban | null>(
    null
  );
  const [cardToView, setCardToView] = useState<CardKanban | null>(null);
  const [isDeletingColuna, setIsDeletingColuna] = useState(false);
  const [isDeletingCard, setIsDeletingCard] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [isSavingColuna, setIsSavingColuna] = useState(false);
  const [creatingCardColumnId, setCreatingCardColumnId] = useState<string | null>(null);

  // Handlers memoizados com useCallback
  const handleAddCard = useCallback((columnId: string) => {
    setCreatingCardColumnId(columnId);
  }, []);

  const handleCardCreated = useCallback(async () => {
    setCreatingCardColumnId(null);
    await refreshAfterMutation();
  }, [refreshAfterMutation]);

  const handleCancelCreateCard = useCallback(() => {
    setCreatingCardColumnId(null);
  }, []);

  const handleEditCard = useCallback((card: CardKanban) => {
    setSelectedCard(card);
    setSelectedColumnId(card.colunaKanbanId);
    setShowCardModal(true);
  }, []);

  const handleDuplicateCard = useCallback(async (card: CardKanban) => {
    await duplicarCardKanban(card.id);
    await refreshAfterMutation();
  }, [refreshAfterMutation]);

  const handleDeleteCard = useCallback((card: CardKanban) => {
    setCardToDelete(card);
    setShowDeleteModal(true);
  }, []);

  const handleSaveCard = useCallback(async (data: CardKanbanInput) => {
    try {
      setIsSavingCard(true);
      if (selectedCard) {
        await atualizarCardKanban(selectedCard.id, data);
      } else {
        await criarCardKanban(data);
      }
      // Fazer refresh para garantir que o card apareça
      await refreshAfterMutation();
      // Limpar estados após sucesso (o modal será fechado pelo CardFormModal via onClose)
      setSelectedCard(null);
      setSelectedColumnId('');
    } catch (error) {
      console.log('Erro ao salvar card:', error);
      // Em caso de erro, manter o modal aberto para o usuário poder tentar novamente
      throw error;
    } finally {
      setIsSavingCard(false);
    }
  }, [selectedCard, refreshAfterMutation]);

  const handleCreateColuna = useCallback(async (data: ColunaKanbanInput) => {
    try {
      setIsSavingColuna(true);
      if (selectedColuna) {
        await atualizarColunaKanban(selectedColuna.id, data);
      } else {
        await criarColunaKanban(data);
      }
      await refreshAfterMutation();
      setShowColunaModal(false);
      setSelectedColuna(null);
    } catch (error) {
      console.log('Erro ao salvar coluna:', error);
      throw error;
    } finally {
      setIsSavingColuna(false);
    }
  }, [selectedColuna, refreshAfterMutation]);

  const handleEditColuna = useCallback((coluna: ColunaKanban) => {
    setSelectedColuna(coluna);
    setShowColunaModal(true);
  }, []);

  const handleDeleteColuna = useCallback((id: string) => {
    const coluna = selectedColuna;
    if (coluna && coluna.id === id) {
      setColunaToDelete(coluna);
      setShowDeleteColunaModal(true);
      // Não fecha a modal de edição
    }
  }, [selectedColuna]);

  const handleConfirmDeleteColuna = useCallback(async () => {
    if (!colunaToDelete) return;
    // Fechar modal imediatamente
    setShowDeleteColunaModal(false);
    setShowColunaModal(false);

    // Iniciar animação e depois deletar
    startDeleteAnimation(colunaToDelete.id, async () => {
      try {
        setIsDeletingColuna(true);
        await deletarColunaKanban(colunaToDelete.id);
        await refreshAfterMutation();
        setColunaToDelete(null);
        setSelectedColuna(null);
      } catch (error) {
        console.log('Erro ao deletar coluna:', error);
        throw error; // Re-throw para o hook reverter a animação
      } finally {
        setIsDeletingColuna(false);
      }
    });
  }, [colunaToDelete, refreshAfterMutation, startDeleteAnimation]);

  const handleDeleteCardFromModal = useCallback((id: string) => {
    if (selectedCard && selectedCard.id === id) {
      setCardToDelete(selectedCard);
      setShowDeleteModal(true);
      // Não fecha a modal de edição
    }
  }, [selectedCard]);

  const handleConfirmDeleteCard = useCallback(async () => {
    if (!cardToDelete) return;
    // Fechar modal imediatamente
    setShowDeleteModal(false);
    setShowCardModal(false);

    // Iniciar animação e depois deletar
    startDeleteAnimation(cardToDelete.id, async () => {
      try {
        setIsDeletingCard(true);
        await deletarCardKanban(cardToDelete.id);
        await refreshAfterMutation();
        setCardToDelete(null);
        setSelectedCard(null);
        setSelectedColumnId('');
      } catch (error) {
        console.log('Erro ao deletar card:', error);
        throw error; // Re-throw para o hook reverter a animação
      } finally {
        setIsDeletingCard(false);
      }
    });
  }, [cardToDelete, refreshAfterMutation, startDeleteAnimation]);

  const handleEditQuadro = useCallback(async (data: QuadroKanbanInput) => {
    try {
      await atualizarQuadroKanban(quadroId, data);
      await refreshAfterMutation();
      setShowQuadroModal(false);
    } catch (error) {
      console.log('Erro ao atualizar quadro:', error);
      throw error;
    }
  }, [quadroId, refreshAfterMutation]);

  // Renderizar vínculos memoizado
  const renderVinculos = useCallback((vinculos: VinculoCard[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {vinculos.map(vinculo => {
          let label = '';
          let color = 'bg-blue-100 text-blue-800';

          if (vinculo.candidato) {
            label = `Candidato: ${vinculo.candidato.pessoa.nome}`;
            color = 'bg-purple-100 text-purple-800';
          } else if (vinculo.cliente) {
            label = `Cliente: ${vinculo.cliente.empresa.razaoSocial}`;
            color = 'bg-yellow-100 text-yellow-800';
          } else if (vinculo.compromisso) {
            label = `Compromisso: ${vinculo.compromisso.titulo}`;
            color = 'bg-red-100 text-red-800';
          }

          return (
            <span
              key={vinculo.id}
              className={`inline-block px-2 py-1 text-xs rounded ${color}`}
              title={label}
            >
              {label.length > 30 ? `${label.substring(0, 30)}...` : label}
            </span>
          );
        })}
      </div>
    );
  }, []);

  const handleCardClick = useCallback((card: CardKanban) => {
    setCardToView(card);
  }, []);

  // Extrair criadores únicos do quadro
  const criadores = useMemo(() => {
    if (!quadro) return [];
    const criadoresMap = new Map<string, UsuarioSistema>();
    quadro.colunas.forEach(col => {
      col.cards.forEach(card => {
        if (card.usuarioSistema?.id) {
          criadoresMap.set(card.usuarioSistema.id, card.usuarioSistema);
        }
      });
    });
    return Array.from(criadoresMap.values());
  }, [quadro]);

  // Extrair membros únicos do quadro
  const membros = useMemo(() => {
    if (!quadro) return [];
    const membrosMap = new Map<string, UsuarioSistema>();
    quadro.colunas.forEach(col => {
      col.cards.forEach(card => {
        card.membros?.forEach(membro => {
          if (membro.usuarioSistema?.id) {
            membrosMap.set(membro.usuarioSistema.id, membro.usuarioSistema);
          }
        });
      });
    });
    return Array.from(membrosMap.values());
  }, [quadro]);

  // Calcular total de cards filtrados
  const totalCardsFiltrados = useMemo(() => {
    if (!quadro) return 0;
    return quadro.colunas.reduce((total, col) => total + col.cards.length, 0);
  }, [quadro]);

  // Sincronizar cardToView com o card atualizado do contexto quando o quadro mudar
  useEffect(() => {
    if (cardToView && quadro) {
      // Encontrar o card atualizado no contexto
      const updatedCard = quadro.colunas
        .flatMap(col => col.cards)
        .find(c => c.id === cardToView.id);

      if (updatedCard) {
        // Atualizar o cardToView com o card atualizado do contexto
        // Isso garante que mudanças no checklist sejam refletidas na modal
        setCardToView(updatedCard);
      }
    }
  }, [cardToView, quadro]);

  return (
    <>
      <div className="flex justify-between items-center p-2 rounded-xl">
        <h1 className="text-5xl font-bold text-black">{quadro?.titulo ?? 'Quadro Kanban'}</h1>
        <div className="flex gap-2">
          <PrimaryButton variant='white' onClick={() => setShowColunaModal(true)}>
            <PlusIcon />
            Nova Coluna
          </PrimaryButton>
        </div>
      </div>

      <KanbanFilters
        filtros={filtros}
        onFiltrosChange={setFiltros}
        criadores={criadores}
        membros={membros}
        totalCards={totalCardsFiltrados}
      />

      <div className="w-full h-full">

        <KanbanBoard
          quadroId={quadroId}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onDuplicate={handleDuplicateCard}
          onDeleteCard={handleDeleteCard}
          onCardClick={handleCardClick}
          onEditColumn={handleEditColuna}
          renderVinculos={renderVinculos}
          canAddCard={true}
          loading={
            isSavingCard || isSavingColuna || isDeletingCard || isDeletingColuna
          }
          onRefresh={refreshAfterMutation}
          animatingItemId={animatingItemId}
          isItemAnimating={isItemAnimating}
          creatingCardColumnId={creatingCardColumnId}
          onCardCreated={handleCardCreated}
          onCancelCreateCard={handleCancelCreateCard}
        />

        {/* Modal editar card (apenas para edição, não para criação) */}
        {selectedCard && (
          <CardFormModal
            isOpen={showCardModal}
            onClose={() => {
              setShowCardModal(false);
              setSelectedCard(null);
              setSelectedColumnId('');
            }}
            onSubmit={handleSaveCard}
            initialValues={selectedCard}
            columnId={selectedColumnId}
            title="Editar Card"
            onDelete={async () =>
              await handleDeleteCardFromModal(selectedCard?.id || '')
            }
          />
        )}

        {/* Modal deletar card */}
        {showDeleteModal && cardToDelete && (
          <ModalDelete
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setCardToDelete(null);
            }}
            isLoading={isDeletingCard}
            btn={{
              next: { label: 'Tem certeza?', onClick: handleConfirmDeleteCard },
            }}
            message={`Tem certeza que deseja excluir o card "${cardToDelete.titulo}"?`}
          />
        )}

        {/* Modal deletar coluna */}
        {showDeleteColunaModal && colunaToDelete && (
          <ModalDelete
            isOpen={showDeleteColunaModal}
            onClose={() => {
              setShowDeleteColunaModal(false);
              setColunaToDelete(null);
            }}
            isLoading={isDeletingColuna}
            btn={{
              next: { label: 'Tem certeza?', onClick: handleConfirmDeleteColuna },
            }}
            message={`Tem certeza que deseja excluir a coluna "${colunaToDelete.titulo}"?`}
          />
        )}

        {/* Modal criar/editar coluna */}
        {showColunaModal && (
          <ColunaFormModal
            isOpen={showColunaModal}
            onClose={() => {
              setShowColunaModal(false);
              setSelectedColuna(null);
            }}
            onSubmit={handleCreateColuna}
            quadroKanbanId={quadroId}
            initialValues={selectedColuna || undefined}
            title={selectedColuna ? 'Editar Coluna' : 'Nova Coluna'}
            onDelete={async () =>
              await handleDeleteColuna(selectedColuna?.id || '')
            }
          />
        )}

        {/* Modal editar quadro */}
        {showQuadroModal && quadro && (
          <QuadroModal
            isOpen={showQuadroModal}
            onClose={() => setShowQuadroModal(false)}
            onSubmit={handleEditQuadro}
            espacoTrabalhoId={quadro.espacoTrabalhoId}
            initialValues={{
              titulo: quadro.titulo,
              espacoTrabalhoId: quadro.espacoTrabalhoId,
            }}
            title="Editar Quadro"
          />
        )}

        {/* Modal visualizar card */}
        {cardToView && (
          <CardViewModal
            isOpen={!!cardToView}
            onClose={() => setCardToView(null)}
            card={cardToView}
            onUpdate={refreshAfterMutation}
            columnName={selectedColuna?.titulo || 'Card'}
          />
        )}
      </div>
    </>
  );
};

export const QuadroKanbanView: React.FC<QuadroKanbanViewProps> = ({
  quadroId,
}) => {
  return (
    <KanbanProvider quadroId={quadroId}>
      <QuadroKanbanViewContent quadroId={quadroId} />
    </KanbanProvider>
  );
};
