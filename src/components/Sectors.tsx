import styles from '../styles/Sectors.module.css'

export default function Sectors() {
  const sectors = [
    { name: 'Bares e Restaurantes', img: '/setor-bar.jpg' },
    { name: 'Lanchonetes e Cafés', img: '/setor-cafe.jpg' },
    { name: 'Mercados', img: '/setor-mercado.jpg' },
    { name: 'Açougues', img: '/setor-acougue.jpg' },
  ]

  return (
    <section id="sectors" className={styles.sectors}>
      <div className="container">
        <h2 className={styles.title}>Setores que Atendemos</h2>
        <div className={styles.grid}>
          {sectors.map((sector, i) => (
            <div key={i} className={styles.card}>
              <img src={sector.img} alt={sector.name} />
              <p>{sector.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

