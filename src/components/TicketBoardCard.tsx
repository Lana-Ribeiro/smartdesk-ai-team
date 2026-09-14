import type { Ticket } from '../types/ticket'
import { useTickets } from '../store/TicketsContext'
import { formatRelativeTime } from '../lib/formatRelativeTime'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import { TEAM_LABELS } from '../lib/teams'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import styles from './TicketBoardCard.module.css'

interface TicketBoardCardProps {
  ticket: Ticket
  onOpenDetails: (id: string) => void
}

export function TicketBoardCard({ ticket, onOpenDetails }: TicketBoardCardProps) {
  const { updateTicketStatus, updateTicketPriority } = useTickets()

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.badges}>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt>Equipe</dt>
          <dd>👥 {TEAM_LABELS[ticket.team]}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Responsável</dt>
          <dd>👤 {ticket.assignee ?? 'Sem responsável'}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Atualizado</dt>
          <dd>{formatRelativeTime(ticket.updatedAt)}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <label className={styles.quickAction}>
          <span className={styles.quickLabel}>Status</span>
          <select
            className={styles.select}
            value={ticket.status}
            onChange={(event) => updateTicketStatus(ticket.id, event.target.value as Ticket['status'])}
            aria-label={`Alterar status do chamado ${ticket.title}`}
          >
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.quickAction}>
          <span className={styles.quickLabel}>Prioridade</span>
          <select
            className={styles.select}
            value={ticket.priority}
            onChange={(event) =>
              updateTicketPriority(ticket.id, event.target.value as Ticket['priority'])
            }
            aria-label={`Alterar prioridade do chamado ${ticket.title}`}
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={styles.detailsButton}
          onClick={() => onOpenDetails(ticket.id)}
        >
          Detalhes
        </button>
      </div>
    </article>
  )
}
