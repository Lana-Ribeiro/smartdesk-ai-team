import type { TicketFilters } from '../lib/ticketStats'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import styles from './DashboardFilters.module.css'

interface DashboardFiltersProps {
  filters: TicketFilters
  onChange: (filters: TicketFilters) => void
}

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  return (
    <div className={styles.bar}>
      <input
        type="search"
        className={styles.search}
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Buscar por título..."
        aria-label="Buscar chamados por título"
      />

      <select
        className={styles.select}
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as TicketFilters['status'] })}
        aria-label="Filtrar por status"
      >
        <option value="ALL">Todos os status</option>
        {TICKET_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.priority}
        onChange={(event) => onChange({ ...filters, priority: event.target.value as TicketFilters['priority'] })}
        aria-label="Filtrar por prioridade"
      >
        <option value="ALL">Todas as prioridades</option>
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>
    </div>
  )
}
