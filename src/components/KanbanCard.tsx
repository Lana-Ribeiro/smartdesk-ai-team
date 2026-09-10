import type { Ticket } from '../types/ticket'
import { PriorityBadge } from './PriorityBadge'
import styles from './KanbanCard.module.css'

interface KanbanCardProps {
  ticket: Ticket
  onSelect: (id: string) => void
}

export function KanbanCard({ ticket, onSelect }: KanbanCardProps) {
  return (
    <button type="button" className={styles.card} onClick={() => onSelect(ticket.id)}>
      <span className={styles.title}>{ticket.title}</span>
      <PriorityBadge priority={ticket.priority} />
    </button>
  )
}
