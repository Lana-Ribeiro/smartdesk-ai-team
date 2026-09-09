import { useEffect, useRef, useState } from 'react'
import { useTickets } from '../store/TicketsContext'
import { NotificationPanel } from './NotificationPanel'
import styles from './NotificationBell.module.css'

export function NotificationBell() {
  const { notifications, unreadNotificationsCount, markNotificationsRead } = useTickets()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleToggle() {
    setIsOpen((current) => {
      const next = !current
      if (next) markNotificationsRead()
      return next
    })
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.bell}
        onClick={handleToggle}
        aria-label="Notificações"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        🔔
        {unreadNotificationsCount > 0 && (
          <span className={styles.badge}>{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <NotificationPanel notifications={notifications} />
        </div>
      )}
    </div>
  )
}
