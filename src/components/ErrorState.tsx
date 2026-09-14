import { Button } from './Button'
import styles from './ErrorState.module.css'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Não foi possível carregar os chamados.',
  description = 'Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
    </div>
  )
}
