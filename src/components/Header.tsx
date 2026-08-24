import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.mark} aria-hidden="true">
          SD
        </span>
        <div className={styles.titles}>
          <span className={styles.brand}>SmartDesk</span>
          <span className={styles.tagline}>Gerenciamento de chamados</span>
        </div>
      </div>
    </header>
  )
}
