import type { TicketTeam } from '../types/ticket'

/**
 * Equipes e seus responsáveis disponíveis.
 *
 * Para adicionar uma nova equipe: acrescente o valor a `TicketTeam` (types/ticket.ts)
 * e uma entrada aqui em `TICKET_TEAMS`, `TEAM_LABELS` e `TEAM_MEMBERS`. Nenhum
 * outro arquivo precisa mudar — todo o resto da aplicação deriva destas constantes.
 */

/** Equipe usada para chamados existentes sem equipe definida (migração). */
export const DEFAULT_TEAM: TicketTeam = 'SUPORTE'

export const TICKET_TEAMS: TicketTeam[] = [
  'SUPORTE',
  'DESENVOLVIMENTO',
  'INFRAESTRUTURA',
  'FINANCEIRO',
]

export const TEAM_LABELS: Record<TicketTeam, string> = {
  SUPORTE: 'Suporte',
  DESENVOLVIMENTO: 'Desenvolvimento',
  INFRAESTRUTURA: 'Infraestrutura',
  FINANCEIRO: 'Financeiro',
}

export const TEAM_MEMBERS: Record<TicketTeam, string[]> = {
  SUPORTE: ['Ana', 'Carlos'],
  DESENVOLVIMENTO: ['João', 'Mariana'],
  INFRAESTRUTURA: ['Pedro', 'Lucas'],
  FINANCEIRO: ['Fernanda', 'Rafael'],
}

export function isTicketTeam(value: unknown): value is TicketTeam {
  return typeof value === 'string' && TICKET_TEAMS.includes(value as TicketTeam)
}

export function getTeamMembers(team: TicketTeam): string[] {
  return TEAM_MEMBERS[team]
}

export function isTeamMember(team: TicketTeam, name: string | undefined): boolean {
  if (!name) return false
  return TEAM_MEMBERS[team].includes(name)
}
