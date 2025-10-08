import React from "react";

const StudioTaxFooter = () => {
  // Cor de fundo principal do rodapé, ajustada para ser um cinza escuro
  const bgColor = "#4A4A4A";
  // Cor do texto de corpo e links
  const textColor = "#CCCCCC";
  // Cor dos títulos
  const titleColor = "#FFFFFF";
  // Cor do rodapé inferior (copyright)
  const copyrightColor = "#A0A0A0";

  return (
    <footer
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "Arial, sans-serif",
        paddingTop: "40px",
        paddingBottom: "15px",
        fontSize: "14px",
      }}
    >
      {/* SEÇÃO PRINCIPAL (4 COLUNAS) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 20px",
          gap: "30px", // Espaçamento entre as colunas
        }}
      >
        {/* COLUNA 1: Studio Tax (Sobre) */}
        <div style={{ flexBasis: "25%", minWidth: "250px" }}>
          <p
            style={{
              color: titleColor,
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "15px",
              marginTop: 0,
            }}
          >
            Studio Tax
          </p>
          <p style={{ lineHeight: "1.6", margin: 0 }}>
            Plataforma e consultoria para economia tributária no varejo de
            alimentos. Otimizamos tributos para bares, restaurantes, cafés,
            mercados e açougues.
          </p>
        </div>

        {/* COLUNA 2: Sessões */}
        <div style={{ flexBasis: "25%", minWidth: "100px" }}>
          <p
            style={{
              color: titleColor,
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "15px",
              marginTop: 0,
            }}
          >
            Sessões
          </p>
          {["Setores", "Serviços", "Sobre", "Início"].map((item) => (
            <p key={item} style={{ margin: "8px 0", lineHeight: "1.2" }}>
              <a href="#" style={{ color: textColor, textDecoration: "none" }}>
                {item}
              </a>
            </p>
          ))}
        </div>

        {/* COLUNA 3: Contato */}
        <div style={{ flexBasis: "25%", minWidth: "150px" }}>
          <p
            style={{
              color: titleColor,
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "15px",
              marginTop: 0,
            }}
          >
            Contato
          </p>

          {/* Botão WhatsApp */}
          <a
            href="https://wa.me/556195524666"
            style={{
              backgroundColor: "#4CAF50",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            WhatsApp
          </a>

          {/* Links de Contato */}
          <p style={{ margin: "8px 0", lineHeight: "1.2" }}>E-mail</p>
          <p style={{ margin: "8px 0", lineHeight: "1.2" }}>Telefone</p>
        </div>

        {/* COLUNA 4: Redes sociais */}
        <div style={{ flexBasis: "25%", minWidth: "100px" }}>
          <p
            style={{
              color: titleColor,
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "15px",
              marginTop: 0,
            }}
          >
            Redes sociais
          </p>
          <p style={{ margin: "8px 0", lineHeight: "1.2" }}>
            <a
              href="#"
              style={{
                color: textColor,
                textDecoration: "none",
                marginRight: "15px",
              }}
            >
              Instagram
            </a>
            <a
              href="#"
              style={{
                color: textColor,
                textDecoration: "none",
                marginRight: "15px",
              }}
            >
              LinkedIn
            </a>
            <a href="#" style={{ color: textColor, textDecoration: "none" }}>
              Facebook
            </a>
          </p>
        </div>
      </div>

      {/* DIVISOR */}
      <div
        style={{
          borderTop: "1px solid #5C5C5C",
          margin: "30px auto 15px auto",
          maxWidth: "1000px",
          width: "calc(100% - 40px)", // Ajusta a largura do divisor
        }}
      ></div>

      {/* SEÇÃO INFERIOR (COPYRIGHT) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 20px",
          fontSize: "12px",
          color: copyrightColor,
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: "5px 0" }}>
          © 2025 Studio Tax. Todos os direitos reservados.
        </p>
        <p style={{ margin: "5px 0", textAlign: "right" }}>
          Código desta landing estruturado em NextJs 14 + CSS Modules.
        </p>
      </div>
    </footer>
  );
};

export default StudioTaxFooter;
