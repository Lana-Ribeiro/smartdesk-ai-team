export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TicketTeam = 'SUPORTE' | 'DESENVOLVIMENTO' | 'INFRAESTRUTURA' | 'FINANCEIRO'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  /** Equipe responsável pelo chamado. Obrigatória. */
  team: TicketTeam
  /** Pessoa responsável pelo chamado, dentre os membros de `team`. Opcional — pode ser definida depois. */
  assignee?: string
  createdAt: string
  updatedAt: string
}

/** Dados informados pelo usuário ao criar um chamado. */
export interface NewTicketInput {
  title: string
  description: string
  priority: TicketPriority
  team: TicketTeam
  assignee?: string
}
