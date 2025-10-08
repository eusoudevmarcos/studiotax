import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Helper to check if the current hash matches the nav item
  const getActiveHash = () => {
    if (typeof window !== "undefined") {
      return window.location.hash || "#home";
    }
    // fallback for SSR
    return router.asPath.split("#")[1]
      ? "#" + router.asPath.split("#")[1]
      : "#home";
  };

  // For SSR/CSR compatibility, use state to track hash
  const [activeHash, setActiveHash] = useState(getActiveHash());

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(getActiveHash());
    };
    window.addEventListener("hashchange", handleHashChange, false);
    return () =>
      window.removeEventListener("hashchange", handleHashChange, false);
  }, []);

  // Desktop nav items
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Setores", href: "#sectors" },
    { label: "Serviços", href: "#services" },
    { label: "Quem somos?", href: "#quemSomos" },
    { label: "Cases", href: "#cases" },
  ];

  // Mobile nav items
  const mobileNavItems = [
    { label: "Home", href: "#home" },
    { label: "Setores", href: "#sectors" },
    { label: "Serviços", href: "#services" },
    { label: "Quem somos?", href: "#quemSomos" },
    { label: "Sobre Nós", href: "#about" },
  ];

  return (
    <header
      className="bg-white border-b border-[#eee] fixed top-0 w-full z-[1000]"
      style={{ backgroundColor: "#fff", top: 0 }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav, .desktop-contact {
              display: none !important;
            }
            .mobile-menu-btn {
              display: flex !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-menu-btn, .mobile-nav {
              display: none !important;
            }
          }
          .mobile-nav {
            position: fixed;
            top: 60px;
            left: 0;
            width: 100vw;
            background: #fff;
            z-index: 1100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            animation: fadeInMenu 0.2s;
          }
          @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .mobile-nav-list {
            display: flex;
            flex-direction: column;
            list-style: none;
            margin: 0;
            padding: 1rem;
            gap: 0.5rem;
          }
          .nav-underline {
            border-bottom: 2px solid #F7A700;
            color: #F7A700 !important;
          }
        `}
      </style>
      <div
        className="flex justify-between items-center max-w-[1440px] mx-auto"
        style={{ height: "60px", padding: "4px 20px" }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Studio Tax"
            className="text-[1.5rem] font-bold text-[var(--color-secondary)]"
            width={160}
            height={40}
            priority
            style={{ width: "auto", height: "40px" }}
          />
        </Link>
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn flex items-center justify-center p-2 rounded-md border border-[#eee] bg-white md:hidden"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ display: "none" }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="#545454" />
            <rect y="11" width="24" height="2" rx="1" fill="#545454" />
            <rect y="17" width="24" height="2" rx="1" fill="#545454" />
          </svg>
        </button>
        {/* Desktop nav */}
        <nav className="desktop-nav flex gap-4">
          <ul
            className="flex list-none items-center m-0 p-0"
            style={{ gap: "12px" }}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`font-medium transition-colors duration-300${
                    activeHash === item.href ? " nav-underline" : ""
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="https://wa.me/556195524666"
          target="_blank"
          rel="noopener noreferrer"
          className="desktop-contact bg-[var(--color-primary)] text-white rounded-md font-semibold transition-colors duration-300 hover:bg-[#b88e09]"
          style={{ padding: "10px 30px", borderRadius: "12px", color: "white" }}
        >
          Contato
        </Link>
      </div>
      {/* Mobile nav menu */}
      {menuOpen && (
        <nav className="mobile-nav md:hidden">
          <ul className="mobile-nav-list">
            {mobileNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block py-3 px-2 font-medium transition-colors duration-300 border-b border-[#eee]${
                    activeHash === item.href ? " nav-underline" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="https://wa.me/556195524666"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[var(--color-primary)] text-white rounded-md font-semibold transition-colors duration-300 hover:bg-[#b88e09] text-center mt-2"
                style={{
                  padding: "12px 0",
                  borderRadius: "12px",
                  color: "white",
                }}
                onClick={() => setMenuOpen(false)}
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
