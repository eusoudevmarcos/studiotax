import styles from '../styles/Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1 className={styles.title}>
          Economia tributária para o comércio
        </h1>
        <p className={styles.subtitle}>
          Reduzimos impostos e aumentamos a lucratividade de bares, restaurantes,
          cafés, mercados e açougues.
        </p>
        <a
          href="https://wa.me/55SEUNUMERO"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Fale Conosco
        </a>
      </div>
    </section>
  )
}
