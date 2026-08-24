import type { TicketStatus } from '../types/ticket'

/** Status na ordem em que aparecem nos controles da interface. */
export const TICKET_STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'CLOSED']

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  CLOSED: 'Fechado',
}

/** Status atribuído automaticamente a todo chamado recém-criado. */
export const DEFAULT_STATUS: TicketStatus = 'OPEN'

export function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === 'string' && TICKET_STATUSES.includes(value as TicketStatus)
}
