/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TipoEventoTriagemEnum as TipoTriagemEnumZod,
  TriagemInput,
} from '@/schemas/vaga.schema';
import React, { useMemo, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

type TriagemFormProps = {
  name?: string; // default 'triagens'
};

const TriagemForm: React.FC<TriagemFormProps> = ({ name = 'triagens' }) => {
  const { control, setValue } = useFormContext();
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name,
  });
  const triagens: TriagemInput[] = useWatch({
    control,
    name,
    defaultValue: [],
  });

  type TriagemTipo = (typeof TipoTriagemEnumZod.options)[number];
  const [selectedTipo, setSelectedTipo] =
    useState<TriagemTipo>('TRIAGEM_INICIAL');

  const tiposDisponiveis: TriagemTipo[] = useMemo(() => {
    const usados = new Set((triagens || []).map(t => t.tipoTriagem));
    return (TipoTriagemEnumZod.options as TriagemTipo[]).filter(
      t => !usados.has(t)
    );
  }, [triagens]);

  const canAdd = (triagens?.length || 0) < 4 && tiposDisponiveis.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const tipo = tiposDisponiveis.includes(selectedTipo)
      ? selectedTipo
      : tiposDisponiveis[0];
    append({ tipoTriagem: tipo, ativa: true } as any);
    // se o tipo selecionado foi consumido, ajustar seleção para um disponível
    const restantes = tiposDisponiveis.filter(t => t !== tipo);
    if (restantes.length > 0) {
      setSelectedTipo(restantes[0]);
    }
  };

  return (
    <div className="col-span-full border rounded-md p-3 mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">Triagens da Vaga</h3>
        <span className="text-sm text-gray-500">{triagens?.length || 0}/4</span>
      </div>

      <div className="flex gap-2 items-center mb-3">
        <select
          className="border rounded p-1 text-sm"
          value={selectedTipo}
          onChange={e => setSelectedTipo(e.target.value as TriagemTipo)}
          disabled={!canAdd}
        >
          {(TipoTriagemEnumZod.options as TriagemTipo[]).map(opt => (
            <option
              key={opt}
              value={opt}
              disabled={!tiposDisponiveis.includes(opt)}
            >
              {opt.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`px-3 py-1 rounded text-black text-sm ${
            canAdd ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleAdd}
          disabled={!canAdd}
        >
          Adicionar Triagem
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {(fields || []).map((field, idx) => {
          const item = triagens?.[idx] as TriagemInput | undefined;
          return (
            <div key={field.id} className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#ede9fe] text-primary">
                {item?.tipoTriagem?.replaceAll('_', ' ') || '—'}
              </span>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={!!item?.ativa}
                  onChange={e =>
                    update(idx, { ...(item as any), ativa: e.target.checked })
                  }
                />
                Ativa
              </label>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border"
                  title="Mover para cima"
                  onClick={() => idx > 0 && move(idx, idx - 1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border"
                  title="Mover para baixo"
                  onClick={() => idx < fields.length - 1 && move(idx, idx + 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border"
                  title="Mover para o topo"
                  onClick={() => idx > 0 && move(idx, 0)}
                >
                  Topo
                </button>
              </div>
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => remove(idx)}
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriagemForm;
