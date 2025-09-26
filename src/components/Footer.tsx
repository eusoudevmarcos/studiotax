import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>© {new Date().getFullYear()} Studio Tax. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
