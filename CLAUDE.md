# SmartDesk AI Team

Este repositório é um projeto de demonstração que combina duas coisas:

1. **SmartDesk** — um sistema simples de gerenciamento de chamados (help desk), usado apenas como aplicação de exemplo.
2. **AI Team** — uma estrutura de agentes e skills do Claude Code que demonstra um fluxo de desenvolvimento de software orientado por múltiplos agentes especializados, partindo de uma GitHub Issue até a entrega da funcionalidade.

O objetivo principal deste repositório **não é o SmartDesk em si**, e sim demonstrar o fluxo de trabalho multi-agente. O SmartDesk deve permanecer propositalmente simples — ele existe para dar contexto real às Issues que disparam o fluxo.

## Estado atual

O SmartDesk está funcional e já cresceu por várias Issues: chamados com prioridade, equipe e responsável; central de atendimento orientada à ação; Dashboard; Kanban; assistente de criação (heurística local); e central de notificações. Detalhes em [docs/project-overview.md](docs/project-overview.md).

Stack: **React 18 + TypeScript + Vite**, sem backend — os dados ficam em memória e são espelhados no `localStorage`. Detalhes e justificativa em [docs/architecture.md](docs/architecture.md).

```bash
npm install
npm run dev      # http://localhost:5173
```

Novas funcionalidades continuam sendo criadas incrementalmente, uma Issue por vez, seguindo o fluxo descrito abaixo.

## Fluxo de trabalho

```
GitHub Issue → Orchestrator → Documentation Analyst → Tech Lead → Developer → QA → Done
```

Cada nova Issue no repositório representa uma solicitação de desenvolvimento. O `orchestrator` interpreta a Issue e aciona os demais agentes em sequência, cada um usando apenas as skills necessárias para sua etapa. Detalhes completos em [docs/development-workflow.md](docs/development-workflow.md).

## Estrutura do repositório

```
.claude/
├── agents/          Definições dos 6 agentes do pipeline
└── skills/          Uma skill por etapa do pipeline

docs/
├── project-overview.md      O que é o SmartDesk e o objetivo da demo
├── architecture.md          Estrutura do repo, stack e modelo de dados
└── development-workflow.md  O pipeline Issue → Done em detalhe

src/
├── components/      Componentes de UI (cada um com seu CSS Module)
├── lib/             Utilitários de domínio (status, formatação de data)
├── store/           Estado dos chamados e camada de persistência
├── types/           Tipos do domínio
├── App.tsx          Composição da tela principal
├── main.tsx         Bootstrap do React
└── index.css        Tokens de design e estilos base
```

## Agentes disponíveis

| Agente | Responsabilidade |
|---|---|
| `orchestrator` | Interpreta a Issue, aciona os agentes na ordem correta, acompanha o progresso |
| `documentation-analyst` | Levanta contexto e requisitos a partir da documentação e do código existente |
| `tech-lead` | Traduz os requisitos em um plano técnico de implementação |
| `developer` | Implementa o plano em código |
| `qa` | Valida a implementação contra os critérios de aceite da Issue |
| `github-manager` | Único agente que fala com o GitHub: comenta Issues, move o card no Project e fecha a Issue quando o `orchestrator` pede |

Ver [docs/architecture.md](docs/architecture.md) para a relação entre agentes e skills.

## Convenções de trabalho

- Cada agente deve usar **apenas** as skills listadas em sua própria definição — não acumule responsabilidades entre agentes.
- Mudanças de escopo maior (nova arquitetura, novas dependências, mudanças na stack) devem ser explicadas antes de implementadas.
- Nenhum agente deve fazer commit ou push sem autorização explícita do usuário nesta sessão.
- Ao adicionar uma nova funcionalidade ao SmartDesk, mantenha o sistema simples — o valor da demo está no processo, não na complexidade da aplicação.
- Todo acesso a dados passa por `src/store/` — componentes consomem o hook `useTickets()` e não conhecem a origem dos dados. Isso mantém a troca por uma API futura contida em dois arquivos.
- Estilos ficam em CSS Modules ao lado do componente, usando os tokens de `src/index.css`. Sem valores de cor ou espaçamento fixos espalhados pelos componentes.
