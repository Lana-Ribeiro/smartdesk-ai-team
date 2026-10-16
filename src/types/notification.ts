export type NotificationTone = 'info' | 'warning' | 'success'

export interface Notification {
  id: string
  message: string
  tone: NotificationTone
  createdAt: string
  read: boolean
}
