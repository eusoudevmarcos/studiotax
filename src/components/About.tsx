import Image from "next/image";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div
      id="quemSomos"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <style lang="scss">
        {`
          .content{
            display: flex;
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 40px;
            padding: 0 20px;

            @media screen and (max-width: 900px) {
              flex-direction: column;
              text-align: center;
            }
          }
      `}
      </style>
      {/* Título Principal */}
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 400,
          color: "#333333",
          marginBottom: "10px",
        }}
      >
        Somos a{" "}
        <span style={{ color: "#F7A700", fontWeight: 600 }}>Studio Tax</span>
      </h1>

      {/* Subtítulo */}
      <p
        style={{
          fontSize: "24px",
          fontWeight: 500,
          color: "#555555",
          marginBottom: "40px",
        }}
      >
        Somos a melhor especialista em Revisão Tributária do País
      </p>

      {/* Conteúdo Principal (Texto e Imagem) */}
      <div className="content">
        {/* Bloco de Texto */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#666666",
              marginBottom: "20px",
            }}
          >
            Nossos objetivos säo focados em trazer resultados leveza no bolso
            dos clientes, e pagar apenas o que realmente cabe ao empresårio
            pagar, de forma justa e econömica.
          </p>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#666666",
              marginTop: "20px",
            }}
          >
            Nossa atuaqäo se då através da revisäo tributåria, que consiste em
            devolver impostos que foram pagos a maior indevidamente, para as
            empresas contribuintes.
          </p>
        </div>

        <div style={{ flex: 1, minWidth: "300px", textAlign: "right" }}>
          <Image
            width={200}
            height={200}
            src="/video.png" // Substitua pela URL da sua imagem (Home 4.jpg)
            alt="Dois colaboradores analisando dados em um computador"
            style={{
              width: "100%",
              maxWidth: "400px", // Ajuste para o tamanho da imagem na tela
              height: "auto",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
