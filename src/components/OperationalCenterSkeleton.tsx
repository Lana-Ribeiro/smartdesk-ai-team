import { Skeleton } from './Skeleton'
import styles from './OperationalCenterSkeleton.module.css'

/** Skeleton compatível com o layout final da central de atendimento. */
export function OperationalCenterSkeleton() {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-label="Carregando chamados">
      <div className={styles.indicators}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height="72px" radius="10px" />
        ))}
      </div>

      <Skeleton width="220px" height="1.25rem" />

      <div className={styles.cards}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} height="132px" radius="10px" />
        ))}
      </div>
    </div>
  )
}
