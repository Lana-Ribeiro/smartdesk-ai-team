# Fluxo de Desenvolvimento

Este documento descreve, passo a passo, como uma GitHub Issue se transforma em uma funcionalidade validada do SmartDesk.

## Visão geral

```
GitHub Issue → Orchestrator → Documentation Analyst → Tech Lead → Developer → QA → Done
```

Cada seta representa uma entrega de artefato de um agente para o próximo. Nenhum agente pula etapas ou assume a responsabilidade de outro.

## Etapa 1 — GitHub Issue

Uma Issue nova no repositório é o gatilho do fluxo. Ela deve descrever, em linguagem natural, o que se espera (nova funcionalidade, ajuste, correção). Não há um template obrigatório nesta fase inicial — o `orchestrator` é responsável por extrair estrutura a partir de uma descrição livre.

## Etapa 2 — Orchestrator

- **Entrada:** texto da Issue.
- **Skill usada:** `analyze-task`.
- **Ação:** interpreta a Issue, classifica o tipo de solicitação (nova funcionalidade, bug, ajuste), identifica o escopo aparente e aciona o `documentation-analyst`.
- **Saída:** uma task estruturada (objetivo, escopo, áreas do sistema afetadas).

## Etapa 3 — Documentation Analyst

- **Entrada:** task estruturada do orchestrator.
- **Skill usada:** `documentation-analysis`.
- **Ação:** revisa `docs/` e o código existente em `src/` (quando houver) para levantar contexto, restrições e requisitos relevantes à task. Não propõe solução técnica — apenas contexto e requisitos.
- **Saída:** relatório de contexto e requisitos, entregue ao `tech-lead`.

## Etapa 4 — Tech Lead

- **Entrada:** relatório de contexto e requisitos.
- **Skill usada:** `implementation-planning`.
- **Ação:** traduz os requisitos em um plano técnico — quais arquivos criar ou alterar, abordagem de implementação, casos de borda a considerar, e o que precisa ser validado depois. Não escreve código.
- **Saída:** plano técnico, entregue ao `developer`.

## Etapa 5 — Developer

- **Entrada:** plano técnico.
- **Skill usada:** `code-development`.
- **Ação:** implementa exatamente o que está no plano, seguindo as convenções do projeto. Mudanças fora do escopo do plano devem ser sinalizadas, não implementadas silenciosamente.
- **Saída:** implementação (código), entregue ao `qa`.

## Etapa 6 — QA

- **Entrada:** implementação + critérios de aceite originais da Issue.
- **Skill usada:** `qa-validation`.
- **Ação:** valida a implementação contra os critérios de aceite e o plano técnico. Verifica casos de borda levantados na etapa 4.
- **Saída:** aprovação (→ Done) ou retorno com apontamentos (→ volta ao `tech-lead` ou `developer`, conforme a natureza do problema).

## Etapa 7 — Done

A Issue é considerada concluída quando o QA aprova a implementação e o Pull Request é aberto. O PR **nunca** usa `Closes #N` / `Fixes #N` — o fechamento da Issue é uma decisão do `orchestrator`, executada pelo `github-manager`. Nenhum agente faz merge.

## Registro no GitHub (github-manager)

A cada etapa, o `orchestrator` pede ao `github-manager` (skill `github-management`, via `gh`) que comente o resultado na Issue e mova o card no GitHub Project:

| Após a etapa | Coluna do Project |
|---|---|
| Documentation Analyst | `ANALYSIS` |
| Tech Lead | `TECH LEAD` |
| Developer | `DEVELOPMENT` |
| QA aprovado | `QA` |
| Entrega (PR criado) | `DONE` |

Se o QA reprovar, o card volta para `DEVELOPMENT` e o `developer` corrige apenas o que foi apontado. O `github-manager` não decide fluxo, não analisa requisitos e não escreve código — só executa o que o `orchestrator` solicita.

## Regras gerais do fluxo

- Cada agente só deve usar sua skill principal — não deve reimplementar o trabalho de outro agente.
- Se uma etapa não tiver informação suficiente para prosseguir, o agente deve sinalizar isso explicitamente em vez de assumir.
- O fluxo é sequencial: não há paralelismo entre etapas neste modelo inicial.
