import type { Ticket } from '../types/ticket'
import { KanbanCard } from './KanbanCard'
import styles from './KanbanColumn.module.css'

interface KanbanColumnProps {
  title: string
  tickets: Ticket[]
  onSelect: (id: string) => void
}

export function KanbanColumn({ title, tickets, onSelect }: KanbanColumnProps) {
  return (
    <section className={styles.column}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{tickets.length}</span>
      </header>

      {tickets.length === 0 ? (
        <p className={styles.empty}>Nenhum chamado</p>
      ) : (
        <div className={styles.cards}>
          {tickets.map((ticket) => (
            <KanbanCard key={ticket.id} ticket={ticket} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  )
}
