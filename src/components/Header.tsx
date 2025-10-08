import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className="bg-white border-b border-[#eee] fixed top-0 w-full z-[1000]"
      style={{ backgroundColor: "#fff", top: 0 }}
    >
      <div
        className="flex justify-between items-center max-w-[1440px] mx-auto"
        style={{ height: "60px", padding: "4px 20px" }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Studio Tax"
            className="text-[1.5rem] font-bold text-[var(--color-secondary)]"
            width={200}
            height={40}
          />
        </Link>
        <nav className="flex gap-4">
          <ul
            className="flex  list-none flex items-center m-0 p-0"
            style={{ gap: "12px" }}
          >
            <li>
              <a
                href="#sectors"
                className="font-medium transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#sectors"
                className="font-medium transition-colors duration-300"
              >
                Setores
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="font-medium transition-colors duration-300"
              >
                Serviços
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="font-medium transition-colors duration-300"
              >
                Quem somos?
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="font-medium transition-colors duration-300"
              >
                Sobre Nós
              </a>
            </li>
          </ul>
        </nav>
        <Link
          href="https://wa.me/556195524666"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-primary)] text-white rounded-md font-semibold transition-colors duration-300 hover:bg-[#b88e09]"
          style={{ padding: "10px 30px", borderRadius: "12px", color: "white" }}
        >
          Contato
        </Link>
      </div>
    </header>
  );
}
