import type { TicketStatus } from '../types/ticket'
import { STATUS_LABELS } from '../lib/statuses'
import styles from './StatusBadge.module.css'

const VARIANT_BY_STATUS: Record<TicketStatus, string> = {
  OPEN: styles.open,
  IN_PROGRESS: styles.inProgress,
  CLOSED: styles.closed,
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`${styles.badge} ${VARIANT_BY_STATUS[status]}`}>{STATUS_LABELS[status]}</span>
  )
}
