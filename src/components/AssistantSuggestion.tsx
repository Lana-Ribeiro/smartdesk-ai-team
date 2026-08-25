import type { TicketSuggestion } from '../lib/ticketAssistant'
import { Button } from './Button'
import { PriorityBadge } from './PriorityBadge'
import styles from './AssistantSuggestion.module.css'

interface AssistantSuggestionProps {
  suggestion: TicketSuggestion
  onApply: () => void
  onDismiss: () => void
}

export function AssistantSuggestion({ suggestion, onApply, onDismiss }: AssistantSuggestionProps) {
  return (
    <div className={styles.card}>
      <span className={styles.heading}>✨ Sugestão do Assistente</span>

      <div className={styles.field}>
        <span className={styles.label}>Título sugerido</span>
        <span className={styles.value}>{suggestion.title}</span>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Prioridade sugerida</span>
        <PriorityBadge priority={suggestion.priority} />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onDismiss}>
          Editar
        </Button>
        <Button onClick={onApply}>Aplicar sugestões</Button>
      </div>
    </div>
  )
}
