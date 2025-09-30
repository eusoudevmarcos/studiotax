import styles from "../styles/CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.title}>
        Pronto para reduzir seus impostos e aumentar seus lucros?
      </h2>
      <p className={styles.subtitle}>
        Entre em contato agora mesmo e receba uma consultoria personalizada para
        o seu negócio.
      </p>
      <a
        href="https://wa.me/55SEUNUMERO"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaButton}
      >
        Fale no WhatsApp
      </a>
    </section>
  );
}
