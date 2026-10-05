import type { Ticket } from '../types/ticket'
import { EmptyState } from './EmptyState'
import { TicketBoardCard } from './TicketBoardCard'
import styles from './AttentionSection.module.css'

interface AttentionSectionProps {
  tickets: Ticket[]
  onOpenDetails: (id: string) => void
}

export function AttentionSection({ tickets, onOpenDetails }: AttentionSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="attention-heading">
      <h2 id="attention-heading" className={styles.heading}>
        Precisa da sua atenção
      </h2>

      {tickets.length === 0 ? (
        <EmptyState
          title="Tudo sob controle"
          description="Nenhum chamado precisa de atenção imediata agora."
        />
      ) : (
        <div className={styles.cards}>
          {tickets.map((ticket) => (
            <TicketBoardCard key={ticket.id} ticket={ticket} onOpenDetails={onOpenDetails} />
          ))}
        </div>
      )}
    </section>
  )
}
