import type { TicketPriority } from '../types/ticket'
import { PRIORITY_LABELS } from '../lib/priorities'
import styles from './PriorityBadge.module.css'

const VARIANT_BY_PRIORITY: Record<TicketPriority, string> = {
  LOW: styles.low,
  MEDIUM: styles.medium,
  HIGH: styles.high,
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`${styles.badge} ${VARIANT_BY_PRIORITY[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
