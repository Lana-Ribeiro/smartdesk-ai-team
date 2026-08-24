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

src/            (ainda não existe — código do SmartDesk)
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

## Arquitetura proposta para o SmartDesk

Ainda não implementada. Proposta inicial, deliberadamente simples, para não competir em complexidade com o objetivo real da demo:

- **Backend:** API REST simples (ex.: Node.js/Express), um único recurso `chamados` (tickets).
- **Persistência:** armazenamento em memória ou arquivo JSON local — sem banco de dados externo, para manter o setup trivial.
- **Frontend:** opcional nas primeiras Issues; pode começar como consumo via API/CLI e evoluir para uma interface simples depois.
- **Sem autenticação, sem filas, sem integrações externas** nas primeiras iterações.

Esta stack é um ponto de partida, não uma decisão travada — o `tech-lead` pode ajustá-la conforme as primeiras Issues chegarem, desde que a mudança seja explicada antes de aplicada.
