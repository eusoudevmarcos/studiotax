import styles from "../styles/Sectors.module.css";

export default function Sectors() {
  const sectors = [
    { name: "Bares e Restaurantes", img: "image/setor-bar.jpg" },
    { name: "Lanchonetes e Cafés", img: "image/setor-cafe.jpg" },
    { name: "Mercados", img: "image/setor-mercado.jpg" },
    { name: "Açougues", img: "image/setor-acougue.jpg" },
  ];

  return (
    <section id="sectors" className={styles.sectors}>
      <h2 className={styles.title}>Setores que Atendemos</h2>
      <div className={styles.grid}>
        {sectors.map((sector, i) => (
          <div key={i} className={styles.card}>
            <img src={sector.img} alt={sector.name} />
            <p>{sector.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
