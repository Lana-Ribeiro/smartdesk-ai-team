import type { TicketPriority } from '../types/ticket'

export interface TicketSuggestion {
  title: string
  priority: TicketPriority
}

interface CategoryRule {
  keywords: string[]
  title: string
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: ['senha', 'login', 'acessar', 'acesso', 'inválid', 'logar', 'entrar no sistema'],
    title: 'Problema de acesso ao sistema',
  },
  {
    keywords: ['impressora', 'imprimir', 'impressão'],
    title: 'Problema com impressora',
  },
  {
    keywords: ['lento', 'lentidão', 'travando', 'travou', 'demorando'],
    title: 'Lentidão no sistema',
  },
  {
    keywords: ['internet', 'rede', 'wifi', 'conexão'],
    title: 'Problema de conexão',
  },
  {
    keywords: ['email', 'e-mail'],
    title: 'Problema com e-mail',
  },
  {
    keywords: ['erro', 'bug', 'falha', 'não funciona', 'quebrado'],
    title: 'Erro no sistema',
  },
]

const HIGH_PRIORITY_KEYWORDS = [
  'urgente',
  'crítico',
  'critico',
  'não consigo',
  'nao consigo',
  'parou',
  'fora do ar',
  'caiu',
  'bloqueado',
  'bloqueio',
  'impossível',
  'impossivel',
]

const LOW_PRIORITY_KEYWORDS = [
  'dúvida',
  'duvida',
  'sugestão',
  'sugestao',
  'melhoria',
  'gostaria',
  'quando possível',
  'quando possivel',
  'sem pressa',
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function matchesAny(normalizedText: string, keywords: string[]): boolean {
  return keywords.some((keyword) => normalizedText.includes(normalize(keyword)))
}

function suggestTitle(normalizedText: string, description: string): string {
  const category = CATEGORY_RULES.find((rule) => matchesAny(normalizedText, rule.keywords))
  if (category) return category.title

  const firstSentence = description.split(/[.!?\n]/)[0].trim()
  if (!firstSentence) return 'Chamado sem título sugerido'

  const truncated =
    firstSentence.length > 60 ? `${firstSentence.slice(0, 60).trim()}...` : firstSentence
  return truncated.charAt(0).toUpperCase() + truncated.slice(1)
}

function suggestPriority(normalizedText: string): TicketPriority {
  if (matchesAny(normalizedText, HIGH_PRIORITY_KEYWORDS)) return 'HIGH'
  if (matchesAny(normalizedText, LOW_PRIORITY_KEYWORDS)) return 'LOW'
  return 'MEDIUM'
}

/** Heurística local (sem chamadas externas) para sugerir título e prioridade a partir da descrição do chamado. */
export function suggestFromDescription(description: string): TicketSuggestion | null {
  const trimmed = description.trim()
  if (trimmed.length < 10) return null

  const normalized = normalize(trimmed)

  return {
    title: suggestTitle(normalized, trimmed),
    priority: suggestPriority(normalized),
  }
}
