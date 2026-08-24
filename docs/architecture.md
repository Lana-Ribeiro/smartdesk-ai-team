# Arquitetura

Este documento cobre duas coisas separadas: a arquitetura do **pipeline de agentes** (o que já existe) e a arquitetura proposta para a **aplicação SmartDesk** (o que ainda será construído, Issue a Issue).

## Estrutura do repositório

```
.claude/
├── agents/
│   ├── orchestrator.md
│   ├── documentation-analyst.md
│   ├── tech-lead.md
│   ├── developer.md
│   └── qa.md
│
└── skills/
    ├── analyze-task/
    ├── documentation-analysis/
    ├── implementation-planning/
    ├── code-development/
    └── qa-validation/

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

O `orchestrator` é o único agente que enxerga o pipeline como um todo; os demais recebem apenas o artefato da etapa anterior como entrada, sem precisar do histórico completo da Issue.

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

- **Frontend:** React 18 + TypeScript, empacotado com Vite 5. Aplicação de página única, sem roteador — a listagem é a tela principal e o formulário e os detalhes aparecem em diálogo.
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
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601, atualizado a cada mudança de status |

Não há transições restritas entre status — qualquer um dos três pode ser escolhido a qualquer momento.

Esta stack continua sendo revisável: o `tech-lead` pode ajustá-la conforme novas Issues chegarem, desde que a mudança seja explicada antes de aplicada.
