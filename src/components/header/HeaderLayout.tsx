import { usePlano, useUser } from "@/context/AuthContext";
import { getFirstLetter } from "@/utils/getFirstLetter";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BellIcon, SearchIcon } from "../icons"; // Importa os ícones

// Ícone de menu hamburguer simples (pode ser substituído por um SVG melhor)
const BurgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
);

interface HeaderLayoutProps {
  showBtnTakeIt?: boolean;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  showBtnTakeIt = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { usosDisponiveis, temPlanoComUso } = usePlano();
  const user = useUser();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white border-b border-[#eee] fixed top-0 w-full z-[1000]">
      <section className="flex justify-between items-center mx-auto max-w-[1440px] py-4 px-4 gap-2">
        <Link href="/atividades/agendas" className="flex items-center">
          <Image
            height={40}
            width={200}
            src="/logo.png"
            alt="Logo Aura"
            className="font-bold text-[var(--color-secondary)]"
          />
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          {/* Exibição de uso restante para clientes */}
          {temPlanoComUso && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="material-icons-outlined text-blue-600 text-sm">
                  credit_card
                </span>
                <span className="text-sm font-medium text-blue-800">
                  Usos restantes:
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {usosDisponiveis}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 ml-4">
            {showBtnTakeIt && (
              <Link
                href="/take-it"
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-[#b88e09]"
              >
                <SearchIcon />
                TAKE IT
              </Link>
            )}

            <button className="flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-gray-100 transition">
              <BellIcon />
            </button>

            <Link href={`/profile`} className="ml-2">
              <Image
                src={`https://placehold.co/40x40/8c53ff/ffffff?text=${getFirstLetter(
                  user?.nome || user?.razaoSocial || user?.email,
                )}`}
                width={40}
                height={40}
                alt="User Avatar"
                className="rounded-full border border-gray-200"
                unoptimized
              />
            </Link>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center">
          <button className="flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-gray-100 transition max-w-md">
            <BellIcon />
          </button>

          <button
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none ml-2"
          >
            <BurgerIcon />
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex justify-end md:hidden">
            <div className="bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col p-6 relative animate-slide-in-right">
              <button
                aria-label="Fechar menu"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
              <div className="flex flex-col gap-6 mt-8">
                {/* Exibição de uso restante para clientes - Mobile */}
                {temPlanoComUso && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="material-icons-outlined text-blue-600 text-sm">
                        credit_card
                      </span>
                      <span className="text-sm font-medium text-blue-800">
                        Usos restantes:
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {usosDisponiveis}
                    </span>
                  </div>
                )}

                {showBtnTakeIt && (
                  <Link
                    href="/take-it"
                    className="flex items-center gap-2 justify-center bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-[#b88e09]"
                  >
                    <SearchIcon />
                    TAKE IT
                  </Link>
                )}

                <Link
                  href={`/profile`}
                  className="flex items-center gap-2 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src={`https://placehold.co/40x40/8c53ff/ffffff?text=${getFirstLetter(
                      user?.nome || user?.razaoSocial || user?.email,
                    )}`}
                    width={40}
                    height={40}
                    alt="User Avatar"
                    className="rounded-full border border-gray-200"
                    unoptimized
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Animação para o menu mobile */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
};

export default HeaderLayout;
