import React from 'react';

type CardTitleType =
  | React.ReactNode
  | { className?: string; label: React.ReactNode };

const Card: React.FC<{
  title?: CardTitleType;
  children: React.ReactNode;
  classNameContainer?: string;
  classNameContent?: string;
  noShadow?: boolean;
}> = ({ title, children, classNameContent, classNameContainer, noShadow }) => (
  <div
    className={`bg-white rounded-lg px-4 py-2 w-full relative ${
      classNameContainer ?? ''
    } ${!noShadow ? 'shadow-md' : ''}`}
  >
    {title &&
      (React.isValidElement(title) || typeof title !== 'string' ? (
        // Se for ReactNode ou objeto do tipo { className, label }
        typeof title === 'object' &&
        !React.isValidElement(title) &&
        title !== null &&
        'label' in title ? (
          <h3
            className={`text-md font-bold text-primary ${
              title.className ?? ''
            }`}
          >
            {title.label}
          </h3>
        ) : (
          // title é ReactNode (JSX, etc), mas não string ou objeto esperado
          <h3 className="text-md font-bold text-primary">{title}</h3>
        )
      ) : (
        // title é string simples
        <h3 className="text-md font-bold text-primary">{title}</h3>
      ))}
    <div className={`text-secondary  ${classNameContent ?? ''}`}>
      {children}
    </div>
  </div>
);

export default Card;
