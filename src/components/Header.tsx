import { NotificationBell } from './NotificationBell'
import styles from './Header.module.css'

export type AppView = 'tickets' | 'dashboard' | 'kanban'

interface HeaderProps {
  view: AppView
  onNavigate: (view: AppView) => void
}

export function Header({ view, onNavigate }: HeaderProps) {
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

        <nav className={styles.nav} aria-label="Navegação principal">
          <button
            type="button"
            className={`${styles.navButton} ${view === 'tickets' ? styles.navButtonActive : ''}`}
            aria-current={view === 'tickets' ? 'page' : undefined}
            onClick={() => onNavigate('tickets')}
          >
            Chamados
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${view === 'dashboard' ? styles.navButtonActive : ''}`}
            aria-current={view === 'dashboard' ? 'page' : undefined}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${view === 'kanban' ? styles.navButtonActive : ''}`}
            aria-current={view === 'kanban' ? 'page' : undefined}
            onClick={() => onNavigate('kanban')}
          >
            Kanban
          </button>
        </nav>

        <NotificationBell />
      </div>
    </header>
  )
}
