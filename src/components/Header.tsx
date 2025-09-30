import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.navbar}>
          <a href="/">
            <img
              src="/logo.png"
              alt="Studio Tax"
              className={styles.logo}
              width={200}
              height={40}
            />
          </a>
          <nav>
            <ul className={styles.menu}>
              <li>
                <a href="#sectors">Setores</a>
              </li>
              <li>
                <a href="#services">Serviços</a>
              </li>
              <li>
                <a href="#about">Sobre Nós</a>
              </li>
              <li>
                <a
                  href="https://wa.me/55SEUNUMERO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactBtn}
                >
                  Contato
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
