import type { Ticket, TicketPriority, TicketStatus, TicketTeam } from '../types/ticket'
import { formatDate } from '../lib/formatDate'
import { PRIORITY_LABELS, TICKET_PRIORITIES } from '../lib/priorities'
import { TEAM_LABELS, TICKET_TEAMS, getTeamMembers } from '../lib/teams'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import { StatusSelect } from './StatusSelect'
import styles from './TicketDetails.module.css'

interface TicketDetailsProps {
  ticket: Ticket
  onStatusChange: (status: TicketStatus) => void
  onPriorityChange: (priority: TicketPriority) => void
  onTeamChange: (team: TicketTeam) => void
  onAssigneeChange: (assignee: string) => void
}

export function TicketDetails({
  ticket,
  onStatusChange,
  onPriorityChange,
  onTeamChange,
  onAssigneeChange,
}: TicketDetailsProps) {
  const members = getTeamMembers(ticket.team)

  return (
    <article className={styles.details}>
      <div className={styles.heading}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.badges}>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className={styles.assignment}>
        <span>👥 {TEAM_LABELS[ticket.team]}</span>
        <span>👤 {ticket.assignee ?? 'Sem responsável'}</span>
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Descrição</h4>
        <p className={styles.description}>{ticket.description}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Status</h4>
        <StatusSelect value={ticket.status} onChange={onStatusChange} />
      </section>

      <section className={styles.section}>
        <label className={styles.sectionTitle} htmlFor="details-priority">
          Prioridade
        </label>
        <select
          id="details-priority"
          className={styles.control}
          value={ticket.priority}
          onChange={(event) => onPriorityChange(event.target.value as TicketPriority)}
        >
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </section>

      <section className={styles.section}>
        <label className={styles.sectionTitle} htmlFor="details-team">
          Equipe
        </label>
        <select
          id="details-team"
          className={styles.control}
          value={ticket.team}
          onChange={(event) => onTeamChange(event.target.value as TicketTeam)}
        >
          {TICKET_TEAMS.map((team) => (
            <option key={team} value={team}>
              {TEAM_LABELS[team]}
            </option>
          ))}
        </select>
        <p className={styles.hint}>
          Trocar a equipe remove o responsável atual se ele não pertencer à nova equipe.
        </p>
      </section>

      <section className={styles.section}>
        <label className={styles.sectionTitle} htmlFor="details-assignee">
          Responsável
        </label>
        <select
          id="details-assignee"
          className={styles.control}
          value={ticket.assignee ?? ''}
          onChange={(event) => onAssigneeChange(event.target.value)}
        >
          <option value="">Sem responsável definido</option>
          {members.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </section>

      <dl className={styles.meta}>
        <div>
          <dt>Criado em</dt>
          <dd>{formatDate(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt>Última atualização</dt>
          <dd>{formatDate(ticket.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  )
}
