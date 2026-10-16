import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NewTicketInput, TicketPriority, TicketTeam } from '../types/ticket'
import type { TicketSuggestion } from '../lib/ticketAssistant'
import { suggestFromDescription } from '../lib/ticketAssistant'
import { TEAM_LABELS, TICKET_TEAMS, getTeamMembers } from '../lib/teams'
import { AssistantSuggestion } from './AssistantSuggestion'
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
  team?: string
}

export function TicketForm({ onSubmit, onCancel }: TicketFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority | null>(null)
  const [team, setTeam] = useState<TicketTeam | ''>('')
  const [assignee, setAssignee] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [suggestion, setSuggestion] = useState<TicketSuggestion | null>(null)

  function handleTeamChange(value: TicketTeam | '') {
    setTeam(value)
    // O responsável só faz sentido dentro da equipe escolhida.
    setAssignee('')
  }

  function handleDescriptionChange(value: string) {
    setDescription(value)
    if (suggestion) setSuggestion(null)
  }

  function handleAnalyze() {
    setSuggestion(suggestFromDescription(description))
  }

  function handleApplySuggestion() {
    if (!suggestion) return
    setTitle(suggestion.title)
    setPriority(suggestion.priority)
    setSuggestion(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Informe um título para o chamado.'
    if (!description.trim()) nextErrors.description = 'Descreva o problema ou a solicitação.'
    if (!priority) nextErrors.priority = 'Selecione uma prioridade.'
    if (!team) nextErrors.team = 'Selecione a equipe responsável.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      title,
      description,
      priority: priority as TicketPriority,
      team: team as TicketTeam,
      ...(assignee ? { assignee } : {}),
    })
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
          onChange={(event) => handleDescriptionChange(event.target.value)}
          placeholder="Detalhe o que aconteceu, desde quando e o que já foi tentado."
          rows={5}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}

        <Button
          type="button"
          variant="ghost"
          className={styles.analyzeButton}
          onClick={handleAnalyze}
          disabled={description.trim().length < 10}
        >
          Analisar chamado ✨
        </Button>

        {suggestion && (
          <AssistantSuggestion
            suggestion={suggestion}
            onApply={handleApplySuggestion}
            onDismiss={() => setSuggestion(null)}
          />
        )}
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Prioridade</span>
        <PrioritySelect value={priority} onChange={setPriority} invalid={Boolean(errors.priority)} />
        {errors.priority && <span className={styles.error}>{errors.priority}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-team">
          Equipe
        </label>
        <select
          id="ticket-team"
          className={styles.input}
          value={team}
          onChange={(event) => handleTeamChange(event.target.value as TicketTeam | '')}
          aria-invalid={Boolean(errors.team)}
        >
          <option value="">Selecione uma equipe</option>
          {TICKET_TEAMS.map((option) => (
            <option key={option} value={option}>
              {TEAM_LABELS[option]}
            </option>
          ))}
        </select>
        {errors.team && <span className={styles.error}>{errors.team}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-assignee">
          Responsável <span className={styles.optional}>(opcional)</span>
        </label>
        <select
          id="ticket-assignee"
          className={styles.input}
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          disabled={!team}
        >
          <option value="">Sem responsável definido</option>
          {team &&
            getTeamMembers(team).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>
        {!team && <span className={styles.hint}>Selecione uma equipe para escolher o responsável.</span>}
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
