import { ContainerProps } from '@/type/formInput.type';

export const Container: React.FC<ContainerProps> = ({
  children,
  label,
  id,
  className,
}) => (
  <div className={`relative ${className || ''}`}>
    {label && (
      <label
        htmlFor={id}
        className="block text-gray-700 mb-1 font-semibold text-md"
      >
        {label}
      </label>
    )}
    {children}
  </div>
);
