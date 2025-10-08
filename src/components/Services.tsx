import React, { useState } from "react";

export default function Services() {
  const services = [
    {
      title: "Contabilidade",
      description: `Oferecemos servicos de contabilidade
consultiva incluindo folha de
pagamento, apuraqäo de impostos e
fechamento anual contåbil com
balango, dre e informativos
mensais/anuais.`,
    },
    {
      title: "Planejamento Tributário",
      description: `Realizamos consultoria e ajuste de produtos para
ICMS/PIS/COFINS näo serem pagos de forma duplicada ou
paga indevidamente e evitando tributação, também
estudamos redugäo de sua classificaqäo tributåria no
quesito enquadramento do Simples Nacional, Lucro
Presumido ou Lucro Real, e sempre trabalhando de forma
que venham a reduzir e economizar até 90% dos valores
futuros`,
    },
    {
      title: "Consultoria Juridica",
      description: `Garanta a seguranqa juridica do seu
neg6cio. Oferecemos assessoria
especializada em Direito Tributårio,
Societårio e Contratual para prevenir
riscos, otimizar sua estrutura e
proteger seu patrimönio.`,
    },
    {
      title: "Consultoria CLT",
      description: `Oferecemos uma consultoria voltada
exclusivamente para CLT e E-social, os
melhores procedimentos de
administraqäo de pessoal(RH), visando
sempre a economia do cliente e o
menor problema com funcionårios e a
Legislaqäo que rege cada seguimento`,
    },
    {
      title: "Retificação Tributária",
      description: `Realizamos uma revisão dos impostos pagos ou
declarados nos últimos 5 anos para realizar o
aproveitamento de créditos tributários no pagamento
indevido ou a maior destes impostos, isso se aplica para
ICMS, PIS/COFINS, IRPJ/CSLL e INSS.
Após revisado, apurado o possível crédito, auxiliamos o
cliente no processo de solicitação ou utilização dos
créditos ou abatimento nos próximos tributos`,
    },
    {
      title: "Direcão fiscal",
      description: `Varredura em todas as empresas para
direcionar os possiveis ajustes de
regimes tributårios e enquadra-las de
forma que paguem o menor valor
possivel em tributos, enquadrando em
possiveis incentivos fiscais ou
projetando para o ano seguinte.`,
    },
  ];

  // To handle hover effect
  const [hovered, setHovered] = useState<number | null>(null);

  // Inline styles for grid and title
  const sectionStyle: React.CSSProperties = {
    padding: "80px 20px",
    background: "var(--color-bg2)",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "white",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    color: "#555",
  };

  return (
    <section id="services" style={sectionStyle}>
      <style lang="scss">
        {`
          .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            transition: 0.3s;
          }

          .card.hovered {
            transform: translateY(-5px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          }

          .grid{
            display: grid;
            grid-template-columns: 2fr 3fr 2fr;
            gap: 1.5rem;
            margin: 0 auto;
            max-width: 1200px; 

            @media screen and (max-width: 900px){
               grid-template-columns: repeat(1, 1fr);
            }
            @media screen and (min-width: 901px) and (max-width: 1250px) {
                 grid-template-columns: 2fr 2.5fr 2fr;
            }
          }
        `}
      </style>
      <div className="mx-auto max-w-[1200px]">
        <h2 style={titleStyle}>Nossos Serviços</h2>
        <div className="grid">
          {services.map((service, i) => (
            <div
              key={i}
              className={`card${hovered === i ? " hovered" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <h3 style={cardTitleStyle}>{service.title}</h3>
              <p style={cardDescStyle}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
