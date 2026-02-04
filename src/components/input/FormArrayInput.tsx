import { InputProps, MaskProps } from '@/type/formInput.type';
import { SelectProps } from '@/type/formSelect.type';
import React, { useRef, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import { Container } from './Container';

interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  component?: 'input' | 'select';
  selectOptions?: { value: any; label: string }[] | React.ReactNode;
  required?: boolean;
  maskProps?: MaskProps;
  inputProps?: InputProps;
  selectProps?: SelectProps;
}

interface FormArrayInputProps {
  name?: string;
  title: string;
  addButtonText?: string;
  fieldConfigs: FieldConfig[];
  renderChipContent: (item: any, index: number) => React.ReactNode;
  initialItemData?: any;
  containerClassName?: string;
  buttonPosition?: 'end' | 'side';
  ValuesArrayString?: boolean;
  value: any[]; // O array que esse componente controla
  onChange: (value: any[]) => void; // Notifica o pai sobre mudanças
  validateCustom?: (
    value: any,
    fieldConfigs: any,
    setItemError: React.Dispatch<React.SetStateAction<string | null>>
  ) => boolean;
  pasteInput?: boolean; // nova prop: ativa leitura do clipboard ao focar input
}

export function FormArrayInput({
  name,
  title,
  addButtonText,
  fieldConfigs,
  renderChipContent,
  initialItemData = {},
  containerClassName,
  ValuesArrayString = false,
  value,
  onChange,
  validateCustom,
  pasteInput = false,
}: FormArrayInputProps) {
  // Estados locais
  const [newItemValues, setNewItemValues] = useState<Record<string, any>>(
    () => {
      const defaultValues: Record<string, any> = {};
      fieldConfigs.forEach(config => {
        defaultValues[config.name] =
          initialItemData[config.name] !== undefined
            ? initialItemData[config.name]
            : '';
      });
      return defaultValues;
    }
  );

  const [itemError, setItemError] = useState<string | null>(null);

  // Estado para auxiliar o comportamento solicitado
  const [lastPasted, setLastPasted] = useState<Record<string, boolean>>({});
  const backspaceTimerRefs = useRef<Record<string, NodeJS.Timeout | null>>({});

  const handleInputChange = (fieldName: string, inputValue: any) => {
    setNewItemValues(prev => ({
      ...prev,
      [fieldName]: inputValue,
    }));
    if (itemError) setItemError(null);
    setLastPasted(prev => ({
      ...prev,
      [fieldName]: false, // Reset pasted state on manual change
    }));

    // if (!validateItem()) return;
  };

  // Handler para onFocus no input: lê clipboard se necessário
  const handleFocusPaste = async (configName: string) => {
    if (!pasteInput) return;
    if (
      navigator &&
      navigator.clipboard &&
      typeof navigator.clipboard.readText === 'function'
    ) {
      try {
        const clipboardValue = await navigator.clipboard.readText();
        setNewItemValues(prev => ({
          ...prev,
          [configName]: clipboardValue,
        }));
        setLastPasted(prev => ({
          ...prev,
          [configName]: true, // Marca que o último valor foi via paste
        }));
      } catch (err) {
        // Ignore se usuário negar permissão, ou navegador não suportar
      }
    }
  };

  const handleBackspaceKey = (
    e: React.KeyboardEvent,
    configName: string,
    fieldValue: any
  ) => {
    // Só ativa se pasteInput ativo e foi colado recentemente e campo não está vazio
    if (!pasteInput) return;
    if (e.key !== 'Backspace') return;
    if (!lastPasted[configName]) return;

    // Limpador se já existia timer para esse campo
    if (backspaceTimerRefs.current[configName]) {
      clearTimeout(backspaceTimerRefs.current[configName]!);
      backspaceTimerRefs.current[configName] = null;
    }

    const clearInput = () => {
      setNewItemValues(prev => ({
        ...prev,
        [configName]: '',
      }));
      setLastPasted(prev => ({
        ...prev,
        [configName]: false,
      }));
      if (backspaceTimerRefs.current[configName]) {
        clearTimeout(backspaceTimerRefs.current[configName]!);
        backspaceTimerRefs.current[configName] = null;
      }
    };

    // Se segurar por 1s, limpa o campo
    // No onKeyDown
    backspaceTimerRefs.current[configName] = setTimeout(() => {
      clearInput();
    }, 1000);

    // Função para tratar o onKeyUp (cancelar o clear pra clique rápido)
    const handleKeyUp = (upEvent: KeyboardEvent) => {
      if (
        upEvent.key === 'Backspace' &&
        backspaceTimerRefs.current[configName]
      ) {
        clearTimeout(backspaceTimerRefs.current[configName]!);
        backspaceTimerRefs.current[configName] = null;
      }
      // Limpa o listener após sair
      window.removeEventListener('keyup', handleKeyUp);
    };

    // Escuta o onKeyUp pra saber se foi só um clique rápido
    window.addEventListener('keyup', handleKeyUp);
  };

  const validateItem = (): boolean => {
    for (const config of fieldConfigs) {
      const val = newItemValues[config.name];
      // Required
      if (config.required && (!val || String(val).trim() === '')) {
        setItemError(`O campo '${config.label || config.name}' é obrigatório.`);
        return false;
      }

      // Validação de e-mail
      if (
        config.type === 'email' &&
        typeof val === 'string' &&
        val.length > 0
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve conter um e-mail válido.`
          );
          return false;
        }
      }

      // Validação de telefone/celular no padrão mascara:
      // (00) 0000-0000 ou (00) 0 0000-0000
      if (
        (config.type === 'telefone' ||
          config.type === 'celular' ||
          config.type === 'phone') &&
        typeof val === 'string' &&
        val.length > 0
      ) {
        // Aceita (00) 0000-0000  ou (00) 0 0000-0000
        // Aceita ou não o espaço após DDD e aceita traço
        const phoneRegex = /^\(\d{2}\)(\s\d)?\s?\d{4}-\d{4}$/;
        if (!phoneRegex.test(val.trim())) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve conter um telefone válido no formato (00) 0000-0000 ou (00) 0 0000-0000.`
          );
          return false;
        }
      }

      if (
        config.inputProps?.min !== undefined &&
        val !== undefined &&
        val !== ''
      ) {
        // Min (number)
        const numValue = Number(val);
        const minValue = Number(config.inputProps.min);
        if (!isNaN(numValue) && !isNaN(minValue) && numValue < minValue) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ser maior ou igual a ${minValue}.`
          );
          return false;
        }
      }
      // Max (number)
      if (
        config.inputProps?.max !== undefined &&
        val !== undefined &&
        val !== ''
      ) {
        const numValue = Number(val);
        const maxValue = Number(config.inputProps.max);
        if (!isNaN(numValue) && !isNaN(maxValue) && numValue > maxValue) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ser menor ou igual a ${maxValue}.`
          );
          return false;
        }
      }
      // minLength
      if (
        config.inputProps?.minLength !== undefined &&
        typeof val === 'string'
      ) {
        const minLen = Number(config.inputProps.minLength);
        if (val.length < minLen) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ter ao menos ${minLen} caracteres.`
          );
          return false;
        }
      }
      // maxLength
      if (
        config.inputProps?.maxLength !== undefined &&
        typeof val === 'string'
      ) {
        const maxLen = Number(config.inputProps.maxLength);
        if (val.length > maxLen) {
          setItemError(
            `O campo '${
              config.label || config.name
            }' deve ter no máximo ${maxLen} caracteres.`
          );
          return false;
        }
      }
      if (validateCustom) return validateCustom(val, config, setItemError);
    }

    return true;
  };

  const handleAddItem = (fieldName?: any) => {
    if (!validateItem()) return;

    const newItem = ValuesArrayString
      ? newItemValues[fieldName]
      : { ...newItemValues };

    // Elimine logs desnecessários e deixe o código mais sucinto e robusto
    const currentArray = Array.isArray(value) ? value : [];
    const itemToAdd = ValuesArrayString ? newItem : { ...newItemValues };
    const newArray = [...currentArray, itemToAdd];
    onChange(newArray);

    setItemError(null);

    // Reseta os campos após adicionar
    const resetValues: Record<string, any> = {};
    fieldConfigs.forEach(config => {
      resetValues[config.name] =
        initialItemData[config.name] !== undefined
          ? initialItemData[config.name]
          : '';
    });
    setNewItemValues(resetValues);
    setLastPasted({});
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <Container label={title} className={containerClassName}>
      {/* Campos de entrada */}
      <div
        className={`grid gap-4 ${
          fieldConfigs.length === 1
            ? 'grid-cols-1'
            : fieldConfigs.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {fieldConfigs.map((config, index) => {
          const fieldValue = newItemValues[config.name];

          return (
            <div
              className="flex items-end flex-wrap md:flex-nowrap gap-2 relative"
              key={config.name}
            >
              <div className="relative w-full">
                {config.component === 'select' ? (
                  <FormSelect
                    name={`${name || 'temp'}_${config.name}` as any}
                    value={fieldValue}
                    label={<p className="text-seconrary">{config.label}</p>}
                    placeholder={config.placeholder}
                    onChange={(e: any) => {
                      handleInputChange(config.name, e.target.value);
                    }}
                    selectProps={config.inputProps as any}
                  >
                    <>
                      {Array.isArray(config.selectOptions)
                        ? config.selectOptions?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))
                        : config.selectOptions}
                    </>
                  </FormSelect>
                ) : (
                  <FormInput
                    name={`${name || 'temp'}_${config.name}` as any}
                    value={fieldValue}
                    label={config.label}
                    placeholder={config.placeholder}
                    type={config.type || 'text'}
                    onChange={(e: any) => {
                      const val =
                        typeof e === 'string' ? e : e?.target?.value || '';
                      handleInputChange(config.name, val);
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem(config.name);
                      } else if (
                        pasteInput &&
                        e.key === 'Backspace' &&
                        lastPasted[config.name] &&
                        fieldValue
                      ) {
                        handleBackspaceKey(e, config.name, fieldValue);
                      }
                    }}
                    onFocus={
                      pasteInput
                        ? () => handleFocusPaste(config.name)
                        : undefined
                    }
                    errors={{} as any}
                    maskProps={config.maskProps}
                    inputProps={{
                      ...config.inputProps,
                      classNameContainer: ` ${config.inputProps?.classNameContainer}`,
                    }}
                    noControl
                  />
                )}
              </div>

              {index === fieldConfigs.length - 1 && (
                <div className="flex justify-end w-full md:w-auto">
                  <PrimaryButton
                    className="h-10 w-full md:w-auto"
                    type="button"
                    onClick={() => handleAddItem(config.name)}
                    disabled={!fieldValue}
                  >
                    {addButtonText ?? 'Incluir'}
                  </PrimaryButton>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {itemError && (
        <span className="text-red-500 text-sm font-medium absolute">
          {itemError}
        </span>
      )}

      {/* Lista de itens adicionados (chips) */}
      {!!value?.length ? (
        <div className="flex flex-wrap gap-2 mt-6 px-2">
          {value.map((item, index) => (
            <div
              key={
                typeof item === 'object' && item.id !== undefined
                  ? item.id
                  : index
              }
              className="flex items-center bg-primary text-white text-sm px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="mr-2">{renderChipContent(item, index)}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-full p-0.5 transition-colors"
                aria-label={`Remover item ${index + 1}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary text-sm pl-4 mt-5">
          Nenhuma Informação Adicionada
        </p>
      )}
    </Container>
  );
}
