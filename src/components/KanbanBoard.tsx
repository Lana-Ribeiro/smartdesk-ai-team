import { useMemo } from 'react'
import type { Ticket } from '../types/ticket'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import { KanbanColumn } from './KanbanColumn'
import styles from './KanbanBoard.module.css'

interface KanbanBoardProps {
  tickets: Ticket[]
  onSelect: (id: string) => void
}

export function KanbanBoard({ tickets, onSelect }: KanbanBoardProps) {
  const ticketsByStatus = useMemo(() => {
    const grouped = { OPEN: [], IN_PROGRESS: [], CLOSED: [] } as Record<string, Ticket[]>
    for (const ticket of tickets) grouped[ticket.status].push(ticket)
    return grouped
  }, [tickets])

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        {TICKET_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            title={STATUS_LABELS[status]}
            tickets={ticketsByStatus[status]}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
