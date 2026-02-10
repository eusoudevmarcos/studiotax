/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/utils/AutocompletePopover.tsx
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export type AutocompletePopoverProps<TSelected = any> = {
  // Elemento de referência (container do input) para ancoragem e dimensionamento
  anchorRef: React.RefObject<HTMLElement>;
  // Controla visibilidade. Se omitido, abre quando houver children
  isOpen?: boolean;
  // Fecha o popover (ESC, clique fora, seleção, etc.)
  onRequestClose?: () => void;
  // Conteúdo de itens renderizado pelo pai
  children: React.ReactNode;
  // Classe externa do container do popover
  classNameContainer?: string;
  // Classe do conteúdo rolável interno
  classNameContent?: string;
  // Carregamento incremental quando atinge o fim do scroll
  searchMore?: () => void;
  // Dado atualmente selecionado (opcional, sem acoplamento de tipos)
  currentSelected?: TSelected;
  // Fecha automaticamente ao clicar em um item (default: true)
  closeOnSelect?: boolean;
  // Altura máxima desejada
  maxHeight?: number; // default 240
  // Largura mínima opcional (senão usa a largura do anchor)
  minWidth?: number;
};

const getDocumentElement = () =>
  typeof document !== 'undefined' ? document.documentElement : null;

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const AutocompletePopover = <TSelected,>({
  anchorRef,
  isOpen,
  onRequestClose,
  children,
  classNameContainer = '',
  classNameContent = '',
  searchMore,
  currentSelected,
  closeOnSelect = true,
  maxHeight = 240,
  minWidth,
}: AutocompletePopoverProps<TSelected>) => {
  const portalContainerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [computedOpen, setComputedOpen] = useState(false);
  const [style, setStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    placement: 'top' | 'bottom';
  } | null>(null);

  const effectiveOpen =
    isOpen ?? (React.Children.count(children) > 0 && computedOpen);

  // Monta portal
  useEffect(() => {
    portalContainerRef.current = document.body;
    setMounted(true);
    return () => {
      portalContainerRef.current = null;
    };
  }, []);

  // Abre automaticamente quando há conteúdo
  useEffect(() => {
    if (isOpen === undefined) {
      const hasContent = React.Children.count(children) > 0;
      setComputedOpen(hasContent);
    }
  }, [children, isOpen]);

  const computePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const docEl = getDocumentElement();
    if (!docEl) return;

    const viewportHeight = window.innerHeight || docEl.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const desiredHeight = Math.min(
      maxHeight,
      Math.max(160, Math.floor(viewportHeight * 0.5))
    );

    let placement: 'top' | 'bottom' = 'bottom';
    let height = Math.min(desiredHeight, spaceBelow - 8);
    if (height < 160 && spaceAbove > spaceBelow) {
      placement = 'top';
      height = Math.min(desiredHeight, spaceAbove - 8);
    }
    if (height < 120) {
      // fallback para pelo menos 120px
      height = Math.max(
        120,
        Math.min(desiredHeight, Math.max(spaceBelow, spaceAbove) - 8)
      );
      placement = spaceAbove > spaceBelow ? 'top' : 'bottom';
    }

    const left = Math.max(8, rect.left);
    const width = Math.max(minWidth ?? rect.width, 200);
    const top =
      placement === 'bottom'
        ? rect.bottom + window.scrollY
        : rect.top + window.scrollY - height;

    // Limitar dentro da viewport na horizontal
    const maxLeft = (window.innerWidth || docEl.clientWidth) - width - 8;
    const safeLeft = Math.min(left, Math.max(8, maxLeft));

    setStyle({ top, left: safeLeft, width, height, placement });
  }, [anchorRef, maxHeight, minWidth]);

  useIsomorphicLayoutEffect(() => {
    if (!effectiveOpen) return;
    computePosition();
  }, [effectiveOpen, computePosition, children]);

  useEffect(() => {
    if (!effectiveOpen) return;
    const handlers = [
      ['scroll', computePosition, true],
      ['resize', computePosition, true],
    ] as const;
    handlers.forEach(([evt, fn]) =>
      window.addEventListener(evt, fn as any, { passive: true })
    );
    return () =>
      handlers.forEach(([evt, fn]) =>
        window.removeEventListener(evt, fn as any)
      );
  }, [effectiveOpen, computePosition]);

  // Fechar com ESC e clique fora
  useEffect(() => {
    if (!effectiveOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose?.();
    };
    const onDocClick = (e: MouseEvent) => {
      const anchor = anchorRef.current;
      const content = contentRef.current;
      if (!content) return;
      if (content.contains(e.target as Node)) return;
      if (anchor && anchor.contains(e.target as Node)) return;
      onRequestClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDocClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDocClick);
    };
  }, [effectiveOpen, onRequestClose, anchorRef]);

  // Delegação para fechar ao selecionar qualquer item
  const onContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnSelect) return;
      // Fecha após breve atraso para permitir handlers do item
      setTimeout(() => onRequestClose?.(), 0);
    },
    [closeOnSelect, onRequestClose]
  );

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!searchMore) return;
      const target = e.currentTarget;
      const threshold = 32; // px
      const nearBottom =
        target.scrollTop + target.clientHeight >=
        target.scrollHeight - threshold;
      if (nearBottom) searchMore();
    },
    [searchMore]
  );

  if (!mounted || !portalContainerRef.current || !effectiveOpen || !style)
    return null;

  const containerCls =
    `absolute bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-[9999] ${classNameContainer}`.trim();
  const contentCls = `overflow-auto ${classNameContent}`.trim();

  return createPortal(
    <div
      ref={contentRef}
      className={containerCls}
      style={{
        top: style.top,
        left: style.left,
        width: style.width,
        // height: style.height,
        position: 'absolute',
      }}
      role="listbox"
      onClick={onContentClick}
      onScroll={onScroll}
    >
      <div className={contentCls}>{children}</div>
    </div>,
    portalContainerRef.current
  );
};

export default AutocompletePopover;
