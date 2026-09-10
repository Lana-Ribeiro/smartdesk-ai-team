import type { TicketPriority, TicketStatus } from '../types/ticket'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import styles from './DashboardBreakdown.module.css'

interface DashboardBreakdownProps {
  countsByStatus: Record<TicketStatus, number>
  countsByPriority: Record<TicketPriority, number>
}

function BarGroup({ rows }: { rows: { key: string; label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.count))

  return (
    <div className={styles.bars}>
      {rows.map((row) => (
        <div key={row.key} className={styles.row}>
          <span className={styles.rowLabel}>{row.label}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className={styles.rowCount}>{row.count}</span>
        </div>
      ))}
    </div>
  )
}

export function DashboardBreakdown({ countsByStatus, countsByPriority }: DashboardBreakdownProps) {
  const statusRows = TICKET_STATUSES.map((status) => ({
    key: status,
    label: STATUS_LABELS[status],
    count: countsByStatus[status],
  }))

  const priorityRows = TICKET_PRIORITIES.map((priority) => ({
    key: priority,
    label: PRIORITY_LABELS[priority],
    count: countsByPriority[priority],
  }))

  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h3 className={styles.title}>Chamados por status</h3>
        <BarGroup rows={statusRows} />
      </section>
      <section className={styles.panel}>
        <h3 className={styles.title}>Chamados por prioridade</h3>
        <BarGroup rows={priorityRows} />
      </section>
    </div>
  )
}
