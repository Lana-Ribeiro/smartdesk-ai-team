import type { Ticket } from '../types/ticket'
import { isTicketStatus } from '../lib/statuses'
import { isTicketPriority } from '../lib/priorities'
import { DEFAULT_TEAM, isTeamMember, isTicketTeam } from '../lib/teams'

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
    // team/assignee validados frouxamente aqui — a normalização abaixo cuida de
    // deixá-los consistentes, para não descartar chamados salvos por versões
    // anteriores (equipe passou a ser obrigatória; responsável passou a ser
    // restrito aos membros da equipe).
    (ticket.team === undefined || typeof ticket.team === 'string') &&
    (ticket.assignee === undefined || typeof ticket.assignee === 'string')
  )
}

/**
 * Garante que todo chamado tenha uma equipe válida e que o responsável (se
 * houver) pertença a ela. Chamados de versões anteriores (equipe ausente, ou
 * responsável em texto livre incompatível com a lista fechada atual) são
 * migrados em vez de descartados.
 */
function normalizeTicket(ticket: Ticket): Ticket {
  const team = isTicketTeam(ticket.team) ? ticket.team : DEFAULT_TEAM
  const assignee = isTeamMember(team, ticket.assignee) ? ticket.assignee : undefined

  if (team === ticket.team && assignee === ticket.assignee) return ticket
  return { ...ticket, team, assignee }
}

export function loadTickets(): Ticket[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Descarta registros inválidos em vez de quebrar a aplicação; normaliza os
    // demais para o modelo atual de equipe/responsável.
    return parsed.filter(isTicket).map(normalizeTicket)
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
