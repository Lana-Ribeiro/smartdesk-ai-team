import type { Notification, NotificationTone } from '../types/notification'
import { formatRelativeTime } from '../lib/formatRelativeTime'
import styles from './NotificationPanel.module.css'

const DOT_CLASS_BY_TONE: Record<NotificationTone, string> = {
  info: styles.dotInfo,
  warning: styles.dotWarning,
  success: styles.dotSuccess,
}

export function NotificationPanel({ notifications }: { notifications: Notification[] }) {
  return (
    <div className={styles.panel} role="menu" aria-label="Notificações">
      <span className={styles.heading}>🔔 Notificações</span>

      {notifications.length === 0 ? (
        <p className={styles.empty}>Nenhuma notificação por aqui.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((notification) => (
            <li key={notification.id} className={styles.item}>
              <span className={`${styles.dot} ${DOT_CLASS_BY_TONE[notification.tone]}`} aria-hidden="true" />
              <div className={styles.text}>
                <span className={styles.message}>{notification.message}</span>
                <span className={styles.time}>{formatRelativeTime(notification.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
