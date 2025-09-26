import styles from '../styles/About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <h2 className={styles.title}>Sobre Nós</h2>
        <p className={styles.text}>
          Somos especialistas em consultoria tributária, ajudando bares,
          restaurantes, lanchonetes, cafés, mercados e açougues a reduzir
          impostos de forma legal, transparente e eficaz.
        </p>
        <div className={styles.highlights}>
          <div>
            <h3>+15</h3>
            <p>Anos de Experiência</p>
          </div>
          <div>
            <h3>+200</h3>
            <p>Clientes Atendidos</p>
          </div>
          <div>
            <h3>Milhões</h3>
            <p>Economia Gerada</p>
          </div>
        </div>
      </div>
    </section>
  )
}

