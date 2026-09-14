import type { Ticket } from '../types/ticket'

/** Sem atualização há mais que isto → chamado considerado "parado". */
export const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000

/** Atualizado há menos que isto → considerado "atividade recente". */
const RECENT_THRESHOLD_MS = 2 * 60 * 60 * 1000

export function isStale(ticket: Ticket, now: number): boolean {
  if (ticket.status === 'CLOSED') return false
  return now - new Date(ticket.updatedAt).getTime() > STALE_THRESHOLD_MS
}

/**
 * Pontua a relevância operacional de um chamado. Critérios objetivos:
 * prioridade alta, chamado parado, aguardando atendimento, atividade recente.
 * Chamados concluídos não pontuam. Maior pontuação = precisa de mais atenção.
 */
export function scoreTicket(ticket: Ticket, now: number): number {
  if (ticket.status === 'CLOSED') return 0

  let score = 0
  if (ticket.priority === 'HIGH') score += 40
  if (ticket.priority === 'MEDIUM') score += 10
  if (isStale(ticket, now)) score += 30
  if (ticket.status === 'OPEN') score += 20

  const sinceUpdate = now - new Date(ticket.updatedAt).getTime()
  if (sinceUpdate <= RECENT_THRESHOLD_MS) score += 8

  return score
}

/**
 * Chamados que precisam de atenção, ordenados por relevância (score desc),
 * desempate pelo mais antigo sem atualização. Sem duplicatas. Só score > 0.
 */
export function getAttentionTickets(tickets: Ticket[], now: number, limit: number): Ticket[] {
  return tickets
    .map((ticket) => ({ ticket, score: scoreTicket(ticket, now) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(a.ticket.updatedAt).getTime() - new Date(b.ticket.updatedAt).getTime()
    })
    .slice(0, limit)
    .map((entry) => entry.ticket)
}
