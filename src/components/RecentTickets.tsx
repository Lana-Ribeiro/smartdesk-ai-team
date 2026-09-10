import type { Ticket } from '../types/ticket'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import styles from './RecentTickets.module.css'

interface RecentTicketsProps {
  tickets: Ticket[]
  onSelect: (id: string) => void
}

export function RecentTickets({ tickets, onSelect }: RecentTicketsProps) {
  if (tickets.length === 0) {
    return <p className={styles.empty}>Nenhum chamado registrado ainda.</p>
  }

  return (
    <ul className={styles.list}>
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <button type="button" className={styles.item} onClick={() => onSelect(ticket.id)}>
            <span className={styles.title}>{ticket.title}</span>
            <span className={styles.badges}>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
