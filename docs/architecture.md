# Arquitetura

Este documento cobre duas coisas separadas: a arquitetura do **pipeline de agentes** (quem faz o quê, e com quais skills) e a arquitetura da **aplicação SmartDesk** (construída incrementalmente, uma Issue por vez).

## Estrutura do repositório

```
.claude/
├── agents/
│   ├── orchestrator.md
│   ├── documentation-analyst.md
│   ├── tech-lead.md
│   ├── developer.md
│   ├── qa.md
│   └── github-manager.md
│
└── skills/
    ├── analyze-task/
    ├── documentation-analysis/
    ├── implementation-planning/
    ├── code-development/
    ├── qa-validation/
    └── github-management/

docs/
├── project-overview.md
├── architecture.md
└── development-workflow.md

src/                        código do SmartDesk
├── components/             componentes de UI + seus CSS Modules
├── lib/                    utilitários de domínio (status, formatação)
├── store/                  estado dos chamados e persistência
├── types/                  tipos do domínio
├── App.tsx                 composição da tela principal
├── main.tsx                bootstrap do React
└── index.css               tokens de design e estilos base

index.html
package.json
tsconfig.json
vite.config.ts
CLAUDE.md
```

## Relação entre agentes e skills

Cada agente usa exatamente uma skill principal, correspondente à sua etapa do pipeline. Isso mantém o escopo de cada agente estreito e o artefato de cada etapa previsível.

| Agente | Skill principal | Artefato produzido |
|---|---|---|
| `orchestrator` | `analyze-task` | Task estruturada (tipo, escopo, próximo agente) |
| `documentation-analyst` | `documentation-analysis` | Relatório de contexto e requisitos |
| `tech-lead` | `implementation-planning` | Plano técnico de implementação |
| `developer` | `code-development` | Código implementado |
| `qa` | `qa-validation` | Relatório de validação (aprovado / retorno) |
| `github-manager` | `github-management` | Comentários, movimentação no Project e fechamento de Issues |

O `orchestrator` é o único agente que enxerga o pipeline como um todo; os demais recebem apenas o artefato da etapa anterior como entrada, sem precisar do histórico completo da Issue.

O `github-manager` é o único agente que fala com o GitHub (via `gh`): ele registra o resultado de cada etapa na Issue, move o card no Project (BACKLOG → ANALYSIS → TECH LEAD → DEVELOPMENT → QA → DONE) e só fecha uma Issue quando o `orchestrator` pede. Não decide fluxo, não escreve código e nunca faz merge.

## Fluxo de dados entre agentes

```
GitHub Issue
   │
   ▼
[orchestrator]  --analyze-task-->  task estruturada
   │
   ▼
[documentation-analyst]  --documentation-analysis-->  relatório de contexto
   │
   ▼
[tech-lead]  --implementation-planning-->  plano técnico
   │
   ▼
[developer]  --code-development-->  implementação
   │
   ▼
[qa]  --qa-validation-->  aprovado → Done
                │
                └── reprovado → volta ao tech-lead ou developer
```

## Arquitetura do SmartDesk

Stack em uso desde a primeira versão funcional:

- **Frontend:** React 18 + TypeScript, empacotado com Vite 5. Aplicação de página única, sem roteador — três visões (Central de atendimento, Dashboard e Kanban) alternadas por estado em `App.tsx`, mais um sino de notificações no cabeçalho; formulário e detalhes aparecem em diálogo.
- **Persistência:** dados em memória (React state), espelhados no `localStorage` do navegador para sobreviverem a um refresh. Sem banco de dados e sem backend.
- **Estilo:** CSS Modules por componente, sobre um conjunto de tokens de design declarado em `src/index.css`. Sem biblioteca de UI.
- **Sem autenticação, usuários, permissões ou integrações externas.**

### Decisão: sem backend nesta versão

A proposta inicial deste documento previa uma API Node/Express com frontend opcional. A primeira Issue funcional exigiu interface completa (header, dashboard, formulário, detalhes, responsividade) e proibiu banco de dados — nesse cenário, um segundo processo apenas para trafegar dados em memória adicionaria setup sem valor de demonstração.

O acesso a dados foi isolado em `src/store/` (`ticketsStorage.ts` para persistência, `TicketsContext.tsx` para estado e ações). Introduzir uma API REST depois é uma mudança contida nesses dois arquivos: os componentes consomem apenas o hook `useTickets()` e não conhecem a origem dos dados.

### Modelo de dados

Um único recurso, `Ticket` (`src/types/ticket.ts`):

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `string` | gerado no cliente (`crypto.randomUUID`) |
| `title` | `string` | obrigatório |
| `description` | `string` | obrigatório |
| `status` | `'OPEN' \| 'IN_PROGRESS' \| 'CLOSED'` | inicia sempre em `OPEN` |
| `priority` | `'LOW' \| 'MEDIUM' \| 'HIGH'` | obrigatória na criação |
| `team` | `'SUPORTE' \| 'DESENVOLVIMENTO' \| 'INFRAESTRUTURA' \| 'FINANCEIRO'` | obrigatória na criação |
| `assignee` | `string?` | opcional; sempre um membro da `team` do chamado |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601, atualizado a cada alteração |

Não há transições restritas entre status — qualquer um dos três pode ser escolhido a qualquer momento.

**Equipes e responsáveis** vivem em um único arquivo (`src/lib/teams.ts`); adicionar uma equipe é uma mudança nele (mais o tipo `TicketTeam`), não na aplicação inteira. Ao trocar a equipe de um chamado, um responsável que não pertença à nova equipe é removido automaticamente — o sistema nunca mantém uma combinação inválida. Chamados salvos por versões anteriores são migrados na leitura do `localStorage` (equipe ausente vira a equipe padrão; responsável incompatível é removido), em vez de descartados.

### Regras de negócio desacopladas da interface

A lógica que não é visual fica em `src/lib/`, em funções puras e substituíveis:

- `attention.ts` — pontuação objetiva da seção "Precisa da sua atenção" (prioridade alta, chamado parado, aguardando atendimento, atividade recente).
- `naturalLanguageQuery.ts` — traduz frases como "chamados críticos do desenvolvimento" em filtros, por palavras-chave. **Não usa IA**: foi isolada para que um provedor de IA possa substituí-la no futuro sem tocar nos componentes.
- `ticketAssistant.ts` — sugere título e prioridade a partir da descrição, também por heurística local (sem chamadas externas, por não haver backend nem gestão de segredos).
- `ticketStats.ts` — contagens, filtros combináveis e indicadores compartilhados pela Central de atendimento e pelo Dashboard.

### Carregamento e erros

`TicketsContext` carrega os chamados de forma assíncrona simulada (atraso curto + `try/catch`), expondo `loadStatus` (`loading` / `ready` / `error`) e `reload()`. Isso torna reais os estados de skeleton, erro e "tentar novamente" — e deixa a troca por uma API um passo natural.

Esta stack continua sendo revisável: o `tech-lead` pode ajustá-la conforme novas Issues chegarem, desde que a mudança seja explicada antes de aplicada.
