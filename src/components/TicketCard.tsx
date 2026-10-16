import type { Ticket } from '../types/ticket'
import { formatDate } from '../lib/formatDate'
import { TEAM_LABELS } from '../lib/teams'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import styles from './TicketCard.module.css'

interface TicketCardProps {
  ticket: Ticket
  onSelect: (id: string) => void
}

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  return (
    <li>
      <button type="button" className={styles.card} onClick={() => onSelect(ticket.id)}>
        <div className={styles.top}>
          <h3 className={styles.title}>{ticket.title}</h3>
          <div className={styles.badges}>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <span className={styles.assignment}>
          👥 {TEAM_LABELS[ticket.team]} · 👤 {ticket.assignee ?? 'Sem responsável'}
        </span>
        <span className={styles.meta}>Criado em {formatDate(ticket.createdAt)}</span>
      </button>
    </li>
  )
}
