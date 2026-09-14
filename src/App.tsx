import { useState } from 'react'
import type { NewTicketInput, TicketPriority, TicketStatus, TicketTeam } from './types/ticket'
import { useTickets } from './store/TicketsContext'
import { Dashboard } from './components/Dashboard'
import { Header } from './components/Header'
import type { AppView } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { Modal } from './components/Modal'
import { OperationalCenter } from './components/OperationalCenter'
import { TicketDetails } from './components/TicketDetails'
import { TicketForm } from './components/TicketForm'
import styles from './App.module.css'

export default function App() {
  const {
    tickets,
    createTicket,
    updateTicketStatus,
    updateTicketPriority,
    updateTicketTeam,
    updateTicketAssignee,
    getTicket,
  } = useTickets()
  const [view, setView] = useState<AppView>('tickets')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedTicket = selectedId ? getTicket(selectedId) : undefined

  function handleCreate(input: NewTicketInput) {
    const ticket = createTicket(input)
    setIsFormOpen(false)
    setSelectedId(ticket.id)
  }

  return (
    <div className={styles.app}>
      <Header view={view} onNavigate={setView} />

      <main className={styles.main}>
        {view === 'dashboard' ? (
          <Dashboard tickets={tickets} onSelect={setSelectedId} />
        ) : view === 'kanban' ? (
          <KanbanBoard tickets={tickets} onSelect={setSelectedId} />
        ) : (
          <OperationalCenter
            onNewTicket={() => setIsFormOpen(true)}
            onOpenDetails={setSelectedId}
          />
        )}
      </main>

      {isFormOpen && (
        <Modal title="Novo chamado" onClose={() => setIsFormOpen(false)}>
          <TicketForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
        </Modal>
      )}

      {selectedTicket && (
        <Modal title="Detalhes do chamado" onClose={() => setSelectedId(null)}>
          <TicketDetails
            ticket={selectedTicket}
            onStatusChange={(status: TicketStatus) => updateTicketStatus(selectedTicket.id, status)}
            onPriorityChange={(priority: TicketPriority) =>
              updateTicketPriority(selectedTicket.id, priority)
            }
            onTeamChange={(team: TicketTeam) => updateTicketTeam(selectedTicket.id, team)}
            onAssigneeChange={(assignee: string) =>
              updateTicketAssignee(selectedTicket.id, assignee)
            }
          />
        </Modal>
      )}
    </div>
  )
}
