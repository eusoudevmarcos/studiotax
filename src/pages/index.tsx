import Hero from "../components/Hero";
import Services from "../components/Services";
import Sectors from "../components/Sectors";
import About from "../components/About";
import CTA from "../components/CTA";
import Maintenance from "../components/Maintenance";

export default function Page() {
  return (
    <>
      <style>
        {`
            .first-label{
              font-size: 1.4rem;
              padding: 98px 10px;
            }

            @media screen and (max-width: 1200px) {
            .first-label{
              padding: 60px 10px;
              font-size: 1rem
            }
          }
          `}
      </style>

      <Hero />

      <div className="bg-[#362404]">
        <div
          className="flex max-w-[1440px] mx-auto text-center first-label"
          style={{ color: "white", fontWeight: "bold" }}
        >
          Somos especialistas renomados com +15 anos de experiéncia no setor do
          Comércio, trabalhando tributagäo e ajustando seus produtos para näo
          pagar imposto indevido ou maior do que a legislagäo permite, nosso
          foco é sua economia
        </div>
      </div>

      <Sectors />

      <Services />

      <About />

      <div className="bg-[#303339]">
        <div
          className="flex max-w-[1000px] mx-auto text-center text-[18px]"
          style={{ color: "white", padding: "40px 10px" }}
        >
          A Studio Tax transforma a vida dos empresårios, ela facilita a
          previsäo tributåria e ainda corrige possiveis divergéncias antes que a
          Receita Federal faca uma autuaqäo. É uma medida de seguranqa e de
          prevenqäo para as empresas.
        </div>
      </div>

      {/* <Maintenance /> */}

      {/* <CTA /> */}
    </>
  );
}
