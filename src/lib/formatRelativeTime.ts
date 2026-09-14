const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

/** Formata uma data ISO como tempo relativo em pt-BR (ex.: "há alguns minutos", "ontem"). */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''

  const diffSeconds = Math.max(0, (Date.now() - date.getTime()) / 1000)

  if (diffSeconds < 60) return 'agora mesmo'
  if (diffSeconds < 5 * MINUTE) return 'há alguns minutos'
  if (diffSeconds < HOUR) {
    const minutes = Math.floor(diffSeconds / MINUTE)
    return `há ${minutes} minuto${minutes === 1 ? '' : 's'}`
  }
  if (diffSeconds < DAY) {
    const hours = Math.floor(diffSeconds / HOUR)
    return `há ${hours} hora${hours === 1 ? '' : 's'}`
  }
  if (diffSeconds < 2 * DAY) return 'ontem'

  const days = Math.floor(diffSeconds / DAY)
  return `há ${days} dias`
}
