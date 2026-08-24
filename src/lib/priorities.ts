import type { TicketPriority } from '../types/ticket'

/** Prioridades na ordem em que aparecem nos controles da interface. */
export const TICKET_PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH']

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
}

export function isTicketPriority(value: unknown): value is TicketPriority {
  return typeof value === 'string' && TICKET_PRIORITIES.includes(value as TicketPriority)
}
