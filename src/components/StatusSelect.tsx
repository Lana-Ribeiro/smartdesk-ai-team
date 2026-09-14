import type { TicketStatus } from '../types/ticket'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import styles from './StatusSelect.module.css'

interface StatusSelectProps {
  value: TicketStatus
  onChange: (status: TicketStatus) => void
}

/** Controle segmentado para alternar o status entre OPEN, IN_PROGRESS e CLOSED. */
export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div className={styles.group} role="group" aria-label="Alterar status do chamado">
      {TICKET_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          className={`${styles.option} ${status === value ? styles.selected : ''}`}
          aria-pressed={status === value}
          onClick={() => onChange(status)}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  )
}
