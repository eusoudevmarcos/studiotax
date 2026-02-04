import {
  criarEtiquetaQuadro,
} from '@/axios/kanban.axios';
import { EtiquetaQuadro } from '@/schemas/kanban.schema';
import { useState } from 'react';
import { Painel, type popupPositionType } from './Painel';

interface LabelsKanbanProps {
  popupPosition: popupPositionType;
  activePanel: string | null;
  setActivePanel: (activePanel: 'labels' | 'dates' | 'checklist' | 'members' | null) => void;
  quadroId: string;
  quadroEtiquetas: EtiquetaQuadro[];
  selectedEtiquetaIds: Set<string>;
  onUpdateEtiquetas: (newIds: string[]) => Promise<void>;
  onUpdate?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null> | null;
}

// MaterialIcon utilitário local
const MaterialIcon = ({
  name,
  className = '',
  style = {},
  ...rest
}: React.HTMLAttributes<HTMLElement> & { name: string }) => (
  <span
    className={`material-icons ${className}`}
    style={{ fontSize: '1em', verticalAlign: 'middle', ...style }}
    {...rest}
  >
    {name}
  </span>
);

const coresPredefinidas = [
  '#4b5563', // gray
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export const LabelsKanban = ({
  popupPosition,
  activePanel,
  setActivePanel,
  quadroId,
  quadroEtiquetas,
  selectedEtiquetaIds,
  onUpdateEtiquetas,
  onUpdate,
  buttonRef,
}: LabelsKanbanProps) => {
  const [newEtiquetaNome, setNewEtiquetaNome] = useState('');
  const [newEtiquetaCor, setNewEtiquetaCor] = useState('#4b5563');
  const [creatingEtiqueta, setCreatingEtiqueta] = useState(false);

  const handleCriarEtiqueta = async () => {
    if (!newEtiquetaNome.trim() || !quadroId) return;
    setCreatingEtiqueta(true);
    try {
      await criarEtiquetaQuadro(quadroId, {
        nome: newEtiquetaNome.trim(),
        cor: newEtiquetaCor,
      });
      setNewEtiquetaNome('');
      setNewEtiquetaCor('#4b5563');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar etiqueta:', error);
    } finally {
      setCreatingEtiqueta(false);
    }
  };

  const handleToggleEtiqueta = async (etiquetaId: string) => {
    const newIds = selectedEtiquetaIds.has(etiquetaId)
      ? Array.from(selectedEtiquetaIds).filter(id => id !== etiquetaId)
      : [...Array.from(selectedEtiquetaIds), etiquetaId];
    try {
      await onUpdateEtiquetas(newIds);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao atualizar etiquetas:', error);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setActivePanel(activePanel === 'labels' ? null : 'labels')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          activePanel === 'labels'
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <MaterialIcon name="label" className="w-4 h-4" />
        Etiquetas
      </button>

      {activePanel === 'labels' && popupPosition && (
        <Painel popupPosition={popupPosition} title="Etiquetas" panelType="labels">
          <>
            {/* Criar nova etiqueta */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newEtiquetaNome}
                  onChange={e => setNewEtiquetaNome(e.target.value)}
                  placeholder="Nome da etiqueta"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleCriarEtiqueta();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleCriarEtiqueta}
                  disabled={!newEtiquetaNome.trim() || creatingEtiqueta}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {creatingEtiqueta ? (
                    <MaterialIcon
                      name="autorenew"
                      className="animate-spin"
                      style={{ fontSize: '1.1em', lineHeight: 0 }}
                    />
                  ) : (
                    'Criar'
                  )}
                </button>
              </div>
              <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-1">
                <div className="flex flex-row" style={{ minWidth: 'max-content' }}>
                  {coresPredefinidas.map(cor => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setNewEtiquetaCor(cor)}
                      className={`w-8 h-8 rounded border-2 ${
                        newEtiquetaCor === cor ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: cor }}
                      title={cor}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de etiquetas do quadro */}
            <div className="max-h-48 overflow-y-auto">
              {quadroEtiquetas.map(etiqueta => {
                const isSelected = selectedEtiquetaIds.has(etiqueta.id);
                return (
                  <div
                    key={etiqueta.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleToggleEtiqueta(etiqueta.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="cursor-pointer"
                    />
                    <span
                      className="flex-1 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-white"
                      style={{ backgroundColor: etiqueta.cor || '#4b5563' }}
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                      {etiqueta.nome}
                    </span>
                  </div>
                );
              })}
              {quadroEtiquetas.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma etiqueta criada ainda
                </p>
              )}
            </div>
          </>
        </Painel>
      )}
    </>
  );
};
