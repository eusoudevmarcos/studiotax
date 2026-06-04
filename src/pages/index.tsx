import Head from "next/head";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  Calculator,
  ClipboardCheck,
  FileSearch,
  Landmark,
  LineChart,
  ReceiptText,
  Scale,
  ShieldCheck,
  Utensils,
  WalletCards,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/556195524666?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Studio%20Tax%20e%20quero%20uma%20an%C3%A1lise%20tribut%C3%A1ria.";

const metrics = [
  {
    value: "+15",
    label: "anos de experiência",
    detail: "atuação em revisão, recuperação e rotina fiscal",
  },
  {
    value: "+200",
    label: "clientes atendidos",
    detail: "empresas de comércio, serviços e alimentação",
  },
  {
    value: "30% a 70%",
    label: "potencial de redução",
    detail: "em cenários elegíveis após diagnóstico técnico",
  },
  {
    value: "Brasil",
    label: "atuação nacional",
    detail: "análise remota com implantação acompanhada",
  },
];

const specialties: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}> = [
  {
    title: "Apuração de verbas indenizatórias",
    badge: "INSS e folha",
    icon: ReceiptText,
    description:
      "Revisão técnica das bases trabalhistas e previdenciárias para identificar verbas que não deveriam compor recolhimentos.",
  },
  {
    title: "Alíquota zero de PIS e COFINS no REPORTO",
    badge: "Lucro Real",
    icon: Landmark,
    description:
      "Análise para empresas do Lucro Real que apuram pelas entradas e podem se enquadrar nos benefícios da Lei do REPORTO.",
  },
  {
    title: "Ajuste tributário de ICMS, PIS e COFINS",
    badge: "Comércio",
    icon: Calculator,
    description:
      "Correção de cadastros, NCMs, CSTs, regimes e aproveitamento de créditos para reduzir carga tributária no comércio.",
  },
  {
    title: "Bares e restaurantes",
    badge: "Alimentação",
    icon: Utensils,
    description:
      "Especialidade nacional em operações de alimentação, com foco em PIS, COFINS, ICMS e verbas indenizatórias.",
  },
  {
    title: "Revisão de INSS pago indevidamente",
    badge: "Recuperação",
    icon: WalletCards,
    description:
      "Levantamento dos últimos períodos para recuperar créditos de INSS sobre verbas indenizatórias pagas a maior.",
  },
  {
    title: "Viabilidade econômica e regime tributário",
    badge: "Estratégia",
    icon: LineChart,
    description:
      "Estudo para enquadrar a empresa em Simples Nacional, Lucro Presumido ou Lucro Real com visão fiscal e financeira.",
  },
  {
    title: "Societário completo",
    badge: "Jurídico",
    icon: Scale,
    description:
      "Abertura, alteração, reorganização e fechamento de empresas com suporte jurídico e contábil integrado.",
  },
  {
    title: "Contabilidade completa",
    badge: "Operação",
    icon: ClipboardCheck,
    description:
      "Rotina contábil, fiscal, folha de pagamento, obrigações acessórias, relatórios gerenciais e fechamento anual.",
  },
];

const sectorCards = [
  {
    name: "Bares e restaurantes",
    image: "/image/setor-bar.jpg",
    focus: "PIS, COFINS, ICMS e folha",
  },
  {
    name: "Cafés e lanchonetes",
    image: "/image/setor-cafe.jpg",
    focus: "classificação fiscal e rotina de entradas",
  },
  {
    name: "Mercados e varejo",
    image: "/image/setor-mercado.jpg",
    focus: "produto por produto, CST e créditos",
  },
  {
    name: "Casas de carnes",
    image: "/image/acougue.jpg",
    focus: "benefícios aplicáveis e redução operacional",
  },
];

const method = [
  {
    step: "01",
    title: "Diagnóstico documental",
    text: "Coletamos SPED, folha, notas, cadastro de produtos e demonstrativos para mapear risco e oportunidade.",
  },
  {
    step: "02",
    title: "Estudo técnico e jurídico",
    text: "Validamos enquadramento, legislação aplicável, créditos possíveis e impacto no fluxo de caixa.",
  },
  {
    step: "03",
    title: "Plano de recuperação e redução",
    text: "Priorizamos o que gera economia, crédito ou correção operacional com documentação de suporte.",
  },
  {
    step: "04",
    title: "Implantação acompanhada",
    text: "Ajustamos a rotina fiscal, contábil e de folha para que a economia continue depois da revisão.",
  },
];

export default function Page() {
  return (
    <>
      <Head>
        <title>
          Studio Tax Holding | Consultoria Tributária, Jurídica e Contabilidade
        </title>
        <meta
          name="description"
          content="Holding especializada em revisão tributária, recuperação de créditos, consultoria jurídica e contabilidade completa para empresas no Brasil."
        />
        <meta property="og:title" content="Studio Tax Holding" />
        <meta
          property="og:description"
          content="Consultoria tributária, jurídica e contabilidade completa para reduzir carga fiscal e recuperar créditos com segurança técnica."
        />
        <meta property="og:image" content="/studio-tax-logo.png" />
      </Head>

      <section
        id="home"
        className="relative isolate overflow-hidden bg-[#080808] text-white"
      >
        <Image
          src="/image/hero-commerce.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover opacity-[0.42]"
        />
        <Image
          src="/studio-tax-icon.png"
          alt=""
          width={2000}
          height={2000}
          priority
          className="pointer-events-none absolute bottom-[-18rem] right-[-14rem] z-0 w-[52rem] max-w-none opacity-[0.18] mix-blend-screen md:right-[-6rem] md:opacity-[0.24]"
        />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_48%,rgba(5,5,5,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-[linear-gradient(180deg,rgba(5,5,5,0)_0%,#080808_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-center px-5 py-8 md:px-8 md:py-10">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-md border border-[#d8a526]/45 bg-[#d8a526]/15 px-3 py-2 text-sm font-semibold text-[#f7d27a] shadow-[0_0_32px_rgba(216,165,38,0.14)]">
              Holding tributária, jurídica e contábil
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl 2xl:text-7xl">
              Pague o imposto certo. Recupere créditos com segurança.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#d7dde6] md:text-xl">
              A Studio Tax une revisão tributária, suporte jurídico e
              contabilidade completa para empresas que precisam reduzir carga
              fiscal, recuperar valores pagos indevidamente e manter a operação
              em conformidade.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-[#e0ae29] px-6 py-3 text-center text-base font-bold text-[#141008] shadow-[0_16px_36px_rgba(224,174,41,0.28)] transition hover:bg-[#f0bf3b] md:py-4"
              >
                Solicitar análise tributária
              </a>
              <a
                href="#especialidades"
                className="rounded-md border border-white/30 px-6 py-3 text-center text-base font-bold text-white transition hover:border-[#d8a526] hover:text-[#f7d27a] md:py-4"
              >
                Ver especialidades
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-sm font-semibold text-[#d7dde6]">
              {["ICMS", "PIS", "COFINS", "INSS", "REPORTO"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/15 bg-white/8 px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <dl className="mx-auto grid max-w-7xl gap-3 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group rounded-lg border border-[#e2e7ee] bg-[#f8fafc] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#d8a526]/60 hover:shadow-md"
            >
              <dt className="text-3xl font-bold text-[#a96e04]">
                {metric.value}
              </dt>
              <dd className="mt-1 text-sm font-bold leading-6 text-[#303946]">
                {metric.label}
              </dd>
              <dd className="mt-2 text-xs leading-5 text-[#6b7480]">
                {metric.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 md:px-8">
          <article className="relative overflow-hidden rounded-lg border border-[#e2e7ee] bg-white p-6 shadow-sm">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#fff5d8] text-[#a96e04]">
              <ShieldCheck size={24} />
            </div>
            <p className="text-sm font-bold text-[#a96e04]">Tributário</p>
            <h2 className="mt-3 text-2xl font-bold">
              Menos imposto indevido, mais previsibilidade.
            </h2>
            <p className="mt-4 leading-7 text-[#5d6673]">
              Revisamos ICMS, PIS, COFINS, INSS, créditos, cadastros e regimes
              para corrigir distorções e abrir oportunidades legítimas de
              economia.
            </p>
          </article>
          <article className="relative overflow-hidden rounded-lg border border-[#e2e7ee] bg-white p-6 shadow-sm">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#edf7f2] text-[#128c4a]">
              <Scale size={24} />
            </div>
            <p className="text-sm font-bold text-[#128c4a]">Jurídico</p>
            <h2 className="mt-3 text-2xl font-bold">
              Base legal antes da execução.
            </h2>
            <p className="mt-4 leading-7 text-[#5d6673]">
              O trabalho tributário é sustentado por análise jurídica para
              reduzir risco, organizar documentação e orientar decisões
              societárias.
            </p>
          </article>
          <article className="relative overflow-hidden rounded-lg border border-[#e2e7ee] bg-white p-6 shadow-sm">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#eef3ff] text-[#315a9d]">
              <Building2 size={24} />
            </div>
            <p className="text-sm font-bold text-[#315a9d]">Contábil</p>
            <h2 className="mt-3 text-2xl font-bold">
              Rotina completa, não só revisão pontual.
            </h2>
            <p className="mt-4 leading-7 text-[#5d6673]">
              Executamos folha, fiscal, contábil, fechamento, obrigações e
              relatórios para manter a economia fiscal dentro da operação
              mensal.
            </p>
          </article>
        </div>
      </section>

      <section id="especialidades" className="bg-[#f5f7fa] py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-[#a96e04]">
              Onde somos especialistas
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-[#171717] md:text-5xl">
              Serviços desenhados para recuperar crédito, reduzir carga e
              corrigir a operação.
            </h2>
            <p className="mt-5 leading-8 text-[#5d6673]">
              A economia depende de regime, documentos e validação técnica. Por
              isso, cada frente começa com diagnóstico antes de qualquer
              promessa de recuperação.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {specialties.map((item) => {
              const Icon = item.icon;

              return (
              <article
                key={item.title}
                className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#e2e7ee] transition hover:-translate-y-1 hover:shadow-lg hover:ring-[#d8a526]/60"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#f7f0df] text-[#a96e04] transition group-hover:bg-[#d8a526] group-hover:text-[#141008]">
                    <Icon size={22} />
                  </span>
                  <span className="rounded-md bg-[#f5f7fa] px-2.5 py-1 text-xs font-bold text-[#5d6673]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-7 text-[#171717]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6673]">
                  {item.description}
                </p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="setores" className="bg-[#111111] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[#f7d27a]">
              Foco nacional em alimentação e comércio
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Bares, restaurantes e varejo com tributação revisada produto por
              produto.
            </h2>
            <p className="mt-6 leading-8 text-[#d7dde6]">
              O maior ganho costuma estar nos detalhes: classificação fiscal,
              CST, tributação de entrada, benefício aplicável, folha e rotina
              de fechamento. É nesse ponto que a Studio Tax atua com
              profundidade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-[#d8a526] px-6 py-4 text-center font-bold text-[#141008] transition hover:bg-[#f0bf3b]"
              >
                Avaliar minha empresa
              </a>
              <a
                href="#metodo"
                className="rounded-md border border-white/30 px-6 py-4 text-center font-bold text-white transition hover:border-[#d8a526] hover:text-[#f7d27a]"
              >
                Como funciona
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sectorCards.map((sector) => (
              <article
                key={sector.name}
                className="group overflow-hidden rounded-lg border border-white/12 bg-white/8"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={sector.image}
                    alt={sector.name}
                    fill
                    sizes="(min-width: 1024px) 280px, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.72)_100%)]" />
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-lg font-bold">{sector.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#d7dde6]">
                      {sector.focus}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#fff5d8] text-[#a96e04]">
                <FileSearch size={24} />
              </div>
              <p className="text-sm font-bold text-[#a96e04]">
                Método Studio Tax
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
                Revisão com começo, evidência e implantação.
              </h2>
              <p className="mt-5 leading-8 text-[#5d6673]">
                A entrega combina apuração, parecer técnico, plano de uso dos
                créditos e ajuste da rotina para que o benefício não fique
                apenas no relatório.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {method.map((item) => (
                <article
                  key={item.step}
                  className="rounded-lg border border-[#e2e7ee] bg-[#fbfcfe] p-6 shadow-sm"
                >
                  <p className="inline-flex rounded-md bg-[#111111] px-3 py-2 text-sm font-bold text-[#f7d27a]">
                    etapa {item.step}
                  </p>
                  <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5d6673]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="holding" className="bg-[#eef2f6] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-lg bg-[#0b0b0b] p-8">
            <Image
              src="/studio-tax-logo.png"
              alt="Studio Tax"
              width={2172}
              height={724}
              className="h-auto w-full"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-[#a96e04]">A holding</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Uma estrutura única para tributário, jurídico e contabilidade.
            </h2>
            <p className="mt-5 leading-8 text-[#5d6673]">
              A Studio Tax foi posicionada para atender empresários que
              precisam de estratégia e execução no mesmo lugar. A consultoria
              encontra oportunidades, o jurídico sustenta o caminho e a
              contabilidade transforma a decisão em rotina.
            </p>
            <ul className="mt-7 space-y-3 text-[#303946]">
              <li className="flex gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                <BadgeCheck className="mt-0.5 shrink-0 text-[#128c4a]" size={20} />
                <span>
                Regularização, abertura, alteração e encerramento de empresas.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                <BadgeCheck className="mt-0.5 shrink-0 text-[#128c4a]" size={20} />
                <span>
                Folha de pagamento, fiscal, contábil, SPED e obrigações
                acessórias.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                <BadgeCheck className="mt-0.5 shrink-0 text-[#128c4a]" size={20} />
                <span>
                Planejamento para escolher o regime tributário mais eficiente
                antes de crescer.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contato" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <p className="text-sm font-bold text-[#a96e04]">Próximo passo</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
            Vamos analisar se a sua empresa está pagando imposto a maior?
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-8 text-[#5d6673]">
            Envie uma mensagem para iniciar o diagnóstico. A primeira conversa
            identifica regime, segmento, rotina fiscal e documentos necessários
            para medir a oportunidade.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-md bg-[#128c4a] px-7 py-4 text-base font-bold text-white transition hover:bg-[#0f7a41]"
          >
            Falar com a Studio Tax
          </a>
        </div>
      </section>
    </>
  );
}
