import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <style>
        {`
          .hero-container{
          }

          .hero-content{
            padding: 2% 10px;
          }

          .hero-title {
            font-size: 6rem;
            color: #CB8808;
            margin: 0;
          }
         
          .hero-subtitle1 {
            font-size: 4rem;
            color: #545454;
            margin: 0;
            font-weight: normal;
          }

          .hero-subtitle2 {
            color:  #545454;
            font-size: 2rem;
            lineHeight: 38px;
          }

          .hero-image{
            max-width: 600px;
            width: 100%;
            height: 100%;
          }

           @media screen and (max-width: 1200px) {
            .hero-container{
              flex-direction: column;
              align-items: center;
            }

            .hero-title {
              font-size: 4rem;
            }
            .hero-subtitle1 {
              font-size: 2rem;
            }
            .hero-subtitle2 {
              font-size: 1.2rem;
            lineHeight: 20px;
            }

            .hero-content{
              padding: 2% 10px;
            }
          }
        `}
      </style>
      <section
        id="home"
        className="mx-auto max-w-[1440px] flex justify-center items-end hero-container"
        style={{ marginTop: "0px" }}
      >
        <div className="hero-content">
          <div className="max-w-[750px]">
            <h1 className="hero-title">
              Studio <span className="text-[var(--color-secondary)]">Tax</span>
            </h1>

            <h2 className="hero-subtitle1">
              Inteligência Juridica e Tributária para te servir
            </h2>
            <h3 className="hero-subtitle2" style={{ fontWeight: "normal" }}>
              Temos a solução mais assertiva do mercado para você pagar menos
              impostos e o melhor trabalho de recuperação fiscal
            </h3>
          </div>

          <Link
            href="https://wa.me/556195524666"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#CA8908] text-[32px] flex items-center justify-center max-w-[484px]"
            style={{
              height: "80px",
              borderRadius: "12px",
              color: "white",
              marginTop: "100px",
              marginBottom: "100px",
            }}
          >
            clique para saber mais
          </Link>
        </div>

        <Image
          src="/image/executivo.png"
          width={500}
          height={500}
          alt="executivo"
          className="hero-image"
        />
      </section>
    </>
  );
}
