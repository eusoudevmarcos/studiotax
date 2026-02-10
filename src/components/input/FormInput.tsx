// src/components/input/FormInput.tsx
import { FormInputControllerField, FormInputOnChange, FormInputProps, InputElementProps, MaskProps } from '@/types/formInput.type';
import { getError } from '@/utils/getError';
import React, { useMemo, useState } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';
import { ErrorMessage } from './ErrorMessage';

export function FormInput<T extends FieldValues>({
  name,
  inputProps,
  maskProps,
  label,
  placeholder,
  type = 'text',
  value: valueProp,
  onChange,
  onFocus,
  onKeyDown,
  control: externalControl,
  errors: externalErrors,
  noControl = false,
  clear = false,
  ...rest
}: FormInputProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;
  const errorMessage = getError(errors, name);
  const id = inputProps?.id || name.toString();

  const setValue = formContext?.setValue;
  const watch = formContext?.watch;
  const formValue = watch ? watch(name) : undefined;

  // Estado interno para fallback quando não está em modo controlado
  const [internalValue, setInternalValue] = useState<string>(valueProp ?? '');

  // Garantir sempre a fonte de valor correta no input
  let inputValue = '';
  if (control && !noControl) {
    inputValue = formValue ?? '';
  } else if (typeof valueProp !== 'undefined') {
    inputValue = valueProp;
  } else {
    inputValue = internalValue;
  }

  const {
    classNameContainer,
    required: inputRequired,
    onChange: _onChangeInputProps,
    ...otherInputProps
  } = inputProps || {};

  const inputClassName = buildInputClasses(
    errorMessage ?? null,
    otherInputProps?.className
  );

  let isRequired = false;
  if (typeof inputRequired !== 'undefined') {
    isRequired = inputRequired === true;
  } else if (
    errors &&
    name in errors &&
    errors[name] &&
    errors[name]?.type === 'required'
  ) {
    isRequired = true;
  } else if (typeof rest.required !== 'undefined') {
    isRequired = rest.required === true;
  }

  // Memo input for mask/normal
  const MemoInputElement = useMemo(() => {
    type MemoInputProps = Omit<InputElementProps, 'onChange'> & {
      onChange: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
    };
    const Component = React.forwardRef<HTMLInputElement, MemoInputProps>(
      (
        { maskProps, onChange, onKeyDown, onFocus, required, ...props },
        ref
      ) => {
        if (maskProps?.mask) {
          const maskInputProps = {
            inputRef: ref,
            onAccept: onChange,
            onFocus,
            onKeyDown,
            required,
            autoComplete: 'off',
            name: props.name,
            ...maskProps,
            ...props,
          } as React.ComponentProps<typeof IMaskInput>;
          return <IMaskInput {...maskInputProps} />;
        }
        return (
          <input
            ref={ref}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            autoComplete="off"
            required={required}
            name={props.name}
            {...props}
          />
        );
      }
    );
    Component.displayName = 'MemoInputElement';
    return Component;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskProps?.mask, name]);

  // Função para renderizar o input
  const renderInput = (field?: FormInputControllerField) => {
    const processedValueFromChange = (
      newValue: string | React.ChangeEvent<HTMLInputElement>
    ): string =>
      typeof newValue === 'string'
        ? newValue
        : (newValue?.target?.value ?? '');

    const handleChange = (newValue: string | React.ChangeEvent<HTMLInputElement>) => {
      const processedValue = processedValueFromChange(newValue);

      if (field?.onChange) {
        field.onChange(processedValue);
      } else {
        setInternalValue(processedValue);
      }

      if (onChange) {
        onChange(processedValue);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }
    };

    return (
      <MemoInputElement
        ref={field?.ref ?? undefined}
        id={id}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={field ? field.value ?? '' : inputValue ?? ''}
        onChange={handleChange}
        onBlur={field?.onBlur}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        maskProps={maskProps}
        required={isRequired}
        name={name.toString()}
        {...otherInputProps}
      />
    );
  };

  // Função para limpar
  const handleClear = () => {
    if (setValue && control && !noControl) {
      setValue(name, '' as never, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (!control || noControl) {
      setInternalValue('');
    }
    if (onChange) {
      onChange('');
    }
  };

  return (
    <Container id={id} label={label} className={classNameContainer}>
      <div className="relative">
        {control && !noControl ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => renderInput(field)}
          />
        ) : (
          renderInput({
            value: inputValue,
            onChange: setInternalValue,
            onBlur: () => {},
            ref: undefined,
            name: name.toString(),
          })
        )}

        {clear && <ClearButton value={inputValue} onClear={handleClear} />}
        {/* Mensagem de erro flutuante em formato de balão */}
        <ErrorMessage message={errorMessage ?? null} />
      </div>
    </Container>
  );
}

const ClearButton = ({ value, onClear }: { value: string; onClear: () => void }) =>
  value && String(value).trim() !== '' ? (
    <button
      type="button"
      onClick={onClear}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
      tabIndex={-1}
    >
      <span className="material-icons-outlined">close</span>
    </button>
  ) : null;

function buildInputClasses(
  errorMessage: string | null,
  customClassName?: string
) {
  const base =
    'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 disabled:opacity-90 focus:border-primary placeholder:text-md min-h-[38px]';
  const errorClass = errorMessage ? 'border-red-500' : '';
  return [base, errorClass, customClassName].filter(Boolean).join(' ');
}
