import React from "react";

const Maintenance = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh", // Ocupa a altura total da tela
        backgroundColor: "#FFFFFF", // Fundo branco
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "100px",
          lineHeight: "1",
          marginBottom: "30px",
          color: "#000000",
        }}
      >
        <span role="img" aria-label="Aviso de Manutenção">
          ⚙️⚠️🔧
        </span>
      </div>

      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#000000",
          margin: 0,
          lineHeight: "1.2",
        }}
      >
        página em manutenção
      </h1>
    </div>
  );
};

export default Maintenance;
