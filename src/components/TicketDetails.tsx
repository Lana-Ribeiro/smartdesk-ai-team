import type { Ticket, TicketStatus } from '../types/ticket'
import { formatDate } from '../lib/formatDate'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import { StatusSelect } from './StatusSelect'
import styles from './TicketDetails.module.css'

interface TicketDetailsProps {
  ticket: Ticket
  onStatusChange: (status: TicketStatus) => void
}

export function TicketDetails({ ticket, onStatusChange }: TicketDetailsProps) {
  return (
    <article className={styles.details}>
      <div className={styles.heading}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.badges}>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Descrição</h4>
        <p className={styles.description}>{ticket.description}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Status</h4>
        <StatusSelect value={ticket.status} onChange={onStatusChange} />
      </section>

      <dl className={styles.meta}>
        <div>
          <dt>Criado em</dt>
          <dd>{formatDate(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt>Última atualização</dt>
          <dd>{formatDate(ticket.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  )
}
