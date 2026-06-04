import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const whatsappUrl =
  "https://wa.me/556195524666?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Studio%20Tax%20e%20quero%20uma%20an%C3%A1lise%20tribut%C3%A1ria.";

const navItems = [
  { label: "Especialidades", href: "/#especialidades" },
  { label: "Setores", href: "/#setores" },
  { label: "Método", href: "/#metodo" },
  { label: "Holding", href: "/#holding" },
  { label: "Contato", href: "/#contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[1000] w-full border-b border-[#e4e8ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Studio Tax" className="flex items-center">
          <Image
            src="/studio-tax-logo.png"
            alt="Studio Tax"
            width={2172}
            height={724}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#2d3440] lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-[#a96e04]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-md px-4 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#f0f2f5]"
          >
            Login
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[#111111] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a96e04]"
          >
            Falar no WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d9dee7] text-[#171717] lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e4e8ee] bg-white px-5 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-bold text-[#2d3440] hover:bg-[#f5f7fa]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-md px-3 py-3 text-sm font-bold text-[#2d3440] hover:bg-[#f5f7fa]"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#111111] px-4 py-3 text-center text-sm font-bold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
