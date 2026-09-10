import { useMemo, useState } from 'react'
import type { Ticket } from '../types/ticket'
import {
  DEFAULT_FILTERS,
  countByPriority,
  countByStatus,
  filterTickets,
  getRecentTickets,
} from '../lib/ticketStats'
import { DashboardBreakdown } from './DashboardBreakdown'
import { DashboardFilters } from './DashboardFilters'
import { DashboardStats } from './DashboardStats'
import { EmptyState } from './EmptyState'
import { RecentTickets } from './RecentTickets'
import { TicketList } from './TicketList'
import styles from './Dashboard.module.css'

const RECENT_TICKETS_LIMIT = 5

interface DashboardProps {
  tickets: Ticket[]
  onSelect: (id: string) => void
}

export function Dashboard({ tickets, onSelect }: DashboardProps) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const countsByStatus = useMemo(() => countByStatus(tickets), [tickets])
  const countsByPriority = useMemo(() => countByPriority(tickets), [tickets])
  const recentTickets = useMemo(() => getRecentTickets(tickets, RECENT_TICKETS_LIMIT), [tickets])
  const filteredTickets = useMemo(() => filterTickets(tickets, filters), [tickets, filters])

  const isFiltering = filters.status !== 'ALL' || filters.priority !== 'ALL' || filters.search.trim() !== ''

  return (
    <div className={styles.dashboard}>
      <DashboardStats total={tickets.length} countsByStatus={countsByStatus} />

      <DashboardBreakdown countsByStatus={countsByStatus} countsByPriority={countsByPriority} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chamados recentes</h2>
        <RecentTickets tickets={recentTickets} onSelect={onSelect} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Buscar e filtrar</h2>
        <DashboardFilters filters={filters} onChange={setFilters} />

        {filteredTickets.length === 0 ? (
          <EmptyState
            title={isFiltering ? 'Nenhum chamado encontrado' : 'Sem chamados por aqui'}
            description={
              isFiltering
                ? 'Ajuste os filtros ou o termo de busca para encontrar chamados.'
                : 'Crie um chamado para começar a acompanhar as solicitações no SmartDesk.'
            }
          />
        ) : (
          <TicketList tickets={filteredTickets} onSelect={onSelect} />
        )}
      </section>
    </div>
  )
}
