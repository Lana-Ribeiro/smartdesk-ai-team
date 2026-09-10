import type { TicketTeam } from '../types/ticket'

/** Equipes na ordem em que aparecem nos controles da interface. */
export const TICKET_TEAMS: TicketTeam[] = ['DESENVOLVIMENTO', 'SUPORTE', 'INFRAESTRUTURA']

export const TEAM_LABELS: Record<TicketTeam, string> = {
  DESENVOLVIMENTO: 'Desenvolvimento',
  SUPORTE: 'Suporte',
  INFRAESTRUTURA: 'Infraestrutura',
}

export function isTicketTeam(value: unknown): value is TicketTeam {
  return typeof value === 'string' && TICKET_TEAMS.includes(value as TicketTeam)
}
