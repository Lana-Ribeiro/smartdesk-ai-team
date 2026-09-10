import { useMemo, useState } from 'react'
import { useTickets } from '../store/TicketsContext'
import { getAttentionTickets } from '../lib/attention'
import {
  DEFAULT_FILTERS,
  INDICATOR_FILTER,
  activeIndicator,
  countIndicators,
  filterTickets,
  listAssignees,
} from '../lib/ticketStats'
import type { IndicatorKey } from '../lib/ticketStats'
import { Button } from './Button'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { IndicatorCards } from './IndicatorCards'
import { AttentionSection } from './AttentionSection'
import { OperationalSearch } from './OperationalSearch'
import { OperationalCenterSkeleton } from './OperationalCenterSkeleton'
import { TicketBoardCard } from './TicketBoardCard'
import styles from './OperationalCenter.module.css'

const ATTENTION_LIMIT = 5

interface OperationalCenterProps {
  onNewTicket: () => void
  onOpenDetails: (id: string) => void
}

export function OperationalCenter({ onNewTicket, onOpenDetails }: OperationalCenterProps) {
  const { tickets, loadStatus, reload } = useTickets()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const now = useMemo(() => Date.now(), [tickets])
  const indicatorCounts = useMemo(() => countIndicators(tickets), [tickets])
  const attentionTickets = useMemo(
    () => getAttentionTickets(tickets, now, ATTENTION_LIMIT),
    [tickets, now],
  )
  const filteredTickets = useMemo(() => filterTickets(tickets, filters), [tickets, filters])
  const assignees = useMemo(() => listAssignees(tickets), [tickets])
  const active = activeIndicator(filters)

  function handleIndicatorToggle(key: IndicatorKey) {
    if (active === key) {
      setFilters({ ...DEFAULT_FILTERS, search: filters.search })
    } else {
      setFilters({ ...DEFAULT_FILTERS, search: filters.search, ...INDICATOR_FILTER[key] })
    }
  }

  if (loadStatus === 'loading') return <OperationalCenterSkeleton />
  if (loadStatus === 'error') {
    return <ErrorState onRetry={reload} />
  }

  return (
    <div className={styles.center}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.heading}>Central de atendimento</h1>
          <p className={styles.subheading}>O que precisa da sua atenção agora</p>
        </div>
        <Button onClick={onNewTicket}>Novo chamado</Button>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="Sem chamados por aqui"
          description="Crie o primeiro chamado para começar a acompanhar as solicitações no SmartDesk."
          action={<Button onClick={onNewTicket}>Novo chamado</Button>}
        />
      ) : (
        <>
          <IndicatorCards
            counts={indicatorCounts}
            active={active}
            onToggle={handleIndicatorToggle}
          />

          <AttentionSection tickets={attentionTickets} onOpenDetails={onOpenDetails} />

          <section className={styles.results} aria-labelledby="results-heading">
            <h2 id="results-heading" className={styles.resultsHeading}>
              Todos os chamados
            </h2>

            <OperationalSearch filters={filters} onChange={setFilters} assignees={assignees} />

            {filteredTickets.length === 0 ? (
              <EmptyState
                title="Nenhum chamado encontrado"
                description="Ajuste a busca ou os filtros para encontrar chamados."
              />
            ) : (
              <div className={styles.cards}>
                {filteredTickets.map((ticket) => (
                  <TicketBoardCard
                    key={ticket.id}
                    ticket={ticket}
                    onOpenDetails={onOpenDetails}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
