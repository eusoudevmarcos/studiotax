import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { IMaskInputProps, ReactMaskProps } from 'react-imask';

export type MaskProps = Omit<
  IMaskInputProps<HTMLInputElement> &
    Partial<
      ReactMaskProps<HTMLInputElement, IMaskInputProps<HTMLInputElement>>
    >,
  'name' | 'value' | 'onChange' | 'onAccept' | 'ref' | 'inputRef'
> & {
  blocks?: Record<string, unknown>;
};

/** Handler de mudança: aceita evento nativo ou valor string (ex.: máscara) */
export type FormInputOnChange = (
  e: React.ChangeEvent<HTMLInputElement> | string
) => void;

export type FormInputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => void;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  classNameContainer?: string;
};

export type CommonProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  inputProps?: InputProps;
  maskProps?: MaskProps;
  label?: React.ReactNode | string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: FormInputOnChange;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  clear?: boolean;
  noControl?: boolean;
  onFocus?: FormInputOnFocus;
  required?: boolean;
};

export type FormInputProps<T extends FieldValues> = CommonProps<T> & {
  control?: Control<T>;
};

/** Objeto "field" do Controller (react-hook-form) para uso interno no FormInput */
export type FormInputControllerField = {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  ref: React.Ref<HTMLInputElement> | undefined;
  name?: string;
};

/** Props do elemento input interno (com ou sem máscara). onChange aceita string (máscara) ou evento (input nativo). */
export type InputElementProps = React.InputHTMLAttributes<HTMLInputElement> & {
  maskProps?: MaskProps;
  onChange: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: FormInputOnFocus;
  required?: boolean;
};

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
