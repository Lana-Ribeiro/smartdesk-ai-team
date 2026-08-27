import type { Ticket, TicketPriority, TicketStatus } from '../types/ticket'

export interface TicketFilters {
  status: TicketStatus | 'ALL'
  priority: TicketPriority | 'ALL'
  search: string
}

export const DEFAULT_FILTERS: TicketFilters = {
  status: 'ALL',
  priority: 'ALL',
  search: '',
}

export function countByStatus(tickets: Ticket[]): Record<TicketStatus, number> {
  const counts = { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 } as Record<TicketStatus, number>
  for (const ticket of tickets) counts[ticket.status] += 1
  return counts
}

export function countByPriority(tickets: Ticket[]): Record<TicketPriority, number> {
  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 } as Record<TicketPriority, number>
  for (const ticket of tickets) counts[ticket.priority] += 1
  return counts
}

export function filterTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  const search = filters.search.trim().toLowerCase()

  return tickets.filter((ticket) => {
    if (filters.status !== 'ALL' && ticket.status !== filters.status) return false
    if (filters.priority !== 'ALL' && ticket.priority !== filters.priority) return false
    if (search && !ticket.title.toLowerCase().includes(search)) return false
    return true
  })
}

export function getRecentTickets(tickets: Ticket[], limit: number): Ticket[] {
  return [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}
