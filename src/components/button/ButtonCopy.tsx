import { useEffect, useState } from 'react';
import { PrimaryButton } from './PrimaryButton';

export default function ButtonCopy({ value, className }: any) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 4000);
    }
  };

  // Adiciona animação de scale + opacity ao span flutuante
  useEffect(() => {
    let span: HTMLSpanElement | null = null;
    let animTimeout: NodeJS.Timeout | null = null;

    if (copiado) {
      span = document.createElement('span');
      span.className =
        'fixed left-1/2 -translate-x-1/2 bottom-8 z-50 text-primary px-4 py-2 rounded-lg shadow text font-medium pointer-events-none transition-all duration-500 opacity-0 scale-90';
      span.innerText = 'Copiado para a área de transferência!';

      document.body.appendChild(span);

      setTimeout(() => {
        if (span) {
          span.classList.remove('opacity-0', 'scale-90');
          span.classList.add('opacity-100', 'scale-105');
        }
      }, 16);

      animTimeout = setTimeout(() => {
        if (span) {
          span.classList.remove('opacity-100', 'scale-105');
          span.classList.add('opacity-0', 'scale-90');
        }
      }, 3600);
    }

    return () => {
      if (animTimeout) clearTimeout(animTimeout);
      if (span) {
        setTimeout(() => {
          if (span && document.body.contains(span)) {
            document.body.removeChild(span);
          }
        }, 500);
      }
    };
  }, [copiado]);

  return (
    <PrimaryButton
      title={copiado ? 'Copiado!' : 'Copiar'}
      className={`min-w-0 text-primary shrink-0 hover:scale-[1.04] p-1! md:p-2! ${className}`}
      onClick={handleCopy}
    >
      <span className="material-icons text-sm!">
        {copiado ? 'done' : 'content_copy'}
      </span>
    </PrimaryButton>
  );
}
