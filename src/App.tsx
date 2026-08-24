import { useState } from 'react'
import type { NewTicketInput, TicketStatus } from './types/ticket'
import { useTickets } from './store/TicketsContext'
import { Button } from './components/Button'
import { EmptyState } from './components/EmptyState'
import { Header } from './components/Header'
import { Modal } from './components/Modal'
import { TicketDetails } from './components/TicketDetails'
import { TicketForm } from './components/TicketForm'
import { TicketList } from './components/TicketList'
import styles from './App.module.css'

export default function App() {
  const { tickets, createTicket, updateTicketStatus, getTicket } = useTickets()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedTicket = selectedId ? getTicket(selectedId) : undefined

  function handleCreate(input: NewTicketInput) {
    const ticket = createTicket(input)
    setIsFormOpen(false)
    setSelectedId(ticket.id)
  }

  function handleStatusChange(status: TicketStatus) {
    if (selectedTicket) updateTicketStatus(selectedTicket.id, status)
  }

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <div>
            <h1 className={styles.heading}>Chamados</h1>
            <p className={styles.subheading}>
              {tickets.length === 0
                ? 'Nenhum chamado registrado'
                : `${tickets.length} ${tickets.length === 1 ? 'chamado registrado' : 'chamados registrados'}`}
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>Novo chamado</Button>
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            title="Sem chamados por aqui"
            description="Crie o primeiro chamado para começar a acompanhar as solicitações no SmartDesk."
            action={<Button onClick={() => setIsFormOpen(true)}>Novo chamado</Button>}
          />
        ) : (
          <TicketList tickets={tickets} onSelect={setSelectedId} />
        )}
      </main>

      {isFormOpen && (
        <Modal title="Novo chamado" onClose={() => setIsFormOpen(false)}>
          <TicketForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
        </Modal>
      )}

      {selectedTicket && (
        <Modal title="Detalhes do chamado" onClose={() => setSelectedId(null)}>
          <TicketDetails ticket={selectedTicket} onStatusChange={handleStatusChange} />
        </Modal>
      )}
    </div>
  )
}
