import { useState } from 'react'
import type { TicketFilters } from '../lib/ticketStats'
import { DEFAULT_FILTERS } from '../lib/ticketStats'
import { parseNaturalQuery } from '../lib/naturalLanguageQuery'
import { STATUS_LABELS, TICKET_STATUSES } from '../lib/statuses'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import { TEAM_LABELS, TICKET_TEAMS } from '../lib/teams'
import { Button } from './Button'
import styles from './OperationalSearch.module.css'

interface OperationalSearchProps {
  filters: TicketFilters
  onChange: (filters: TicketFilters) => void
  assignees: string[]
}

function hasActiveFilter(filters: TicketFilters): boolean {
  return (
    filters.status !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.team !== 'ALL' ||
    filters.assignee !== 'ALL' ||
    filters.search.trim() !== ''
  )
}

export function OperationalSearch({ filters, onChange, assignees }: OperationalSearchProps) {
  const [queryText, setQueryText] = useState('')

  function handleQueryChange(value: string) {
    setQueryText(value)
    const { filters: parsed, searchText } = parseNaturalQuery(value)
    onChange({ ...filters, ...parsed, search: searchText })
  }

  function handleClear() {
    setQueryText('')
    onChange(DEFAULT_FILTERS)
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="search"
        className={styles.query}
        value={queryText}
        onChange={(event) => handleQueryChange(event.target.value)}
        placeholder='Busque por título ou frases como "chamados críticos do desenvolvimento"'
        aria-label="Buscar chamados"
      />

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TicketFilters['status'] })}
          aria-label="Filtrar por status"
        >
          <option value="ALL">Todos os status</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TicketFilters['priority'] })}
          aria-label="Filtrar por prioridade"
        >
          <option value="ALL">Todas as prioridades</option>
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.team}
          onChange={(event) => onChange({ ...filters, team: event.target.value as TicketFilters['team'] })}
          aria-label="Filtrar por equipe"
        >
          <option value="ALL">Todas as equipes</option>
          {TICKET_TEAMS.map((team) => (
            <option key={team} value={team}>
              {TEAM_LABELS[team]}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.assignee}
          onChange={(event) => onChange({ ...filters, assignee: event.target.value })}
          aria-label="Filtrar por responsável"
        >
          <option value="ALL">Todos os responsáveis</option>
          {assignees.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {hasActiveFilter(filters) && (
          <Button variant="ghost" onClick={handleClear}>
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
