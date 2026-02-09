// src/components/input/FormSelect.tsx
import { FormSelectProps } from '@/type/formSelect.type';
import { getError } from '@/utils/getError';
import React from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { Container } from '../input/Container';
import { ErrorMessage } from './ErrorMessage';

export function FormSelect<T extends FieldValues>({
  name,
  selectProps,
  label,
  placeholder,
  placeholderDisable = true,
  value,
  onChange,
  required,
  children,
  onMenuScrollToBottom, // <- nova prop
}: FormSelectProps<T> & {
  onMenuScrollToBottom?: (e: React.UIEvent<HTMLDivElement>) => void;
}) {
  const formContext = useFormContext<T>();
  const control = formContext?.control;
  const errors = formContext?.formState?.errors;

  // Prioriza controle manual quando onChange e value são fornecidos explicitamente
  // Isso permite usar o componente fora do react-hook-form ou com controle customizado
  const useManualControl = onChange !== undefined && value !== undefined;

  const errorMessage = getError(errors, name);
  const id = selectProps?.id || name.toString();

  const baseClass =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline border transition-all duration-200 disabled:opacity-90 min-h-[38px] text-sm!';
  const errorClass = errorMessage ? 'border-red-500' : '';

  const { classNameContainer, ...otherSelectProps } = selectProps || {};

  const selectClassName = [baseClass, errorClass, otherSelectProps?.className]
    .filter(Boolean)
    .join(' ');

  // Wrapper para adicionar onMenuScrollToBottom se fornecido
  // Nota: onMenuScrollToBottom é útil apenas para selects customizados (ex: react-select)
  // Para selects nativos HTML, esta prop pode não ter efeito esperado
  const SelectWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) =>
    onMenuScrollToBottom ? (
      <div
        style={{ maxHeight: 240, overflowY: 'auto' }}
        onScroll={onMenuScrollToBottom}
        tabIndex={-1}
      >
        {children}
      </div>
    ) : (
      <>{children}</>
    );

  const ControlElement = (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange: fieldOnChange, onBlur, value: fieldValue, ref },
      }) => (
        <SelectWrapper>
          <select
            ref={ref}
            id={id}
            className={selectClassName}
            value={fieldValue ?? ''}
            onChange={e => {
              fieldOnChange(e.target.value);
              // Chama onChange customizado se fornecido (para compatibilidade)
              if (onChange) {
                onChange(e);
              }
            }}
            onBlur={onBlur}
            required={required}
            {...otherSelectProps}
          >
            {placeholder && (
              <option value="" disabled={placeholderDisable}>
                {placeholder}
              </option>
            )}
            {children}
          </select>
        </SelectWrapper>
      )}
    />
  );

  const SelectInput = (
    <SelectWrapper>
      <select
        id={id}
        className={selectClassName}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        {...otherSelectProps}
      >
        {placeholder && (
          <option value="" disabled={placeholderDisable}>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </SelectWrapper>
  );

  // Usa controle manual quando onChange e value são fornecidos explicitamente
  // Caso contrário, usa react-hook-form se disponível
  return (
    <Container id={id} label={label} className={classNameContainer}>
      <div className="relative">
        {useManualControl
          ? SelectInput
          : control
          ? ControlElement
          : SelectInput}
        <ErrorMessage message={errorMessage ?? null} />
      </div>
    </Container>
  );
}
