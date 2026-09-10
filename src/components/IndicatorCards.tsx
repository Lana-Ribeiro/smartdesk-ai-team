import type { IndicatorKey } from '../lib/ticketStats'
import { INDICATOR_LABELS } from '../lib/ticketStats'
import styles from './IndicatorCards.module.css'

const INDICATOR_ORDER: IndicatorKey[] = ['critical', 'inProgress', 'waiting', 'resolved']

const TONE_CLASS: Record<IndicatorKey, string> = {
  critical: styles.toneCritical,
  inProgress: styles.toneInProgress,
  waiting: styles.toneWaiting,
  resolved: styles.toneResolved,
}

interface IndicatorCardsProps {
  counts: Record<IndicatorKey, number>
  active: IndicatorKey | null
  onToggle: (key: IndicatorKey) => void
}

export function IndicatorCards({ counts, active, onToggle }: IndicatorCardsProps) {
  return (
    <div className={styles.grid}>
      {INDICATOR_ORDER.map((key) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            className={`${styles.card} ${TONE_CLASS[key]} ${isActive ? styles.active : ''}`}
            aria-pressed={isActive}
            onClick={() => onToggle(key)}
          >
            <span className={styles.count}>{counts[key]}</span>
            <span className={styles.label}>
              <span className={styles.dot} aria-hidden="true" />
              {INDICATOR_LABELS[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
