const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : formatter.format(date)
}
