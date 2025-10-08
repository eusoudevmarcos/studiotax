import React from "react";

const StudioTaxFooter = () => {
  // Cores
  const bgColor = "#4A4A4A";
  const textColor = "#CCCCCC";
  const titleColor = "#FFFFFF";
  const copyrightColor = "#A0A0A0";

  // Estilos responsivos inline para mobile-first
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 16px",
    gap: "28px",
  };

  const columnStyle: React.CSSProperties = {
    marginBottom: "0px",
    width: "100%",
  };

  const titleStyle: React.CSSProperties = {
    color: titleColor,
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "12px",
    marginTop: 0,
  };

  // Para responsividade, usamos um hook para detectar largura da tela
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Para desktop, exibe colunas lado a lado; para mobile, empilha
  const responsiveContainerStyle: React.CSSProperties = isMobile
    ? { ...containerStyle, flexDirection: "column", gap: "28px" }
    : {
        ...containerStyle,
        flexDirection: "row",
        gap: "30px",
        justifyContent: "space-between",
      };

  const responsiveCopyrightStyle: React.CSSProperties = isMobile
    ? {
        display: "block",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 16px",
        fontSize: "12px",
        color: copyrightColor,
        textAlign: "center",
      }
    : {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 20px",
        fontSize: "12px",
        color: copyrightColor,
        flexWrap: "wrap",
      };

  return (
    <footer
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "Arial, sans-serif",
        paddingTop: "32px",
        paddingBottom: "12px",
        fontSize: "14px",
      }}
    >
      {/* SEÇÃO PRINCIPAL (4 COLUNAS OU 4 BLOCOS EMPILHADOS NO MOBILE) */}
      <div style={responsiveContainerStyle}>
        {/* COLUNA 1: Studio Tax (Sobre) */}
        <div style={columnStyle}>
          <p style={titleStyle}>Studio Tax</p>
          <p style={{ lineHeight: "1.6", margin: 0 }}>
            Plataforma e consultoria para economia tributária no varejo de
            alimentos. Otimizamos tributos para bares, restaurantes, cafés,
            mercados e açougues.
          </p>
        </div>

        {/* COLUNA 2: Sessões */}
        <div style={columnStyle}>
          <p style={titleStyle}>Sessões</p>
          {["Setores", "Serviços", "Sobre", "Início"].map((item) => (
            <p key={item} style={{ margin: "8px 0", lineHeight: "1.2" }}>
              <a href="#" style={{ color: textColor, textDecoration: "none" }}>
                {item}
              </a>
            </p>
          ))}
        </div>

        {/* COLUNA 3: Contato */}
        <div style={columnStyle}>
          <p style={titleStyle}>Contato</p>
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
              marginTop: "0px",
            }}
          >
            WhatsApp
          </a>
          <p style={{ margin: "8px 0", lineHeight: "1.2" }}>E-mail</p>
          <p style={{ margin: "8px 0", lineHeight: "1.2" }}>Telefone</p>
        </div>

        {/* COLUNA 4: Redes sociais */}
        <div style={columnStyle}>
          <p style={titleStyle}>Redes sociais</p>
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
          margin: isMobile ? "24px auto 12px auto" : "30px auto 15px auto",
          maxWidth: "1000px",
          width: isMobile ? "calc(100% - 32px)" : "calc(100% - 40px)",
        }}
      ></div>

      {/* SEÇÃO INFERIOR (COPYRIGHT) */}
      <div style={responsiveCopyrightStyle}>
        <p style={{ margin: "5px 0" }}>
          © 2025 Studio Tax. Todos os direitos reservados.
        </p>
        <p
          style={
            isMobile
              ? { margin: "5px 0" }
              : { margin: "5px 0", textAlign: "right" }
          }
        >
          Código desta landing estruturado em NextJs 14 + CSS Modules.
        </p>
      </div>
    </footer>
  );
};

export default StudioTaxFooter;
