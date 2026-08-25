import type { TicketPriority } from '../types/ticket'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import styles from './PrioritySelect.module.css'

interface PrioritySelectProps {
  value: TicketPriority | null
  onChange: (priority: TicketPriority) => void
  invalid?: boolean
}

/** Controle segmentado para escolher a prioridade. Aceita `value` nulo para representar "ainda não escolhida", necessário para validar o campo como obrigatório no formulário. */
export function PrioritySelect({ value, onChange, invalid }: PrioritySelectProps) {
  return (
    <div
      className={`${styles.group} ${invalid ? styles.invalid : ''}`}
      role="radiogroup"
      aria-label="Selecionar prioridade do chamado"
      aria-invalid={invalid}
    >
      {TICKET_PRIORITIES.map((priority) => (
        <button
          key={priority}
          type="button"
          role="radio"
          aria-checked={priority === value}
          className={`${styles.option} ${priority === value ? styles.selected : ''}`}
          onClick={() => onChange(priority)}
        >
          {PRIORITY_LABELS[priority]}
        </button>
      ))}
    </div>
  )
}
