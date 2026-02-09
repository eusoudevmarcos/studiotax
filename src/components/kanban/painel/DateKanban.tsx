import { useState } from "react";
import { FiCalendar, FiLoader } from "react-icons/fi";
import { Painel, type popupPositionType } from "./Painel";

export interface DateKanbanProps {
    popupPosition: popupPositionType,
    activePanel: string | null,
    setActivePanel: (activePanel: string | null) => void,
    card: { id: string, dataInicio?: string, dataEntrega?: string }, // Espera card ser passado
    onUpdateDates: (cardId: string, dates: { dataInicio?: string; dataEntrega?: string }) => Promise<void>,
    onUpdate?: () => void,
}

export const DateKanban = ({
    popupPosition,
    activePanel,
    setActivePanel,
    card,
    onUpdateDates,
    onUpdate,
}: DateKanbanProps) => {
    const [localDataInicio, setLocalDataInicio] = useState(card.dataInicio || "");
    const [localDataEntrega, setLocalDataEntrega] = useState(card.dataEntrega || "");
    const [savingDates, setSavingDates] = useState(false);

    // Atualiza datas locais ao trocar de card
    // Prevê uso futuro para manter sincronizado

    if (card.dataInicio !== undefined && card.dataInicio !== localDataInicio) {
        setLocalDataInicio(card.dataInicio || "");
    }
    if (card.dataEntrega !== undefined && card.dataEntrega !== localDataEntrega) {
        setLocalDataEntrega(card.dataEntrega || "");
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'dates'
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <FiCalendar className="w-4 h-4" />
                Datas
            </button>

            <Painel popupPosition={popupPosition} title="Datas">
                <>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Datas</h3>
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
                                onClick={async () => {
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
                                }}
                                disabled={savingDates}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {savingDates ? <FiLoader className="animate-spin mx-auto" /> : 'Salvar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalDataInicio('');
                                    setLocalDataEntrega('');
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>
                </>
            </Painel>
        </>
    );
};