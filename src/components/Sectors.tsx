import Image from "next/image";
import { useState } from "react";

export default function Sectors() {
  const sectors = [
    { name: "Bares e Restaurantes", img: "image/setor-bar.jpg" },
    { name: "Lanchonetes e Cafés", img: "image/setor-cafe.jpg" },
    { name: "Mercados", img: "image/setor-mercado.jpg" },
    { name: "Casas de Carnes", img: "image/acougue.jpg" },
  ];

  // Inline styles converted from Sectors.module.css
  const sectionStyle: React.CSSProperties = {
    padding: "10% 4%",
    background: "white",
    textAlign: "center",
    margin: "0 auto",
    maxWidth: "1420px",
    borderRadius: "16px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0",
    color: "var(--color-secondary)",
  };

  const subtitleStyle: React.CSSProperties = {
    color: "var(--color-primary)",
    marginBottom: "40px",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--color-bg)",
    borderRadius: "8px",
    transition: "0.3s",
    backgroundColor: "var(--color-bg2)",
    paddingBottom: "14px",
    cursor: "pointer",
    color: "white",
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderTopRightRadius: "6px",
    borderTopLeftRadius: "6px",
    marginBottom: "1rem",
  };

  const pStyle: React.CSSProperties = {
    fontWeight: 600,
  };

  // To handle hover, we use React state
  const [hovered, setHovered] = useState<number | null>(null);

  const cards = [
    {
      title: "+15",
      subtitle: "Anos de Experiéncia",
    },
    {
      title: "+ 200",
      subtitle: "Clientes Atendidos",
    },
    {
      title: "Milhöes",
      subtitle: "Economia Gerada",
    },
  ];

  return (
    <section id="sectors" style={sectionStyle}>
      <h2 style={titleStyle}>Setores que Atendemos</h2>
      <h3 style={subtitleStyle}>Somo especialista em</h3>
      <div style={gridStyle}>
        {sectors.map((sector, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              ...(hovered === i ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <Image src={sector.img} alt={sector.name} style={imgStyle} />
            <p style={pStyle}>{sector.name}</p>
          </div>
        ))}
      </div>

      <p
        className="text-[#545454] max-w-[1129px] text-center"
        style={{ fontWeight: "bold" }}
      >
        Somos especialistas em consultoria tributåria, ajudando bares,
        restaurantest lanchonetes, cafés, mercados e aqougues a reduzir impostos
        de forma legal, transparente e eficaz.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          margin: "48px 0",
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "24px 32px",
              maxWidth: "205px",
              width: "100%",
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                color: "#D1A00A",
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                color: "#545454",
                margin: "12px 0 0 0",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
