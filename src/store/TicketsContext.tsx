import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { NewTicketInput, Ticket, TicketPriority, TicketStatus, TicketTeam } from '../types/ticket'
import type { Notification, NotificationTone } from '../types/notification'
import { DEFAULT_STATUS } from '../lib/statuses'
import { PRIORITY_LABELS } from '../lib/priorities'
import { TEAM_LABELS } from '../lib/teams'
import { loadTickets, saveTickets } from './ticketsStorage'
import { loadNotifications, saveNotifications } from './notificationsStorage'

export type LoadStatus = 'loading' | 'ready' | 'error'

interface TicketsContextValue {
  tickets: Ticket[]
  loadStatus: LoadStatus
  reload: () => void
  createTicket: (input: NewTicketInput) => Ticket
  updateTicketStatus: (id: string, status: TicketStatus) => void
  updateTicketPriority: (id: string, priority: TicketPriority) => void
  updateTicketAssignee: (id: string, assignee: string) => void
  updateTicketTeam: (id: string, team: TicketTeam | undefined) => void
  getTicket: (id: string) => Ticket | undefined
  notifications: Notification[]
  unreadNotificationsCount: number
  markNotificationsRead: () => void
}

const TicketsContext = createContext<TicketsContextValue | null>(null)

/** Flag opcional no localStorage para exercitar o estado de erro de carregamento. */
const SIMULATE_LOAD_ERROR_KEY = 'smartdesk:simulateLoadError'
const LOAD_DELAY_MS = 400

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications)

  // Carregamento assíncrono simulado: mantém a API do hook estável enquanto
  // permite estados reais de "carregando" e "erro".
  useEffect(() => {
    let cancelled = false
    setLoadStatus('loading')

    const timer = window.setTimeout(() => {
      if (cancelled) return
      try {
        if (window.localStorage.getItem(SIMULATE_LOAD_ERROR_KEY)) {
          throw new Error('Falha simulada ao carregar os chamados.')
        }
        setTickets(loadTickets())
        setLoadStatus('ready')
      } catch {
        setLoadStatus('error')
      }
    }, LOAD_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [reloadKey])

  // Só persiste depois que o carregamento terminou, para não sobrescrever o
  // storage com a lista vazia inicial.
  useEffect(() => {
    if (loadStatus === 'ready') saveTickets(tickets)
  }, [tickets, loadStatus])

  useEffect(() => {
    saveNotifications(notifications)
  }, [notifications])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

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
      const assignee = input.assignee?.trim()
      const ticket: Ticket = {
        id: generateId('ticket'),
        title: input.title.trim(),
        description: input.description.trim(),
        status: DEFAULT_STATUS,
        priority: input.priority,
        ...(input.team ? { team: input.team } : {}),
        ...(assignee ? { assignee } : {}),
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

  const patchTicket = useCallback(
    (id: string, patch: Partial<Ticket>, message: string, tone: NotificationTone) => {
      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === id ? { ...ticket, ...patch, updatedAt: new Date().toISOString() } : ticket,
        ),
      )
      addNotification(message, tone)
    },
    [addNotification],
  )

  const updateTicketStatus = useCallback(
    (id: string, status: TicketStatus) => {
      const target = tickets.find((ticket) => ticket.id === id)
      if (!target || target.status === status) return
      patchTicket(
        id,
        { status },
        status === 'CLOSED'
          ? `Chamado "${target.title}" foi concluído`
          : `Chamado "${target.title}" atualizado`,
        status === 'CLOSED' ? 'success' : 'warning',
      )
    },
    [tickets, patchTicket],
  )

  const updateTicketPriority = useCallback(
    (id: string, priority: TicketPriority) => {
      const target = tickets.find((ticket) => ticket.id === id)
      if (!target || target.priority === priority) return
      patchTicket(
        id,
        { priority },
        `Prioridade do chamado "${target.title}" alterada para ${PRIORITY_LABELS[priority]}`,
        'warning',
      )
    },
    [tickets, patchTicket],
  )

  const updateTicketAssignee = useCallback(
    (id: string, assignee: string) => {
      const target = tickets.find((ticket) => ticket.id === id)
      if (!target) return
      const trimmed = assignee.trim()
      if ((target.assignee ?? '') === trimmed) return
      patchTicket(
        id,
        { assignee: trimmed || undefined },
        trimmed
          ? `Chamado "${target.title}" atribuído a ${trimmed}`
          : `Responsável do chamado "${target.title}" removido`,
        'warning',
      )
    },
    [tickets, patchTicket],
  )

  const updateTicketTeam = useCallback(
    (id: string, team: TicketTeam | undefined) => {
      const target = tickets.find((ticket) => ticket.id === id)
      if (!target || target.team === team) return
      patchTicket(
        id,
        { team },
        team
          ? `Chamado "${target.title}" movido para a equipe ${TEAM_LABELS[team]}`
          : `Equipe do chamado "${target.title}" removida`,
        'warning',
      )
    },
    [tickets, patchTicket],
  )

  const getTicket = useCallback((id: string) => tickets.find((ticket) => ticket.id === id), [tickets])

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
      loadStatus,
      reload,
      createTicket,
      updateTicketStatus,
      updateTicketPriority,
      updateTicketAssignee,
      updateTicketTeam,
      getTicket,
      notifications,
      unreadNotificationsCount,
      markNotificationsRead,
    }),
    [
      tickets,
      loadStatus,
      reload,
      createTicket,
      updateTicketStatus,
      updateTicketPriority,
      updateTicketAssignee,
      updateTicketTeam,
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
