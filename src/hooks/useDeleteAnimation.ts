import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDeleteAnimationReturn {
  isItemAnimating: (itemId: string) => boolean;
  isAnimating: boolean;
  animatingItemId: string | null;
  startDeleteAnimation: (
    itemId: string,
    onComplete: () => Promise<void>
  ) => void;
  cancelAnimation: () => void;
}

/**
 * Hook reutilizável para gerenciar animações de exclusão com fade-out
 * 
 * @param animationDuration - Duração da animação em milissegundos (padrão: 2000ms)
 * @returns Objeto com funções e estados para gerenciar animações de exclusão
 * 
 * @example
 * const { isItemAnimating, startDeleteAnimation } = useDeleteAnimation();
 * 
 * const handleDelete = () => {
 *   startDeleteAnimation(itemId, async () => {
 *     await deleteItem(itemId);
 *     refreshData();
 *   });
 * };
 * 
 * // No componente:
 * <div className={isItemAnimating(item.id) ? 'delete-animating' : ''}>
 *   {item.name}
 * </div>
 */
export const useDeleteAnimation = (
  animationDuration: number = 2000
): UseDeleteAnimationReturn => {
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef<(() => Promise<void>) | null>(null);

  const isItemAnimating = useCallback(
    (itemId: string): boolean => {
      return animatingItemId === itemId;
    },
    [animatingItemId]
  );

  const startDeleteAnimation = useCallback(
    (itemId: string, onComplete: () => Promise<void>) => {
      // Cancelar animação anterior se houver
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Marcar item como sendo animado
      setAnimatingItemId(itemId);
      onCompleteRef.current = onComplete;

      // Após a duração da animação, executar a exclusão real
      timeoutRef.current = setTimeout(async () => {
        try {
          if (onCompleteRef.current) {
            await onCompleteRef.current();
          }
        } catch (error) {
          console.error('Erro ao executar exclusão:', error);
          // Em caso de erro, reverter a animação
          setAnimatingItemId(null);
        } finally {
          // Limpar estado após exclusão
          setAnimatingItemId(null);
          onCompleteRef.current = null;
        }
      }, animationDuration);
    },
    [animationDuration]
  );

  const cancelAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAnimatingItemId(null);
    onCompleteRef.current = null;
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isItemAnimating,
    isAnimating: animatingItemId !== null,
    animatingItemId,
    startDeleteAnimation,
    cancelAnimation,
  };
};
