import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NewTicketInput, TicketPriority } from '../types/ticket'
import { Button } from './Button'
import { PrioritySelect } from './PrioritySelect'
import styles from './TicketForm.module.css'

interface TicketFormProps {
  onSubmit: (input: NewTicketInput) => void
  onCancel: () => void
}

interface FormErrors {
  title?: string
  description?: string
  priority?: string
}

export function TicketForm({ onSubmit, onCancel }: TicketFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Informe um título para o chamado.'
    if (!description.trim()) nextErrors.description = 'Descreva o problema ou a solicitação.'
    if (!priority) nextErrors.priority = 'Selecione uma prioridade.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ title, description, priority: priority as TicketPriority })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-title">
          Título
        </label>
        <input
          id="ticket-title"
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Impressora do 2º andar não imprime"
          maxLength={120}
          autoFocus
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-description">
          Descrição
        </label>
        <textarea
          id="ticket-description"
          className={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Detalhe o que aconteceu, desde quando e o que já foi tentado."
          rows={5}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Prioridade</span>
        <PrioritySelect value={priority} onChange={setPriority} invalid={Boolean(errors.priority)} />
        {errors.priority && <span className={styles.error}>{errors.priority}</span>}
      </div>

      <p className={styles.hint}>O chamado será criado com o status Aberto.</p>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar chamado</Button>
      </div>
    </form>
  )
}
