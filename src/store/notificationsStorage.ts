import type { Notification, NotificationTone } from '../types/notification'

/**
 * Persistência das notificações. Mesmo padrão de `ticketsStorage.ts`: dados em
 * memória, espelhados no localStorage para sobreviverem a um refresh.
 */

const STORAGE_KEY = 'smartdesk:notifications'

/** Quantidade máxima de notificações mantidas — evita crescimento ilimitado. */
const MAX_NOTIFICATIONS = 20

const NOTIFICATION_TONES: NotificationTone[] = ['info', 'warning', 'success']

function isNotificationTone(value: unknown): value is NotificationTone {
  return typeof value === 'string' && NOTIFICATION_TONES.includes(value as NotificationTone)
}

function isNotification(value: unknown): value is Notification {
  if (typeof value !== 'object' || value === null) return false
  const notification = value as Record<string, unknown>
  return (
    typeof notification.id === 'string' &&
    typeof notification.message === 'string' &&
    typeof notification.createdAt === 'string' &&
    typeof notification.read === 'boolean' &&
    isNotificationTone(notification.tone)
  )
}

export function loadNotifications(): Notification[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isNotification)
  } catch {
    return []
  }
}

export function saveNotifications(notifications: Notification[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)))
  } catch {
    // Sem localStorage disponível: a aplicação segue funcionando apenas em memória.
  }
}
