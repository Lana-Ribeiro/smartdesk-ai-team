import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { NewTicketInput, Ticket, TicketStatus } from '../types/ticket'
import { DEFAULT_STATUS } from '../lib/statuses'
import { loadTickets, saveTickets } from './ticketsStorage'

interface TicketsContextValue {
  tickets: Ticket[]
  createTicket: (input: NewTicketInput) => Ticket
  updateTicketStatus: (id: string, status: TicketStatus) => void
  getTicket: (id: string) => Ticket | undefined
}

const TicketsContext = createContext<TicketsContextValue | null>(null)

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets)

  useEffect(() => {
    saveTickets(tickets)
  }, [tickets])

  const createTicket = useCallback((input: NewTicketInput): Ticket => {
    const now = new Date().toISOString()
    const ticket: Ticket = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: DEFAULT_STATUS,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    }

    // Mais recentes primeiro.
    setTickets((current) => [ticket, ...current])
    return ticket
  }, [])

  const updateTicketStatus = useCallback((id: string, status: TicketStatus) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id && ticket.status !== status
          ? { ...ticket, status, updatedAt: new Date().toISOString() }
          : ticket,
      ),
    )
  }, [])

  const getTicket = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id),
    [tickets],
  )

  const value = useMemo(
    () => ({ tickets, createTicket, updateTicketStatus, getTicket }),
    [tickets, createTicket, updateTicketStatus, getTicket],
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
