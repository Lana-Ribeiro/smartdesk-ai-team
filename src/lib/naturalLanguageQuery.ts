import type { TicketFilters } from './ticketStats'

/**
 * Interpretação de busca por linguagem natural.
 *
 * Primeira versão SEM IA: apenas correspondência de palavras-chave. A lógica
 * fica isolada neste módulo, desacoplada da camada visual — trocar por um
 * provedor de IA no futuro é substituir esta função, sem tocar nos componentes.
 *
 * Entrada: texto livre ("chamados críticos do desenvolvimento").
 * Saída: filtros reconhecidos + o texto restante para busca por título.
 */

export interface ParsedQuery {
  filters: Partial<TicketFilters>
  /** Texto que sobrou depois de remover os termos reconhecidos. */
  searchText: string
}

interface Rule {
  /** Palavras-chave que disparam a regra (já normalizadas, sem acento). */
  keywords: string[]
  apply: (filters: Partial<TicketFilters>) => void
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

const RULES: Rule[] = [
  { keywords: ['critico', 'criticos', 'urgente', 'urgentes', 'alta prioridade', 'prioridade alta'], apply: (f) => { f.priority = 'HIGH' } },
  { keywords: ['media prioridade', 'prioridade media'], apply: (f) => { f.priority = 'MEDIUM' } },
  { keywords: ['baixa prioridade', 'prioridade baixa'], apply: (f) => { f.priority = 'LOW' } },
  { keywords: ['aguardando', 'na fila', 'sem atendimento', 'nao atendido', 'nao atendidos'], apply: (f) => { f.status = 'OPEN' } },
  { keywords: ['em andamento', 'andamento'], apply: (f) => { f.status = 'IN_PROGRESS' } },
  { keywords: ['resolvido', 'resolvidos', 'concluido', 'concluidos', 'fechado', 'fechados'], apply: (f) => { f.status = 'CLOSED' } },
  { keywords: ['desenvolvimento', ' dev', 'time de dev'], apply: (f) => { f.team = 'DESENVOLVIMENTO' } },
  { keywords: ['suporte', 'atendimento ao cliente'], apply: (f) => { f.team = 'SUPORTE' } },
  { keywords: ['infra', 'infraestrutura'], apply: (f) => { f.team = 'INFRAESTRUTURA' } },
]

export function parseNaturalQuery(text: string): ParsedQuery {
  const normalized = ` ${normalize(text)} `
  const filters: Partial<TicketFilters> = {}
  let leftover = normalized

  for (const rule of RULES) {
    // Tenta as palavras-chave da mais longa para a mais curta, para não deixar
    // fragmentos (ex.: casar "critico" dentro de "criticos" e sobrar "s").
    const keywords = [...rule.keywords].sort((a, b) => b.length - a.length)
    const matched = keywords.find((keyword) => leftover.includes(keyword))
    if (matched) {
      rule.apply(filters)
      leftover = leftover.split(matched).join(' ')
    }
  }

  // Remove palavras de ligação e tokens curtos residuais que não ajudam a busca.
  const stopWords = new Set(['chamado', 'chamados', 'do', 'da', 'de', 'os', 'as', 'e', 'com', 'the'])
  const searchText = leftover
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word))
    .join(' ')
    .trim()

  return { filters, searchText }
}
