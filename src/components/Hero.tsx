import Image from "next/image";

export default function Hero() {
  return (
    <section className="my-20 mx-auto max-w-[1440px] flex items-end">
      <div style={{ padding: "50px 10px" }}>
        <div className="max-w-[750px]">
          <h1 className="text-[#CB8808] text-[6rem]" style={{ margin: "0" }}>
            Studio <span className="text-[var(--color-secondary)]">Tax</span>
          </h1>

          <h1
            className="text-[48px] text-[var(--color-secondary)]"
            style={{ margin: "0", fontWeight: "normal" }}
          >
            Inteligência Juridica e Tributária para te servir
          </h1>
          <h2
            className="text-[var(--color-secondary)] text-[36px]"
            style={{ fontWeight: "normal", lineHeight: "38px" }}
          >
            Temos a solução mais assertiva do mercado para você pagar menos
            impostos e o melhor trabalho de recuperagäo fiscal
          </h2>
        </div>

        <a
          href="https://wa.me/55SEUNUMERO"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#CA8908] text-[32px] flex items-center justify-center max-w-[484px] "
          style={{
            height: "80px",
            borderRadius: "12px",
            color: "white",
            marginTop: "100px",
          }}
        >
          clique para saber mais
        </a>
      </div>

      <Image
        src="/image/executivo.png"
        width={500}
        height={500}
        alt="executivo"
        style={{ width: "30vw", height: "100%" }}
      />
    </section>
  );
}
