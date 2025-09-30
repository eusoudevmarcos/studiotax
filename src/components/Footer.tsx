import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.columns}>
          <div className={styles.col}>
            <h4 className={styles.heading}>Studio Tax</h4>
            <p className={styles.text}>
              Plataforma e consultoria para economia tributária no varejo de
              alimentos. Otimizamos tributos para bares, restaurantes, cafés,
              mercados e açougues.
            </p>
          </div>
          <nav className={styles.col} aria-label="Sessões da página">
            <h4 className={styles.heading}>Sessões</h4>
            <ul className={styles.list}>
              <li>
                <a className={styles.link} href="#sectors">
                  Setores
                </a>
              </li>
              <li>
                <a className={styles.link} href="#services">
                  Serviços
                </a>
              </li>
              <li>
                <a className={styles.link} href="#about">
                  Sobre
                </a>
              </li>
              <li>
                <a className={styles.link} href="#top">
                  Início
                </a>
              </li>
            </ul>
          </nav>
          <div className={styles.col}>
            <h4 className={styles.heading}>Contato</h4>
            <ul className={styles.list}>
              <li>
                <a
                  className={styles.button}
                  href="https://wa.me/55SEUNUMERO"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar no WhatsApp"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a className={styles.link} href="mailto:contato@studiotax.com">
                  E-mail
                </a>
              </li>
              <li>
                <a className={styles.link} href="tel:+550000000000">
                  Telefone
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4 className={styles.heading}>Redes sociais</h4>
            <ul className={styles.socials}>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Studio Tax. Todos os direitos
            reservados.
          </p>
          <p className={styles.meta}>
            Código desta landing estruturado em Next.js 14 + CSS Modules.
          </p>
        </div>
      </div>
    </footer>
  );
}
