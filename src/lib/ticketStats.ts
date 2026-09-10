import type { Ticket, TicketPriority, TicketStatus, TicketTeam } from '../types/ticket'

export interface TicketFilters {
  status: TicketStatus | 'ALL'
  priority: TicketPriority | 'ALL'
  team: TicketTeam | 'ALL'
  /** Nome do responsável, ou 'ALL' para qualquer. */
  assignee: string | 'ALL'
  search: string
}

export const DEFAULT_FILTERS: TicketFilters = {
  status: 'ALL',
  priority: 'ALL',
  team: 'ALL',
  assignee: 'ALL',
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
    if (filters.team !== 'ALL' && ticket.team !== filters.team) return false
    if (filters.assignee !== 'ALL' && (ticket.assignee ?? '') !== filters.assignee) return false
    if (search && !ticket.title.toLowerCase().includes(search)) return false
    return true
  })
}

export function getRecentTickets(tickets: Ticket[], limit: number): Ticket[] {
  return [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

/** Lista de responsáveis distintos presentes nos chamados (para o filtro). */
export function listAssignees(tickets: Ticket[]): string[] {
  const set = new Set<string>()
  for (const ticket of tickets) {
    const name = ticket.assignee?.trim()
    if (name) set.add(name)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export type IndicatorKey = 'critical' | 'inProgress' | 'waiting' | 'resolved'

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  critical: 'Críticos',
  inProgress: 'Em andamento',
  waiting: 'Aguardando atendimento',
  resolved: 'Resolvidos',
}

/** Filtro aplicado ao clicar em cada indicador. */
export const INDICATOR_FILTER: Record<IndicatorKey, Partial<TicketFilters>> = {
  critical: { priority: 'HIGH' },
  inProgress: { status: 'IN_PROGRESS' },
  waiting: { status: 'OPEN' },
  resolved: { status: 'CLOSED' },
}

export function countIndicators(tickets: Ticket[]): Record<IndicatorKey, number> {
  const counts: Record<IndicatorKey, number> = {
    critical: 0,
    inProgress: 0,
    waiting: 0,
    resolved: 0,
  }
  for (const ticket of tickets) {
    if (ticket.priority === 'HIGH') counts.critical += 1
    if (ticket.status === 'IN_PROGRESS') counts.inProgress += 1
    if (ticket.status === 'OPEN') counts.waiting += 1
    if (ticket.status === 'CLOSED') counts.resolved += 1
  }
  return counts
}

/** Qual indicador corresponde ao estado atual dos filtros (para marcar como ativo). */
export function activeIndicator(filters: TicketFilters): IndicatorKey | null {
  if (filters.priority === 'HIGH' && filters.status === 'ALL') return 'critical'
  if (filters.status === 'IN_PROGRESS' && filters.priority === 'ALL') return 'inProgress'
  if (filters.status === 'OPEN' && filters.priority === 'ALL') return 'waiting'
  if (filters.status === 'CLOSED' && filters.priority === 'ALL') return 'resolved'
  return null
}
