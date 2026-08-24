export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
}

/** Dados informados pelo usuário ao criar um chamado. */
export interface NewTicketInput {
  title: string
  description: string
  priority: TicketPriority
}
