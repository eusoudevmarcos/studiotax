// src/components/input/FormTextarea.tsx
import { getError } from '@/utils/getError';
import { TextareaHTMLAttributes } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { Container } from './Container';
import { ErrorMessage } from './ErrorMessage';

type FormTextareaProps<T extends FieldValues = any> = {
  name: string;
  label?: string;
  placeholder?: string;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    classNameContainer?: string;
  };
  control?: any;
  errors?: any;
  noControl?: boolean;
};

export function FormTextarea<T extends FieldValues = any>({
  name,
  label,
  placeholder,
  textareaProps,
  control: externalControl,
  errors: externalErrors,
  noControl = false,
}: FormTextareaProps<T>) {
  const formContext = useFormContext<T>();
  const control = externalControl || formContext?.control;
  const errors = externalErrors || formContext?.formState?.errors;
  const errorMessage = getError(errors, name);
  const { classNameContainer, ...otherTextareaProps } = textareaProps || {};
  const id = otherTextareaProps.id || name;

  // For watching/changing value externally if needed (similar to FormInput)
  const setValue = formContext?.setValue;
  const watch = formContext?.watch;
  // Fix: assert generic argument on watch so the name is a valid path
  const watchValue = watch ? watch(name as any) : undefined;

  const buildTextareaClasses = (
    errorMessage: string | null,
    customClassName?: string
  ) => {
    const base =
      'shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline transition-all duration-200 disabled:opacity-90 focus:border-primary placeholder:text-md';
    const errorClass = errorMessage ? 'border-red-500' : '';
    return [base, errorClass, customClassName].filter(Boolean).join(' ');
  };

  const textareaClassName = buildTextareaClasses(
    errorMessage ?? null,
    otherTextareaProps.className
  );

  const renderTextarea = (field?: {
    value: any;
    onChange: (val: any) => void;
    onBlur: () => void;
    ref: any;
  }) => (
    <textarea
      id={id}
      ref={field?.ref}
      placeholder={placeholder}
      className={textareaClassName}
      value={field ? field.value ?? '' : watchValue ?? ''}
      rows={4}
      onChange={e =>
        field?.onChange ? field.onChange(e.target.value) : undefined
      }
      onBlur={field?.onBlur}
      {...otherTextareaProps}
    />
  );

  return (
    <Container label={label} className={classNameContainer} id={id}>
      <div className="relative">
        {control && !noControl ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => renderTextarea(field)}
          />
        ) : (
          renderTextarea()
        )}
        <ErrorMessage message={errorMessage ?? null} />
      </div>
    </Container>
  );
}
