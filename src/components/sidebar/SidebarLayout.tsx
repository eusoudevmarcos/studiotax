import logo from '@/assets/auralogoh.svg';
import { onLogout, useUser } from '@/context/AuthContext';
import { getFirstLetter } from '@/utils/getFirstLetter';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, ListClosedIcon, ListIcon } from '../icons';
import { getNavItems } from './SidebarList';

interface SidebarProps {
  onToggleSidebar: (collapsed: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Toolbar = ({ collapsed, user }: any) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  // Refs para armazenar os timeouts
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para limpar todos os timeouts
  const clearAllTimeouts = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
  };

  // Função para mostrar o toolbar
  const showToolbarWithDelay = () => {
    clearAllTimeouts();
    setShowToolbar(true);
  };

  // Função para esconder o toolbar com delay
  const hideToolbarWithDelay = () => {
    clearAllTimeouts();
    hideTimeoutRef.current = setTimeout(() => {
      setShowToolbar(false);
    }, 1000); // 1000ms = 1 segundo
  };

  // Handlers para o botão
  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true);
    showToolbarWithDelay();
  };

  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false);
    if (!isToolbarHovered) {
      hideToolbarWithDelay();
    }
  };

  // Handlers para o toolbar
  const handleToolbarMouseEnter = () => {
    setIsToolbarHovered(true);
    clearAllTimeouts();
  };

  const handleToolbarMouseLeave = () => {
    setIsToolbarHovered(false);
    if (!isButtonHovered) {
      hideToolbarWithDelay();
    }
  };

  // Cleanup dos timeouts quando o componente desmontar
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-all duration-200 w-full ${
          collapsed ? 'justify-center' : ''
        }`}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        <Image
          height={40}
          width={40}
          src={`https://placehold.co/40x40/#d1a00a/ffffff?text=${getFirstLetter(
            user?.nome || user?.razaoSocial || user?.email
          )}`}
          alt="User Avatar"
          unoptimized
          className="rounded-full object-cover shrink-0"
        />
        <div
          className={`grow whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100 ml-2'
          }`}
        >
          <p className="text-sm font-medium truncate">
            {user?.nome || user?.razaoSocial}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <p className="text-xs text-gray-500 truncate">{user.tipo}</p>
        </div>
        {/* <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
            collapsed ? 'hidden' : 'block'
          }`}
        /> */}
      </button>

      {/* Toolbar flutuante */}
      <div
        onMouseEnter={handleToolbarMouseEnter}
        onMouseLeave={handleToolbarMouseLeave}
        className={`absolute top-1/2 -translate-y-1/2 flex-col gap-2 bg-white shadow-lg rounded-lg p-2 duration-300 z-50 border border-gray-100 min-w-[160px] 
                  ${collapsed ? 'right-[-170px]' : 'right-[-190px]'}
                  ${
                    showToolbar
                      ? 'opacity-100 visible pointer-events-auto transform scale-100'
                      : 'opacity-0 invisible pointer-events-none transform scale-95'
                  }`}
        style={{
          transition:
            'opacity 300ms ease-in-out, visibility 300ms ease-in-out, transform 300ms ease-in-out',
        }}
      >
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 transition"
        >
          <span className="material-icons-outlined">account_circle</span>
          Visualizar perfil
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700 transition"
        >
          <span className="material-icons-outlined">settings</span>
          Configurações
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-red-600 transition"
        >
          <span className="material-icons-outlined">logout</span>
          Sair
        </button>
      </div>
    </div>
  );
};

const SidebarLayout: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const user = useUser();
  // Sempre colapsa o menu ao trocar de rota
  // useEffect(() => {
  //   setCollapsed(true);
  // }, [router.pathname]);
  useEffect(() => {
    onToggleSidebar(collapsed);
  }, [collapsed, onToggleSidebar]);

  if (!user) return null;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden fixed top-24 left-2 h-[calc(90vh-2rem)] bg-white text-[#474747] md:flex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
          collapsed ? 'w-20 p-2 items-center' : 'w-64 p-2'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`cursor-pointer flex  w-full  items-center  bg-white p-2 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <div style={{ width: 50, height: 50, position: 'relative', overflow: 'hidden' }}>
              <Image
              fill
              src="/logo.png"
              alt="Logo Aura"
              style={{ objectFit: 'cover', objectPosition: 'left' }}
              sizes="1000px"
              />
            </div>
          )}
          <span className="material-icons-outlined h-6">
            {collapsed ? 'menu' : 'chevron_left'}
          </span>
        </button>
        {/* Navegação */}
        <nav className="grow flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <ul>
            {getNavItems(user).map(
              item =>
                item && (
                  <li key={item?.label}>
                    <Link
                      href={item?.href}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                        router.pathname === item.href ||
                        router.pathname.split('/')[1] ===
                          item.href.split('/')[1]
                          ? 'bg-[#f1eefe] text-[var(--color-primary)] shadow-md'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-black'
                      } ${collapsed ? 'justify-center px-3' : ''}`}
                    >
                      {item?.icon}
                      <span
                        className={`whitespace-nowrap overflow-hidden transition duration-100 ${
                          collapsed && 'hidden w-0'
                        }`}
                      >
                        {item?.label}
                      </span>
                    </Link>
                  </li>
                )
            )}
          </ul>
        </nav>
        <Toolbar collapsed={collapsed} user={user}></Toolbar>
      </aside>

      {/* Sidebar Mobile */}
      <div className="fixed top-24 left-2 h-[calc(90vh-2rem)] z-40 md:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute Dright-[-22px] top-30 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-50 border border-gray-200"
        >
          {collapsed ? <ListIcon /> : <ListClosedIcon />}
        </button>
        <aside
          className={`bg-white text-[#474747] h-[calc(90vh-2rem)] flex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
            collapsed ? 'w-0 p-0' : 'w-64 p-6'
          }`}
        >
          <nav className="grow flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            <ul>
              {getNavItems(user).map(item => (
                <li key={item?.label}>
                  <Link
                    href={item?.href ?? ''}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                      router.pathname === item.href ||
                      router.pathname.split('/')[1] === item.href
                        ? 'bg-[#f1eefe] text-[var(--color-primary)] shadow-md'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-black'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    {item?.icon}
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                        collapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}
                    >
                      {item?.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={`/profile`}
            className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Image
              height={40}
              width={40}
              src={`https://placehold.co/40x40/FFD700/000000?text=${getFirstLetter(
                user?.nome || user?.razaoSocial
              )}`}
              alt="User Avatar"
              unoptimized
              className="rounded-full object-cover shrink-0"
            />
            <div
              className={`grow whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                collapsed ? 'opacity-0 w-0' : 'opacity-100 ml-2'
              }`}
            >
              <p className="text-sm font-medium truncate">
                {user?.nome || user?.razaoSocial}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.tipo}</p>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                collapsed ? 'hidden' : 'block'
              }`}
            />
          </Link>
        </aside>
      </div>
    </>
  );
};

export default SidebarLayout;
