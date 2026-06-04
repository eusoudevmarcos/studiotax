import Head from "next/head";
import Image from "next/image";

const whatsappUrl =
  "https://wa.me/556195524666?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Studio%20Tax%20e%20quero%20uma%20an%C3%A1lise%20tribut%C3%A1ria.";

const metrics = [
  ["+15", "anos de experiência"],
  ["+200", "clientes atendidos"],
  ["30% a 70%", "potencial de redução em cenários elegíveis"],
  ["Brasil", "atuação nacional"],
];

const specialties = [
  {
    title: "Apuração de verbas indenizatórias",
    description:
      "Revisão técnica das bases trabalhistas e previdenciárias para identificar verbas que não deveriam compor recolhimentos.",
  },
  {
    title: "Alíquota zero de PIS e COFINS no REPORTO",
    description:
      "Análise para empresas do Lucro Real que apuram pelas entradas e podem se enquadrar nos benefícios da Lei do REPORTO.",
  },
  {
    title: "Ajuste tributário de ICMS, PIS e COFINS",
    description:
      "Correção de cadastros, NCMs, CSTs, regimes e aproveitamento de créditos para reduzir carga tributária no comércio.",
  },
  {
    title: "Bares e restaurantes",
    description:
      "Especialidade nacional em operações de alimentação, com foco em PIS, COFINS, ICMS e verbas indenizatórias.",
  },
  {
    title: "Revisão de INSS pago indevidamente",
    description:
      "Levantamento dos últimos períodos para recuperar créditos de INSS sobre verbas indenizatórias pagas a maior.",
  },
  {
    title: "Viabilidade econômica e regime tributário",
    description:
      "Estudo para enquadrar a empresa em Simples Nacional, Lucro Presumido ou Lucro Real com visão fiscal e financeira.",
  },
  {
    title: "Societário completo",
    description:
      "Abertura, alteração, reorganização e fechamento de empresas com suporte jurídico e contábil integrado.",
  },
  {
    title: "Contabilidade completa",
    description:
      "Rotina contábil, fiscal, folha de pagamento, obrigações acessórias, relatórios gerenciais e fechamento anual.",
  },
];

const sectors = [
  "Bares",
  "Restaurantes",
  "Lanchonetes",
  "Cafés",
  "Mercados",
  "Casas de carnes",
  "Comércio varejista",
  "Empresas no Lucro Real",
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
          src="/studio-tax-icon.png"
          alt=""
          width={2000}
          height={2000}
          priority
          className="pointer-events-none absolute bottom-[-18rem] right-[-14rem] z-0 w-[52rem] max-w-none opacity-20 md:right-[-6rem] md:opacity-28"
        />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0.96)_48%,rgba(8,8,8,0.62)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-center px-5 py-8 md:px-8 md:py-10">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-md border border-[#d8a526]/40 bg-[#d8a526]/10 px-3 py-2 text-sm font-semibold text-[#f7d27a]">
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
                className="rounded-md bg-[#d8a526] px-6 py-3 text-center text-base font-bold text-[#141008] transition hover:bg-[#f0bf3b] md:py-4"
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
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <dl className="mx-auto grid max-w-7xl gap-3 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {metrics.map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-[#e2e7ee] bg-[#f8fafc] p-4"
            >
              <dt className="text-2xl font-bold text-[#a96e04]">{value}</dt>
              <dd className="mt-1 text-sm leading-6 text-[#5d6673]">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 md:px-8">
          <article className="rounded-lg border border-[#e2e7ee] p-6">
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
          <article className="rounded-lg border border-[#e2e7ee] p-6">
            <p className="text-sm font-bold text-[#a96e04]">Jurídico</p>
            <h2 className="mt-3 text-2xl font-bold">
              Base legal antes da execução.
            </h2>
            <p className="mt-4 leading-7 text-[#5d6673]">
              O trabalho tributário é sustentado por análise jurídica para
              reduzir risco, organizar documentação e orientar decisões
              societárias.
            </p>
          </article>
          <article className="rounded-lg border border-[#e2e7ee] p-6">
            <p className="text-sm font-bold text-[#a96e04]">Contábil</p>
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
            {specialties.map((item) => (
              <article
                key={item.title}
                className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#e2e7ee]"
              >
                <h3 className="text-xl font-bold leading-7">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6673]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="setores" className="bg-[#111111] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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

          <div className="grid grid-cols-2 gap-3">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="rounded-lg border border-white/12 bg-white/6 p-4 text-sm font-bold"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
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
                  className="rounded-lg border border-[#e2e7ee] p-6"
                >
                  <p className="text-sm font-bold text-[#a96e04]">
                    {item.step}
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
              <li className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                Regularização, abertura, alteração e encerramento de empresas.
              </li>
              <li className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                Folha de pagamento, fiscal, contábil, SPED e obrigações
                acessórias.
              </li>
              <li className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-[#e2e7ee]">
                Planejamento para escolher o regime tributário mais eficiente
                antes de crescer.
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
