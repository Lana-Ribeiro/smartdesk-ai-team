import type { TicketStatus } from '../types/ticket'
import { STATUS_LABELS } from '../lib/statuses'
import styles from './DashboardStats.module.css'

interface DashboardStatsProps {
  total: number
  countsByStatus: Record<TicketStatus, number>
}

export function DashboardStats({ total, countsByStatus }: DashboardStatsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.value}>{total}</span>
        <span className={styles.label}>Total de chamados</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{countsByStatus.OPEN}</span>
        <span className={styles.label}>{STATUS_LABELS.OPEN}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{countsByStatus.IN_PROGRESS}</span>
        <span className={styles.label}>{STATUS_LABELS.IN_PROGRESS}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{countsByStatus.CLOSED}</span>
        <span className={styles.label}>{STATUS_LABELS.CLOSED}</span>
      </div>
    </div>
  )
}
