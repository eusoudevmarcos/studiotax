import {
  atualizarChecklist,
  atualizarChecklistItem,
  criarChecklist,
  criarChecklistItem,
  deletarChecklist,
  deletarChecklistItem,
} from '@/axios/kanban.axios';
import { useKanban } from '@/context/KanbanContext';
import { CardKanban, ChecklistCard } from '@/schemas/kanban.schema';
import { useEffect, useRef, useState } from 'react';
// Removido: import { FiCheckSquare, FiLoader } from 'react-icons/fi';
import { Painel, type popupPositionType } from './Painel';

interface ChecklistKanbanProps {
  popupPosition: popupPositionType;
  activePanel: string | null;
  setActivePanel: (activePanel: 'labels' | 'dates' | 'checklist' | 'members' | null) => void;
  card: CardKanban;
  onUpdate?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null> | null;
  showFullSection?: boolean;
}

export const ChecklistKanban = ({
  popupPosition,
  activePanel,
  setActivePanel,
  card,
  onUpdate,
  buttonRef,
  showFullSection = false,
}: ChecklistKanbanProps) => {
  const { toggleCardChecklistCompleto } = useKanban();

  // Estados para criação de checklists
  const [newChecklistTitulo, setNewChecklistTitulo] = useState('');
  const [creatingChecklist, setCreatingChecklist] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [editingChecklistTitulo, setEditingChecklistTitulo] = useState('');
  const [newItemDescricao, setNewItemDescricao] = useState<Record<string, string>>({});
  const [creatingItem, setCreatingItem] = useState<Record<string, boolean>>({});

  // Estado para mostrar/esconder input novo item por checklist
  const [showAddItemInput, setShowAddItemInput] = useState<Record<string, boolean>>({});

  // Estados para edição de itens do checklist
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemDescricao, setEditingItemDescricao] = useState<string>('');
  const [savingItem, setSavingItem] = useState<Record<string, boolean>>({});
  // Para identificar a qual checklist pertence o item, assim ao clicar fora fecha corretamente aquele menu
  const [, setEditingItemChecklistId] = useState<string | null>(null);
  const editItemInputRef = useRef<HTMLInputElement | null>(null);
  const editingItemMenuRef = useRef<HTMLDivElement | null>(null);

  // Estado local para manter os checklists atualizados
  const [localChecklists, setLocalChecklists] = useState<ChecklistCard[]>(
    card.checklists || []
  );

  // Estado local para checklistCompleto
  const [localChecklistCompleto, setLocalChecklistCompleto] = useState<boolean>(
    card.checklistCompleto || false
  );

  // Sincronizar quando o card mudar
  useEffect(() => {
    setLocalChecklists(card.checklists || []);
    setLocalChecklistCompleto(card.checklistCompleto || false);
    setEditingItemId(null);
    setEditingItemDescricao('');
    setEditingItemChecklistId(null);
    setShowAddItemInput({}); // Resetar ao trocar card
  }, [card.checklists, card.checklistCompleto]);

  // Ajuste para focar input ao editar um item
  useEffect(() => {
    if (editingItemId && editItemInputRef.current) {
      editItemInputRef.current.focus();
    }
  }, [editingItemId]);

  // Detectar clique fora do menu de edição do item do checklist
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editingItemMenuRef.current &&
        !editingItemMenuRef.current.contains(event.target as Node)
      ) {
        setEditingItemId(null);
        setEditingItemDescricao('');
        setEditingItemChecklistId(null);
      }
    }
    if (editingItemId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingItemId]);

  // Funções para gerenciar checklists
  const handleCriarChecklist = async () => {
    if (!newChecklistTitulo.trim()) return;
    setCreatingChecklist(true);
    try {
      const novoChecklist = await criarChecklist(card.id, {
        titulo: newChecklistTitulo.trim(),
      });
      setLocalChecklists(prev => [...prev, novoChecklist]);
      setNewChecklistTitulo('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar checklist:', error);
    } finally {
      setCreatingChecklist(false);
    }
  };

  const handleEditarChecklist = async (checklistId: string, novoTitulo: string) => {
    if (!novoTitulo.trim()) {
      setEditingChecklistId(null);
      return;
    }
    try {
      await atualizarChecklist(checklistId, { titulo: novoTitulo.trim() });
      setEditingChecklistId(null);
      setLocalChecklists(prev =>
        prev.map(cl =>
          cl.id === checklistId ? { ...cl, titulo: novoTitulo.trim() } : cl
        )
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao editar checklist:', error);
    }
  };

  const handleDeletarChecklist = async (checklistId: string) => {
    try {
      await deletarChecklist(checklistId);
      setLocalChecklists(prev => prev.filter(cl => cl.id !== checklistId));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao deletar checklist:', error);
    }
  };

  const handleCriarChecklistItem = async (checklistId: string) => {
    const descricao = newItemDescricao[checklistId]?.trim();
    if (!descricao) return;
    setCreatingItem(prev => ({ ...prev, [checklistId]: true }));
    try {
      const novoItem = await criarChecklistItem(checklistId, { descricao });
      setNewItemDescricao(prev => ({ ...prev, [checklistId]: '' }));
      setLocalChecklists(prev =>
        prev.map(cl =>
          cl.id === checklistId
            ? {
              ...cl,
              itens: [...(cl.itens || []), novoItem],
            }
            : cl
        )
      );
      setShowAddItemInput(prev => ({ ...prev, [checklistId]: false }));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar item de checklist:', error);
    } finally {
      setCreatingItem(prev => ({ ...prev, [checklistId]: false }));
    }
  };

  const handleToggleChecklistItem = async (
    itemId: string,
    concluido: boolean
  ) => {
    try {
      await atualizarChecklistItem(itemId, { concluido: !concluido });
      setLocalChecklists(prev =>
        prev.map(cl => ({
          ...cl,
          itens: cl.itens?.map(item =>
            item.id === itemId ? { ...item, concluido: !concluido } : item
          ),
        }))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao atualizar item de checklist:', error);
    }
  };

  const handleDeletarChecklistItem = async (itemId: string) => {
    try {
      await deletarChecklistItem(itemId);
      setLocalChecklists(prev =>
        prev.map(cl => ({
          ...cl,
          itens: cl.itens?.filter(item => item.id !== itemId) || [],
        }))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao deletar item de checklist:', error);
    }
  };

  const _handleToggleChecklistCompleto = async () => {
    const novoEstado = !localChecklistCompleto;
    setLocalChecklistCompleto(novoEstado);
    try {
      await toggleCardChecklistCompleto(card.id, novoEstado);
      if (onUpdate) onUpdate();
    } catch (error) {
      setLocalChecklistCompleto(!novoEstado);
      console.log('Erro ao atualizar status do card:', error);
    }
  };

  // Funções para editar o texto de um item do checklist
  const handleEditItemStart = (itemId: string, descricao: string, checklistId: string) => {
    setEditingItemId(itemId);
    setEditingItemDescricao(descricao);
    setEditingItemChecklistId(checklistId);
  };

  const handleEditItemCancel = () => {
    setEditingItemId(null);
    setEditingItemDescricao('');
    setEditingItemChecklistId(null);
  };

  const handleEditItemSave = async (itemId: string, checklistId: string) => {
    const novoDescricao = editingItemDescricao.trim();
    if (!novoDescricao) {
      handleEditItemCancel();
      return;
    }
    setSavingItem(prev => ({ ...prev, [itemId]: true }));
    try {
      await atualizarChecklistItem(itemId, { descricao: novoDescricao });
      setLocalChecklists(prev =>
        prev.map(cl =>
          cl.id === checklistId
            ? {
              ...cl,
              itens: cl.itens?.map(item =>
                item.id === itemId
                  ? { ...item, descricao: novoDescricao }
                  : item
              ),
            }
            : cl
        )
      );
      handleEditItemCancel();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao editar item de checklist:', error);
    } finally {
      setSavingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <>
      {
        !showFullSection && (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setActivePanel(activePanel === 'checklist' ? null : 'checklist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'checklist'
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {/* Substituição de <FiCheckSquare /> por Material Icons */}
            <span className="material-icons w-4 h-4 align-middle">check_box</span>
            Checklist
          </button>
        )
      }

      {/* Popup apenas quando não está na seção completa */}
      {!showFullSection && activePanel === 'checklist' && popupPosition && (
        <Painel
          popupPosition={popupPosition}
          title="Adicionar Checklist"
          panelType="checklist"
          minWidth="280px"
          maxWidth="350px"
        >
          <>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newChecklistTitulo}
                onChange={e => setNewChecklistTitulo(e.target.value)}
                placeholder="Título do checklist"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCriarChecklist();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCriarChecklist}
                disabled={!newChecklistTitulo.trim() || creatingChecklist}
                className=" bg-blue-600 text-black rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {creatingChecklist ? (
                  // Loading com Material Icons
                  <span className="material-icons animate-spin" style={{ fontSize: 20 }}>autorenew</span>
                ) : 'Salvar'}
              </button>
            </div>
            {localChecklists.length === 0 && (
              <p className="text-[11px] text-gray-400 text-center">
                Nenhum checklist criado ainda
              </p>
            )}
          </>
        </Painel>
      )}

      {/* Seção de renderização dos checklists - apenas quando showFullSection for true */}
      {showFullSection && localChecklists.length !== 0 && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            {localChecklistCompleto && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs font-medium">
                {/* <FiCheckSquare className="w-3 h-3" /> -> Material Icons */}
                <span className="material-icons w-3 h-3 align-middle" style={{ fontSize: 16 }}>check_box</span>
                Concluído
              </span>
            )}
          </div>

          {localChecklists.map(checklist => {
            const isEditing = editingChecklistId === checklist.id;
            const totalItens = checklist.itens?.length || 0;
            const itensConcluidos =
              checklist.itens?.filter(i => i.concluido).length || 0;
            const progresso = totalItens > 0 ? `${itensConcluidos}/${totalItens}` : '0/0';
            const porcentagemProgresso = totalItens > 0 ? (itensConcluidos / totalItens) * 100 : 0;
            const estaCompleto = totalItens > 0 && itensConcluidos === totalItens;

            return (
              <div
                key={checklist.id}
                className="rounded"
              >
                {/* Cabeçalho do checklist */}
                <div className="flex items-center gap-2 group mt-2 p-1 hover:bg-gray-100 transition-colors duration-300 rounded-md">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingChecklistTitulo}
                      onChange={e =>
                        setEditingChecklistTitulo(e.target.value)
                      }
                      onBlur={() =>
                        handleEditarChecklist(
                          checklist.id,
                          editingChecklistTitulo
                        )
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditarChecklist(
                            checklist.id,
                            editingChecklistTitulo
                          );
                        }
                        if (e.key === 'Escape') {
                          setEditingChecklistId(null);
                        }
                      }}
                      className="flex-1 rounded border border-gray-300 px-2 py-1 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="material-icons text-gray-500">checklist</span>

                      <span
                        className="flex-1 cursor-pointer text-md font-semibold"
                        onClick={() => {
                          setEditingChecklistId(checklist.id);
                          setEditingChecklistTitulo(checklist.titulo);
                        }}
                        title="Clique para editar"
                      >
                        {checklist.titulo}
                      </span>
                      <span className="text-xs text-gray-500">
                        {progresso}
                      </span>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeletarChecklist(checklist.id)}
                    className="text-red-300 hover:text-red-700 cursor-pointer opacity-0 hover:duration-200 transition-opacity duration-700 group-hover:opacity-100"
                    title="Deletar checklist"
                  >
                    <span className="material-icons text-red-500">delete_outline</span>
                  </button>
                </div>


                {/* Barra de progresso */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">{porcentagemProgresso}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${estaCompleto
                        ? 'bg-green-500'
                        : porcentagemProgresso > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                        }`}
                      style={{ width: `${porcentagemProgresso}%` }}
                    />
                  </div>
                </div>

                {/* Lista de itens do checklist */}
                <div className="ml-4">
                  {checklist.itens?.map(item => (
                    <div
                      key={item.id}
                      className={`flex flex-col rounded hover:bg-gray-100 transition-colors duration-300 p-1 ${editingItemId === item.id ? 'bg-gray-200 shadow-md' : ''}`}
                    >
                      <div className={`flex items-center gap-2 group`}>
                        {editingItemId !== item.id &&
                          (
                            <input
                              type="checkbox"
                              checked={item.concluido}
                              onChange={() =>
                                handleToggleChecklistItem(
                                  item.id,
                                  item.concluido
                                )
                              }
                              className="cursor-pointer"
                            />
                          )}
                        {editingItemId === item.id ? (
                          <>
                            <input
                              ref={editItemInputRef}
                              type="text"
                              value={editingItemDescricao}
                              onChange={e => setEditingItemDescricao(e.target.value)}
                              className="flex-1 rounded border border-gray-300 px-2 py-1 text-md focus:outline-none"
                              disabled={!!savingItem[item.id]}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleEditItemSave(item.id, checklist.id);
                                }
                                if (e.key === 'Escape') {
                                  handleEditItemCancel();
                                }
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <span
                              className={`flex-1 text-md ${item.concluido
                                ? 'line-through text-gray-400'
                                : 'text-gray-700'
                                } cursor-pointer`}
                              title="Clique para editar"
                              onClick={() => handleEditItemStart(item.id, item.descricao, checklist.id)}
                            >
                              {item.descricao}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDeletarChecklistItem(checklist.id)}
                              className="text-red-300 hover:text-red-700 cursor-pointer opacity-0 hover:duration-200 transition-opacity duration-700 group-hover:opacity-100"
                              title="Deletar checklist"
                            >
                              <span className="material-icons text-red-500">delete_outline</span>
                            </button>
                          </>
                        )}
                      </div>
                      {editingItemId === item.id && (
                        <div
                          ref={editingItemMenuRef}
                          className="flex gap-2 p-2"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleEditItemSave(item.id, checklist.id)
                            }
                            className="flex items-center underline  text-sm"
                            disabled={!!savingItem[item.id] || editingItemDescricao.trim() === ""}
                            title="Salvar"
                          >
                            {savingItem[item.id] && (
                              // Loader com Material Icons
                              <span className="material-icons animate-spin mr-1" style={{ fontSize: 18 }}>autorenew</span>
                            )}
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={handleEditItemCancel}
                            className="flex items-center underline text-sm"
                            title="Cancelar edição"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletarChecklistItem(item.id)
                            }
                            className="flex items-center underline text-sm"
                            title="Deletar item"
                          >
                            Deletar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input para adicionar novo item */}
                <div className="flex gap-2 mt-2 ml-5">
                  {!showAddItemInput[checklist.id] && (
                    <button
                      type="button"
                      className="rounded bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-300 transition"
                      onClick={() =>
                        setShowAddItemInput(prev => ({
                          ...prev,
                          [checklist.id]: true,
                        }))
                      }
                    >
                      Adicionar um item
                    </button>
                  )}

                  {showAddItemInput[checklist.id] && (
                    <>
                      <input
                        type="text"
                        value={newItemDescricao[checklist.id] || ''}
                        onChange={e =>
                          setNewItemDescricao(prev => ({
                            ...prev,
                            [checklist.id]: e.target.value,
                          }))
                        }
                        onKeyDown={e => {
                          if (
                            e.key === 'Enter' &&
                            newItemDescricao[checklist.id]?.trim()
                          ) {
                            handleCriarChecklistItem(checklist.id);
                          }
                          if (e.key === 'Escape') {
                            setShowAddItemInput(prev => ({
                              ...prev,
                              [checklist.id]: false,
                            }));
                            setNewItemDescricao(prev => ({
                              ...prev,
                              [checklist.id]: '',
                            }));
                          }
                        }}
                        placeholder="Adicionar um item..."
                        className="flex-1 rounded border border-gray-300 px-2 py-2 text-xs focus:outline-none"
                        disabled={creatingItem[checklist.id]}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleCriarChecklistItem(checklist.id);
                        }}
                        disabled={
                          !newItemDescricao[checklist.id]?.trim() ||
                          creatingItem[checklist.id]
                        }
                        className="rounded bg-gray-600 px-2 py-1 text-xs text-black hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {creatingItem[checklist.id] ? (
                          // Loader com Material Icons
                          <span className="material-icons animate-spin" style={{ fontSize: 16 }}>autorenew</span>
                        ) : (
                          'Adicionar'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddItemInput(prev => ({
                            ...prev,
                            [checklist.id]: false,
                          }));
                          setNewItemDescricao(prev => ({
                            ...prev,
                            [checklist.id]: '',
                          }));
                        }}
                        className="rounded px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                        title="Cancelar"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
