/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  adicionarMembroAoCard,
  atualizarCardKanban,
  criarComentarioCard,
  deletarComentarioCard,
  listarComentariosDoCard,
  listarVinculosDoCard,
  removerMembroDoCard,
  removerVinculo
} from '@/axios/kanban.axios';
import { useKanban } from '@/context/KanbanContext';
import {
  CardKanban,
  ComentarioCard,
  VinculoCard
} from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// REMOVIDO: import { FiEdit, FiLoader, FiTag } from 'react-icons/fi';
import Modal from '../modal/Modal';
import { ChecklistKanban } from './painel/ChecklistKanban';
import { DatesKanban } from './painel/DatesKanban';
import { LabelsKanban } from './painel/LabelsKanban';
import { MembersKanban } from './painel/MembersKanban';

interface CardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardKanban;
  onUpdate?: () => void;
  columnName: string;
}

export const CardViewModal: React.FC<CardViewModalProps> = ({
  isOpen,
  onClose,
  card,
  columnName,
  onUpdate,
}) => {
  const { quadro, toggleCardChecklistCompleto, updateCardLabels, updateCardDates } =
    useKanban();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(card.titulo);
  const [description, setDescription] = useState(card.descricao || '');
  const [comentarios, setComentarios] = useState<ComentarioCard[]>([]);
  const [vinculos, setVinculos] = useState<VinculoCard[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Loading state for comment submission (not block UI)
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // For storing whether the textarea is focused
  const [commentAreaFocused, setCommentAreaFocused] = useState(false);

  const [activePanel, setActivePanel] = useState<
    'labels' | 'dates' | 'checklist' | 'members' | null
  >(null);

  const quadroEtiquetas = useMemo(
    () => quadro?.etiquetas ?? [],
    [quadro?.etiquetas]
  );

  const selectedEtiquetaIds = useMemo(() => {
    const ids = new Set<string>();
    (card.etiquetas || []).forEach(et => {
      if (et.etiqueta?.id) {
        ids.add(et.etiqueta.id);
      } else if (et.etiquetaQuadroId) {
        ids.add(et.etiquetaQuadroId);
      }
    });
    return ids;
  }, [card.etiquetas]);


  // Estado local para checklistCompleto (atualização imediata do botão)
  const [localChecklistCompleto, setLocalChecklistCompleto] = useState<boolean>(
    card.checklistCompleto || false
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [comentariosData, vinculosData] = await Promise.all([
        listarComentariosDoCard(card.id),
        listarVinculosDoCard(card.id),
      ]);
      setComentarios(comentariosData);
      setVinculos(vinculosData);
    } catch (error) {
      console.log('Erro ao carregar dados do card:', error);
    } finally {
      setLoading(false);
    }
  }, [card.id]); // Corrigido: adicionar dependência card.id

  useEffect(() => {
    if (isOpen && card.id) {
      loadData();
      // Sincronizar estado local de checklistCompleto
      setLocalChecklistCompleto(card.checklistCompleto || false);
    }
  }, [isOpen, card.id, card.checklistCompleto, loadData]);


  const handleSaveTitle = async () => {
    try {
      await atualizarCardKanban(card.id, { titulo: title });
      setIsEditingTitle(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao salvar título:', error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await atualizarCardKanban(card.id, { descricao: description });
      setIsEditingDescription(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao salvar descrição:', error);
    }
  };

  const handleCancelDescription = () => {
    setDescription(card.descricao || '');
    setIsEditingDescription(false);
  };

  const handleAddComment = async () => {
    const commentToSend = newComment.trim();
    if (!commentToSend || commentSubmitting) return;

    setCommentSubmitting(true);
    try {
      const comentario = await criarComentarioCard(card.id, {
        conteudo: commentToSend,
      });
      setComentarios(prev => [comentario, ...prev]);
      setNewComment('');
    } catch (error) {
      console.log('Erro ao adicionar comentário:', error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deletarComentarioCard(id);
      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (error) {
      console.log('Erro ao deletar comentário:', error);
    }
  };

  const handleRemoveVinculo = async (id: string) => {
    try {
      await removerVinculo(id);
      setVinculos(vinculos.filter(v => v.id !== id));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao remover vínculo:', error);
    }
  };


  // Funções wrapper para membros
  const handleAdicionarMembro = async (cardId: string, usuarioSistemaId: string) => {
    await adicionarMembroAoCard(cardId, usuarioSistemaId);
  };

  const handleRemoverMembro = async (cardId: string, usuarioSistemaId: string) => {
    await removerMembroDoCard(cardId, usuarioSistemaId);
  };

  // Função wrapper para atualizar etiquetas
  const handleUpdateEtiquetas = async (newIds: string[]) => {
    await updateCardLabels(card.id, newIds);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60)
      return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24)
      return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    return d.toLocaleDateString('pt-BR');
  };

  const getVinculoLabel = (vinculo: VinculoCard): string => {
    if (vinculo.candidato) return `Candidato: ${vinculo.candidato.pessoa.nome}`;
    if (vinculo.cliente) {
      return `Cliente: ${vinculo.cliente.empresa.razaoSocial}`;
    }
    if (vinculo.compromisso)
      return `Compromisso: ${vinculo.compromisso.titulo}`;
    return 'Vínculo desconhecido';
  };

  // Ensure debounce doesn't fire after closing
  useEffect(() => {
    if (!isOpen) {
      setNewComment('');
    }
  }, [isOpen]);

  // --- Textarea ref for focus management ---
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Refs para os botões de ação para posicionar os pop-ups
  const labelsButtonRef = useRef<HTMLButtonElement>(null);
  const datesButtonRef = useRef<HTMLButtonElement>(null);
  const checklistButtonRef = useRef<HTMLButtonElement>(null);
  const membersButtonRef = useRef<HTMLButtonElement>(null);

  // Estado para posição dos pop-ups
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  // Calcular posição do pop-up quando activePanel muda
  useEffect(() => {
    if (!activePanel) {
      setPopupPosition(null);
      return;
    }

    let buttonElement: HTMLButtonElement | null = null;
    if (activePanel === 'labels') buttonElement = labelsButtonRef.current;
    else if (activePanel === 'dates') buttonElement = datesButtonRef.current;
    else if (activePanel === 'checklist') buttonElement = checklistButtonRef.current;
    else if (activePanel === 'members') buttonElement = membersButtonRef.current;

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      const containerRect = buttonElement.closest('.flex-1')?.getBoundingClientRect();
      if (containerRect) {
        setPopupPosition({
          top: rect.bottom - containerRect.top + 4,
          left: rect.left - containerRect.left,
        });
      }
    }
  }, [activePanel]);

  // Fechar pop-up ao clicar fora
  useEffect(() => {
    if (!activePanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let buttonElement: HTMLButtonElement | null = null;

      if (activePanel === 'labels') buttonElement = labelsButtonRef.current;
      else if (activePanel === 'dates') buttonElement = datesButtonRef.current;
      else if (activePanel === 'checklist') buttonElement = checklistButtonRef.current;
      else if (activePanel === 'members') buttonElement = membersButtonRef.current;

      const panel = document.querySelector(`[data-panel="${activePanel}"]`);

      if (
        buttonElement &&
        !buttonElement.contains(target) &&
        panel &&
        !panel.contains(target)
      ) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={columnName}>
      <div className="flex h-full max-h-[80vh] relative">
        {/* Coluna esquerda: detalhes do card */}
        <div className="flex-1 overflow-y-auto p-2 z-30">
          {/* Título com checkbox */}
          <div className="mb-2 flex items-start justify-between gap-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={localChecklistCompleto}
                  onChange={async () => {
                    const novoEstado = !localChecklistCompleto;
                    setLocalChecklistCompleto(novoEstado);
                    try {
                      await toggleCardChecklistCompleto(card.id, novoEstado);
                      if (onUpdate) onUpdate();
                    } catch (error) {
                      setLocalChecklistCompleto(!novoEstado);
                      console.log('Erro ao atualizar status do card:', error);
                    }
                  }}
                  className={`h-5 w-5 cursor-pointer rounded focus:ring-2 focus:ring-green-500 ${localChecklistCompleto
                    ? 'border-green-500 text-green-600'
                    : 'border-gray-300 text-green-600'
                    }`}
                />
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSaveTitle();
                    }
                    if (e.key === 'Escape') {
                      setTitle(card.titulo);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="flex-1 text-2xl font-bold border-2 border-blue-500 rounded px-2 py-1 focus:outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localChecklistCompleto}
                    onChange={async () => {
                      const novoEstado = !localChecklistCompleto;
                      setLocalChecklistCompleto(novoEstado);
                      try {
                        await toggleCardChecklistCompleto(card.id, novoEstado);
                        if (onUpdate) onUpdate();
                      } catch (error) {
                        setLocalChecklistCompleto(!novoEstado);
                        console.log('Erro ao atualizar status do card:', error);
                      }
                    }}
                    className={`h-5 w-5 cursor-pointer rounded focus:ring-2 focus:ring-green-500 ${localChecklistCompleto
                      ? 'border-green-500 text-green-600'
                      : 'border-gray-300 text-green-600'
                      }`}
                  />
                  <h2
                    className="text-2xl font-bold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1 flex-1"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {card.titulo}
                    {/* Substitui FiEdit por o ícone Material */}
                    <span className="material-icons inline-block ml-2 text-gray-500 text-lg align-middle">
                      edit
                    </span>
                  </h2>
                </div>
              </div>
            )}
          </div>

          {/* Barra de ações - abaixo do título */}
          <div className="mb-4 flex flex-wrap items-center gap-3 z-40">
            <LabelsKanban
              popupPosition={popupPosition}
              activePanel={activePanel}
              setActivePanel={(panel) => setActivePanel(panel)}
              quadroId={quadro?.id || ''}
              quadroEtiquetas={quadroEtiquetas}
              selectedEtiquetaIds={selectedEtiquetaIds}
              onUpdateEtiquetas={handleUpdateEtiquetas}
              onUpdate={onUpdate}
              buttonRef={labelsButtonRef}
            />
            <DatesKanban
              popupPosition={popupPosition}
              activePanel={activePanel}
              setActivePanel={(panel) => setActivePanel(panel)}
              card={card}
              onUpdateDates={updateCardDates}
              onUpdate={onUpdate}
              buttonRef={datesButtonRef}
            />
            <ChecklistKanban
              popupPosition={popupPosition}
              activePanel={activePanel}
              setActivePanel={(panel) => setActivePanel(panel)}
              card={card}
              onUpdate={onUpdate}
              buttonRef={checklistButtonRef}
            />
            <MembersKanban
              popupPosition={popupPosition}
              activePanel={activePanel}
              setActivePanel={(panel) => setActivePanel(panel)}
              card={card}
              onAdicionarMembro={handleAdicionarMembro}
              onRemoverMembro={handleRemoverMembro}
              onUpdate={onUpdate}
              buttonRef={membersButtonRef}
            />
            {/* 
              DICA: se seus componentes LabelsKanban, DatesKanban, etc, não suportam uma prop popupZIndex,
              garanta dentro deles que o pop-up, menu flutuante ou absolute/portal-container use
              um z-index suficientemente alto (ex: 40/50/auto, ou `z-50` do Tailwind)
              e garanta que esteja contido dentro da área do lado esquerdo (veja docs de portal, absolute, etc).
              */}
          </div>

          {/* Datas de início e fim do card (dataInicio/dataFim) */}
          {card?.datas && (card.datas.dataInicio || card.datas.dataEntrega) && (
            <div className="flex items-center gap-1 mb-4">
              <span className="material-icons text-gray-400 mr-1" style={{ fontSize: 20 }}>calendar_today</span>
              {card.datas.dataInicio && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    Início:{' '}
                    {new Date(card.datas.dataInicio).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {card.datas.dataEntrega && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                    Fim:{' '}
                    {new Date(card.datas.dataEntrega).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Seção de Etiquetas - abaixo dos botões de ações */}
          {(() => {
            // Buscar etiquetas do card, tentando primeiro a relação populada, depois do quadro
            const etiquetasDoCard = (card.etiquetas || [])
              .map(et => {
                // Se a relação etiqueta estiver populada, usa ela
                if (et.etiqueta) {
                  return et.etiqueta;
                }
                // Caso contrário, busca no quadro usando o etiquetaQuadroId
                if (et.etiquetaQuadroId && quadroEtiquetas.length > 0) {
                  return quadroEtiquetas.find(eq => eq.id === et.etiquetaQuadroId);
                }
                return null;
              })
              .filter(Boolean);

            return etiquetasDoCard.length > 0 ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {/* Substitui FiTag pelo material icon */}
                  <span className="material-icons w-5 h-5 text-gray-400" style={{ fontSize: 20 }}>
                    local_offer
                  </span>
                  <h3 className="text-md font-semibold text-gray-700 ">Etiquetas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {etiquetasDoCard.map(etiqueta => (
                    <span
                      key={etiqueta!.id}
                      className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-black"
                      style={{ backgroundColor: (etiqueta as any).cor || '#4b5563' }}
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                      {etiqueta!.nome}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Descrição */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-gray-500 mr-1 align-middle">list</span>
              <h3 className="text-md font-semibold text-gray-700 ">Etiquetas</h3>
            </div>

            <div className="ml-6">
              {isEditingDescription ? (
                <>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    // Remover onBlur automático e só sair dos botões
                    // onBlur={handleSaveDescription}
                    onKeyDown={e => {
                      if (e.key === 'Escape') {
                        handleCancelDescription();
                      }
                    }}
                    className="w-full border-2 border-blue-500 rounded px-3 py-2 focus:outline-none resize-none"
                    rows={4}
                    autoFocus
                  />
                  {/* Botões de ação para salvar e cancelar */}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDescription}
                      className="rounded bg-blue-600 text-black px-4 py-1.5 hover:bg-blue-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDescription}
                      className="rounded bg-gray-300 text-gray-800 px-4 py-1.5 hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className="text-gray-700 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1 min-h-[60px]"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description || (
                    <span className="text-gray-400 italic">
                      Clique para adicionar uma descrição...
                    </span>
                  )}
                  {/* Substitui FiEdit por o ícone Material */}
                  <span className="material-icons inline-block ml-2 text-gray-500 align-middle">
                    edit
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Vínculos */}
          {/* <div className="space-y-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Vínculos
            </h3>
            <div className="space-y-2">
              {vinculos.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum vínculo adicionado
                </p>
              ) : (
                vinculos.map(vinculo => (
                  <div
                    key={vinculo.id}
                    className="bg-gray-50 rounded-lg p-2 border border-gray-200 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700 flex-1">
                      {getVinculoLabel(vinculo)}
                    </span>
                    <button
                      onClick={() => handleRemoveVinculo(vinculo.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remover vínculo"
                    >
                      <span className="material-icons w-4 h-4 align-middle" style={{ fontSize: 18 }}>
                        close
                      </span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div> */}

          {/* Checklist - renderizado pelo componente ChecklistKanban */}
          <ChecklistKanban
            popupPosition={null}
            activePanel={null}
            setActivePanel={() => { }}
            card={card}
            onUpdate={onUpdate}
            buttonRef={null}
            showFullSection={true}
          />

        </div>

        {/* Coluna direita: comentários */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 flex flex-col relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Comentários</h3>

          <div className="mb-3">
            <div className="relative">
              <textarea
                ref={commentTextareaRef}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Adicione um comentário..."
                disabled={commentSubmitting}
                className="w-full resize-none rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                rows={3}
                onFocus={() => setCommentAreaFocused(true)}
                onBlur={() => setCommentAreaFocused(false)}
              />
            </div>
            <button
              onClick={handleAddComment}
              disabled={commentSubmitting || !newComment.trim()}
              className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {commentSubmitting ? (
                <>
                  {/* Substitui FiLoader por material icon com spin */}
                  <span className="material-icons animate-spin h-4 w-4 align-middle" style={{ fontSize: 16 }}>
                    autorenew
                  </span>
                  <span>Adicionando...</span>
                </>
              ) : (
                <span>Adicionar Comentário</span>
              )}
            </button>
            <div className="mt-1 text-xs text-gray-400">
              Pressione <b>Ctrl+Enter</b> para adicionar rapidamente.
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {comentarios.map(comentario => (
              <div key={comentario.id} className="rounded-lg p-2">
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {getUsuarioNome(comentario.usuarioSistema)}
                    </p>

                  </div>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 bg-gray-200 px-2 py-1 rounded-lg">
                  {comentario.conteudo}
                </p>
                <div className="flex items-center gap-2 justify-between">

                  <p className="text-xs text-gray-500">
                    {formatDate(comentario.criadoEm)}
                  </p>
                  <button
                    onClick={() => handleDeleteComment(comentario.id)}
                    className=" hover:text-red-700 text-sm underline"
                    title="Deletar comentário"
                  >
                    excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal >
  );
};
