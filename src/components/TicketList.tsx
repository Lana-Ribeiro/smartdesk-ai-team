import type { Ticket } from '../types/ticket'
import { TicketCard } from './TicketCard'
import styles from './TicketList.module.css'

interface TicketListProps {
  tickets: Ticket[]
  onSelect: (id: string) => void
}

export function TicketList({ tickets, onSelect }: TicketListProps) {
  return (
    <ul className={styles.list}>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onSelect={onSelect} />
      ))}
    </ul>
  )
}
