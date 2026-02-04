// src/components/input/FormInput.tsx
import { FormInputProps } from '@/type/formInput.type';
import { getError } from '@/utils/getError';
import React, { useMemo, useState } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Container } from './Container';
import { ErrorMessage } from './ErrorMessage';

type FormInputOnChange = (
  e: React.ChangeEvent<HTMLInputElement> | string
) => void;

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
    const Component = React.forwardRef<HTMLInputElement, InputElementProps>(
      (
        { maskProps, onChange, onKeyDown, onFocus, required, ...props },
        ref
      ) => {
        if (maskProps?.mask) {
          return (
            <IMaskInput
              inputRef={ref}
              onAccept={onChange}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              required={required}
              autoComplete="off"
              name={props.name}
              {...maskProps}
              {...props}
            />
          );
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
  const renderInput = (field?: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
    ref: any;
    name?: string;
  }) => {
    // Handler para mudança
    const handleChange = (newValue: any) => {
      const processedValue =
        maskProps?.mask && typeof newValue === 'string'
          ? newValue
          : maskProps?.mask && newValue?.target
          ? newValue.target.value
          : newValue;

      if (field?.onChange) {
        field.onChange(processedValue);
      } else {
        setInternalValue(processedValue);
      }

      if (onChange) {
        if (maskProps?.mask) {
          (onChange as FormInputOnChange)(processedValue);
        } else {
          const syntheticEvent = {
            target: { value: processedValue, name: name.toString() },
            currentTarget: { value: processedValue, name: name.toString() },
          } as React.ChangeEvent<HTMLInputElement>;
          (onChange as FormInputOnChange)(syntheticEvent);
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }
    };

    return (
      <MemoInputElement
        ref={field?.ref}
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
      setValue(name, '' as any, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (!control || noControl) {
      setInternalValue('');
    }
    if (onChange) {
      if (maskProps?.mask) {
        (onChange as FormInputOnChange)('' as any);
      } else {
        const syntheticEvent = {
          target: { value: '', name: name.toString() },
          currentTarget: { value: '', name: name.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        (onChange as FormInputOnChange)(syntheticEvent);
      }
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

type InputElementProps = React.InputHTMLAttributes<HTMLInputElement> & {
  maskProps?: any;
  onChange: (value: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const ClearButton = ({ value, onClear }: { value: any; onClear: () => void }) =>
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
