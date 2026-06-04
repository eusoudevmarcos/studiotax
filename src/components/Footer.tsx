import Image from "next/image";

const whatsappUrl =
  "https://wa.me/556195524666?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Studio%20Tax%20e%20quero%20uma%20an%C3%A1lise%20tribut%C3%A1ria.";

const navItems = [
  ["Especialidades", "/#especialidades"],
  ["Setores", "/#setores"],
  ["Método", "/#metodo"],
  ["Holding", "/#holding"],
];

export default function Footer() {
  return (
    <footer className="border-t border-[#252525] bg-[#080808] py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <Image
            src="/studio-tax-logo.png"
            alt="Studio Tax"
            width={2172}
            height={724}
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-md text-sm leading-7 text-[#c9d0da]">
            Holding especializada em consultoria tributária, jurídica e
            contabilidade completa para empresas em todo o Brasil.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#f7d27a]">Sessões</h3>
          <div className="mt-4 grid gap-2 text-sm text-[#c9d0da]">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#f7d27a]">Contato</h3>
          <p className="mt-4 text-sm text-[#c9d0da]">
            WhatsApp: +55 61 9552-4666
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-md border border-white/25 px-4 py-3 text-sm font-bold transition hover:border-[#d8a526] hover:text-[#f7d27a]"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-5 text-xs text-[#8d96a3] md:px-8">
        © 2026 Studio Tax. Todos os direitos reservados.
      </div>
    </footer>
  );
}
