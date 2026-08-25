# SmartDesk

Sistema simples de gerenciamento de chamados (help desk), usado como aplicação de exemplo para demonstrar um fluxo de desenvolvimento multi-agente no Claude Code.

Contexto do projeto e do pipeline de agentes: [CLAUDE.md](CLAUDE.md) e [docs/](docs/).

## Requisitos

- Node.js 18 ou superior
- npm

## Como executar

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | Verifica os tipos e gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run typecheck` | Roda apenas a verificação de tipos |

## Funcionalidades

- **Criar chamado** — título e descrição; todo chamado nasce com status `OPEN`.
- **Listar chamados** — dashboard com título e status de cada chamado.
- **Visualizar chamado** — título, descrição, status e datas de criação/atualização.
- **Alterar status** — entre `OPEN`, `IN_PROGRESS` e `CLOSED`.

Não há autenticação, usuários, permissões nem banco de dados. Os chamados ficam em memória e são espelhados no `localStorage` do navegador, então sobrevivem a um refresh mas são locais àquele navegador.

## Stack

React 18 + TypeScript + Vite 5, com CSS Modules. Ver [docs/architecture.md](docs/architecture.md) para a justificativa das decisões e o modelo de dados.
