'use client';

import logo from '@/assets/logo.svg';
import { useAdmin } from '@/context/AuthContext';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** ativa o shield manualmente em desenvolvimento */
  forceDev?: boolean;
  /** duração do overlay preto (ms) */
  durationMs?: number;
};

export default function ScreenshotGuard({
  forceDev = false,
  durationMs = 1200,
}: Props) {
  const isAdmin = useAdmin(); // retorna boolean
  const [blocked, setBlocked] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const mouseLeaveTimeoutRef = useRef<number | null>(null);

  const isDev = process.env.NODE_ENV === 'development';
  const enabled = (!isDev || forceDev) && !isAdmin;

  useEffect(() => {
    if (!enabled) {
      setBlocked(false);
      return;
    }

    let devtoolsOpen = false;

    const tryClearClipboard = async () => {
      try {
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          await navigator.clipboard.writeText('');
        }
      } catch {
        /* ignore */
      }
    };

    const showOverlay = (timeout = durationMs) => {
      setBlocked(true);
      tryClearClipboard();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        // Só esconde se o DevTools não estiver ativo
        if (!devtoolsOpen) setBlocked(false);
      }, timeout);
    };

    /** 🔍 Detecção contínua de DevTools */
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const open = widthDiff > threshold || heightDiff > threshold;

      if (open && !devtoolsOpen) {
        devtoolsOpen = true;
        sessionStorage.setItem('devtools_open', 'true');
        setBlocked(true);
      } else if (!open && devtoolsOpen) {
        devtoolsOpen = false;
        sessionStorage.removeItem('devtools_open');
        setBlocked(false);
      }
    };

    // Restaura bloqueio se DevTools já estava aberto anteriormente
    if (sessionStorage.getItem('devtools_open') === 'true') {
      devtoolsOpen = true;
      setBlocked(true);
    }

    /** 🖱️ Eventos de bloqueio temporário */
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;

      if (code === 'PrintScreen' || key === 'printscreen') {
        e.preventDefault?.();
        showOverlay();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 's') {
        e.preventDefault?.();
        showOverlay();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && key === 'p') {
        e.preventDefault?.();
        showOverlay();
        return;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlocked(true);
      } else if (!devtoolsOpen) {
        setBlocked(false);
      }
    };

    const handleWindowBlur = () => setBlocked(true);
    const handleWindowFocus = () => {
      if (!devtoolsOpen) setBlocked(false);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        if (mouseLeaveTimeoutRef.current)
          clearTimeout(mouseLeaveTimeoutRef.current);
        mouseLeaveTimeoutRef.current = window.setTimeout(() => {
          setBlocked(true);
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimeoutRef.current)
        clearTimeout(mouseLeaveTimeoutRef.current);
      if (!devtoolsOpen) setBlocked(false);
    };

    const onContextMenu = (e: Event) => e.preventDefault();
    const onSelectStart = (e: Event) => e.preventDefault();
    const onDragStart = (e: Event) => e.preventDefault();
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      try {
        e.clipboardData?.setData('text/plain', '');
      } catch {}
    };

    /** Listeners */
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('copy', onCopy);

    const devtoolsInterval = window.setInterval(detectDevTools, 1000);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('copy', onCopy);
      window.clearInterval(devtoolsInterval);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (mouseLeaveTimeoutRef.current)
        window.clearTimeout(mouseLeaveTimeoutRef.current);
    };
  }, [enabled, durationMs]);

  // Admin nunca é bloqueado
  if (isAdmin) return null;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: 'black',
          opacity: blocked ? 1 : 0,
          transition: 'opacity 0s ease-in-out',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="flex flex-col items-center">
          <Image height={80} width={80} src={logo} alt="Logo Aura" />
          <span className="text-white text-2xl font-bold mt-2">
            PROTEÇÃO DE DADOS ATIVADO
          </span>
        </div>
      </div>
    </>
  );
}
