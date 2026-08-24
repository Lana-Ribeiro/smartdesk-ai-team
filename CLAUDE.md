# SmartDesk AI Team

Este repositório é um projeto de demonstração que combina duas coisas:

1. **SmartDesk** — um sistema simples de gerenciamento de chamados (help desk), usado apenas como aplicação de exemplo.
2. **AI Team** — uma estrutura de agentes e skills do Claude Code que demonstra um fluxo de desenvolvimento de software orientado por múltiplos agentes especializados, partindo de uma GitHub Issue até a entrega da funcionalidade.

O objetivo principal deste repositório **não é o SmartDesk em si**, e sim demonstrar o fluxo de trabalho multi-agente. O SmartDesk deve permanecer propositalmente simples — ele existe para dar contexto real às Issues que disparam o fluxo.

## Estado atual

Neste momento o repositório contém **apenas a estrutura de agentes, skills e documentação**. Nenhuma funcionalidade do SmartDesk foi implementada ainda. O código da aplicação será criado incrementalmente, uma Issue por vez, seguindo o fluxo descrito abaixo.

## Fluxo de trabalho

```
GitHub Issue → Orchestrator → Documentation Analyst → Tech Lead → Developer → QA → Done
```

Cada nova Issue no repositório representa uma solicitação de desenvolvimento. O `orchestrator` interpreta a Issue e aciona os demais agentes em sequência, cada um usando apenas as skills necessárias para sua etapa. Detalhes completos em [docs/development-workflow.md](docs/development-workflow.md).

## Estrutura do repositório

```
.claude/
├── agents/          Definições dos 5 agentes do pipeline
└── skills/          Uma skill por etapa do pipeline

docs/
├── project-overview.md      O que é o SmartDesk e o objetivo da demo
├── architecture.md          Estrutura do repo e stack técnica proposta
└── development-workflow.md  O pipeline Issue → Done em detalhe

src/                 (ainda não existe — código do SmartDesk, criado por Issue)
```

## Agentes disponíveis

| Agente | Responsabilidade |
|---|---|
| `orchestrator` | Interpreta a Issue, aciona os agentes na ordem correta, acompanha o progresso |
| `documentation-analyst` | Levanta contexto e requisitos a partir da documentação e do código existente |
| `tech-lead` | Traduz os requisitos em um plano técnico de implementação |
| `developer` | Implementa o plano em código |
| `qa` | Valida a implementação contra os critérios de aceite da Issue |

Ver [docs/architecture.md](docs/architecture.md) para a relação entre agentes e skills.

## Convenções de trabalho

- Cada agente deve usar **apenas** as skills listadas em sua própria definição — não acumule responsabilidades entre agentes.
- Mudanças de escopo maior (nova arquitetura, novas dependências, mudanças na stack) devem ser explicadas antes de implementadas.
- Nenhum agente deve fazer commit ou push sem autorização explícita do usuário nesta sessão.
- Ao adicionar uma nova funcionalidade ao SmartDesk, mantenha o sistema simples — o valor da demo está no processo, não na complexidade da aplicação.
