---
name: github-management
description: Procedimentos seguros para executar no GitHub as operações solicitadas pelo Orchestrator — ler e comentar Issues, mover cards no Project, associar Pull Requests e fechar Issues. Usada exclusivamente pelo agente github-manager.
---

# GitHub Management

## Objetivo

Fornecer os procedimentos seguros para executar operações no GitHub solicitadas pelo `orchestrator`. Esta skill é de uso exclusivo do agente `github-manager` — nenhum outro agente deve executar operações de GitHub diretamente.

## GitHub

- Repository: `Lana-Ribeiro/smartdesk-ai-team`
- Project: ISSUES BOARD
- Project number: `2`
- Project ID: `PVT_kwHOBm8J284BhWTX`
- Status field: `PVTSSF_lAHOBm8J284BhWTXzhgSWWU`

Status options:

| Status | Option ID |
|---|---|
| BACKLOG | `f75ad846` |
| ANALYSIS | `47fc9ee4` |
| TECH LEAD | `98236657` |
| DEVELOPMENT | `ce9d32d6` |
| QA | `53344112` |
| DONE | `a77207b4` |

Estes IDs são fixos para este projeto. Nunca inventá-los, adivinhá-los ou re-derivá-los.

## Operações permitidas

### 1. Ler Issue

Utilizar:

```bash
gh issue view <numero> --repo Lana-Ribeiro/smartdesk-ai-team
```

Antes de realizar qualquer operação, confirmar que a Issue existe.

### 2. Comentar Issue

Utilizar:

```bash
gh issue comment <numero> --repo Lana-Ribeiro/smartdesk-ai-team --body "<texto>"
```

- Os comentários devem ser curtos e objetivos.
- O `github-manager` nunca deve inventar informações sobre o trabalho realizado pelos outros agentes.
- Ele deve publicar somente o resumo recebido do `orchestrator`.

### 3. Localizar item no Project

Utilizar:

```bash
gh project item-list 2 --owner Lana-Ribeiro --format json
```

Localizar a Issue pelo número e obter o item ID a partir da saída. Nunca assumir ou inventar o item ID — se a Issue ainda não estiver no Project, adicioná-la primeiro (`gh project item-add`) e usar o item ID retornado por esse comando.

### 4. Alterar status

Utilizar:

```bash
gh project item-edit --id <item-id> --project-id PVT_kwHOBm8J284BhWTX --field-id PVTSSF_lAHOBm8J284BhWTXzhgSWWU --single-select-option-id <option-id>
```

- Alterar somente o campo Status.
- Nunca alterar outros campos do Project sem autorização explícita.

### 5. Associar Pull Request

- Confirmar que o PR existe (`gh pr view <numero-ou-url> --repo Lana-Ribeiro/smartdesk-ai-team`).
- Registrar o PR na Issue quando solicitado (comentário com o link do PR).
- Não utilizar automaticamente:
  - `Closes #N`
  - `Fixes #N`
  - `Resolves #N`
- O PR não deve fechar automaticamente a Issue.

### 6. Fechar Issue

Utilizar:

```bash
gh issue close <numero> --repo Lana-Ribeiro/smartdesk-ai-team --comment "<motivo>"
```

- Somente quando o `orchestrator` solicitar explicitamente.
- Nunca fechar uma Issue apenas porque o QA aprovou, sem receber a instrução do `orchestrator`.

## Regras de segurança

Nunca:

- fazer merge de Pull Request;
- fazer force push;
- apagar branches;
- alterar histórico Git;
- fechar Issue sem autorização;
- mover Issue para DONE sem autorização do `orchestrator`;
- inventar IDs;
- alterar código da aplicação.

## Tratamento de erros

Se qualquer operação falhar:

1. Não tentar contornar a falha de forma destrutiva.
2. Informar o erro ao `orchestrator`.
3. Informar qual comando falhou.
4. Informar qual operação não foi concluída.
5. Não declarar a etapa como concluída.

## Resultado das operações

Depois de cada operação, retornar ao `orchestrator`:

- operação executada;
- Issue;
- status anterior, quando disponível;
- status novo, quando aplicável;
- comentário publicado, quando aplicável;
- PR associado, quando aplicável;
- erro, se houver.
