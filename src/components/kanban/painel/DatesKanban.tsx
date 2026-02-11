import { useState, useEffect } from 'react';
import { Painel, type popupPositionType } from './Painel';
import { CardKanban } from '@/schemas/kanban.schema';

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

interface DatesKanbanProps {
  popupPosition: popupPositionType;
  activePanel: string | null;
  setActivePanel: (activePanel: 'labels' | 'dates' | 'checklist' | 'members' | null) => void;
  card: CardKanban;
  onUpdateDates: (
    cardId: string,
    data: {
      dataInicio?: string | Date;
      dataEntrega?: string | Date;
    }
  ) => Promise<void>;
  onUpdate?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null> | null;
}

export const DatesKanban = ({
  popupPosition,
  activePanel,
  setActivePanel,
  card,
  onUpdateDates,
  onUpdate,
  buttonRef,
}: DatesKanbanProps) => {
  const [localDataInicio, setLocalDataInicio] = useState<string>('');
  const [localDataEntrega, setLocalDataEntrega] = useState<string>('');
  const [savingDates, setSavingDates] = useState(false);

  useEffect(() => {
    if (card.datas?.dataInicio) {
      setLocalDataInicio(new Date(card.datas.dataInicio).toISOString().slice(0, 10));
    } else {
      setLocalDataInicio('');
    }
    if (card.datas?.dataEntrega) {
      setLocalDataEntrega(new Date(card.datas.dataEntrega).toISOString().slice(0, 10));
    } else {
      setLocalDataEntrega('');
    }
  }, [card.datas?.dataInicio, card.datas?.dataEntrega]);

  const handleSalvarDatas = async () => {
    setSavingDates(true);
    try {
      await onUpdateDates(card.id, {
        dataInicio: localDataInicio || undefined,
        dataEntrega: localDataEntrega || undefined,
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao salvar datas:', error);
    } finally {
      setSavingDates(false);
    }
  };

  const handleLimparDatas = () => {
    setLocalDataInicio('');
    setLocalDataEntrega('');
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          activePanel === 'dates'
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <MaterialIcon name="calendar_today" className="w-4 h-4" />
        Datas
      </button>

      {activePanel === 'dates' && popupPosition && (
        <Painel popupPosition={popupPosition} title="Datas" panelType="dates">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={localDataInicio}
                onChange={e => setLocalDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                value={localDataEntrega}
                onChange={e => setLocalDataEntrega(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSalvarDatas}
                disabled={savingDates}
                className="flex-1 px-4 py-2 bg-blue-600 text-black rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {savingDates ? (
                  <MaterialIcon name="autorenew" className="animate-spin mx-auto" />
                ) : (
                  'Salvar'
                )}
              </button>
              <button
                type="button"
                onClick={handleLimparDatas}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
              >
                Limpar
              </button>
            </div>
          </div>
        </Painel>
      )}
    </>
  );
};
