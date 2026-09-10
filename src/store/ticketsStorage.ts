import type { Ticket } from '../types/ticket'
import { isTicketStatus } from '../lib/statuses'
import { isTicketPriority } from '../lib/priorities'
import { isTicketTeam } from '../lib/teams'

/**
 * Camada de persistência dos chamados.
 *
 * Nesta primeira versão os dados vivem em memória e são espelhados no
 * localStorage do navegador, para sobreviverem a um refresh. Todo o acesso a
 * dados passa por aqui — trocar isto por uma API REST no futuro não deve exigir
 * mudanças nos componentes.
 */

const STORAGE_KEY = 'smartdesk:tickets'

function isTicket(value: unknown): value is Ticket {
  if (typeof value !== 'object' || value === null) return false
  const ticket = value as Record<string, unknown>
  return (
    typeof ticket.id === 'string' &&
    typeof ticket.title === 'string' &&
    typeof ticket.description === 'string' &&
    typeof ticket.createdAt === 'string' &&
    typeof ticket.updatedAt === 'string' &&
    isTicketStatus(ticket.status) &&
    isTicketPriority(ticket.priority) &&
    (ticket.team === undefined || isTicketTeam(ticket.team)) &&
    (ticket.assignee === undefined || typeof ticket.assignee === 'string')
  )
}

export function loadTickets(): Ticket[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Descarta registros inválidos em vez de quebrar a aplicação.
    return parsed.filter(isTicket)
  } catch {
    return []
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // Sem localStorage disponível (modo privado, storage cheio): a aplicação
    // segue funcionando apenas em memória.
  }
}
