import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { NewTicketInput, Ticket, TicketStatus } from '../types/ticket'
import type { Notification, NotificationTone } from '../types/notification'
import { DEFAULT_STATUS } from '../lib/statuses'
import { loadTickets, saveTickets } from './ticketsStorage'
import { loadNotifications, saveNotifications } from './notificationsStorage'

interface TicketsContextValue {
  tickets: Ticket[]
  createTicket: (input: NewTicketInput) => Ticket
  updateTicketStatus: (id: string, status: TicketStatus) => void
  getTicket: (id: string) => Ticket | undefined
  notifications: Notification[]
  unreadNotificationsCount: number
  markNotificationsRead: () => void
}

const TicketsContext = createContext<TicketsContextValue | null>(null)

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets)
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications)

  useEffect(() => {
    saveTickets(tickets)
  }, [tickets])

  useEffect(() => {
    saveNotifications(notifications)
  }, [notifications])

  const addNotification = useCallback((message: string, tone: NotificationTone) => {
    const notification: Notification = {
      id: generateId('notification'),
      message,
      tone,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications((current) => [notification, ...current])
  }, [])

  const createTicket = useCallback(
    (input: NewTicketInput): Ticket => {
      const now = new Date().toISOString()
      const ticket: Ticket = {
        id: generateId('ticket'),
        title: input.title.trim(),
        description: input.description.trim(),
        status: DEFAULT_STATUS,
        priority: input.priority,
        createdAt: now,
        updatedAt: now,
      }

      // Mais recentes primeiro.
      setTickets((current) => [ticket, ...current])
      addNotification(`Chamado "${ticket.title}" criado`, 'info')
      return ticket
    },
    [addNotification],
  )

  const updateTicketStatus = useCallback(
    (id: string, status: TicketStatus) => {
      const target = tickets.find((ticket) => ticket.id === id)
      if (!target || target.status === status) return

      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === id ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket,
        ),
      )

      addNotification(
        status === 'CLOSED'
          ? `Chamado "${target.title}" foi concluído`
          : `Chamado "${target.title}" atualizado`,
        status === 'CLOSED' ? 'success' : 'warning',
      )
    },
    [tickets, addNotification],
  )

  const getTicket = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id),
    [tickets],
  )

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }, [])

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  const value = useMemo(
    () => ({
      tickets,
      createTicket,
      updateTicketStatus,
      getTicket,
      notifications,
      unreadNotificationsCount,
      markNotificationsRead,
    }),
    [
      tickets,
      createTicket,
      updateTicketStatus,
      getTicket,
      notifications,
      unreadNotificationsCount,
      markNotificationsRead,
    ],
  )

  return <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
}

export function useTickets(): TicketsContextValue {
  const context = useContext(TicketsContext)
  if (!context) {
    throw new Error('useTickets deve ser usado dentro de <TicketsProvider>')
  }
  return context
}
