---
name: documentation-analysis
description: Revisa a documentação do projeto e o código existente para levantar contexto e requisitos relevantes a uma task. Produz um relatório de contexto e requisitos, sem propor solução técnica. Usada pelo Documentation Analyst.
---

# Documentation Analysis

## Quando usar

Após o `orchestrator` estruturar a task, antes de qualquer planejamento técnico.

## Entrada esperada

A task estruturada produzida pela skill `analyze-task`.

## Processo

1. **Revise a documentação do projeto:**
   - `docs/project-overview.md` — para confirmar se a task está alinhada ao propósito do SmartDesk.
   - `docs/architecture.md` — para entender a estrutura e stack relevantes.
   - `docs/development-workflow.md` — apenas se a task envolver o próprio pipeline de agentes.

2. **Revise o código existente** em `src/` (quando existir) relacionado ao escopo da task. Se `src/` ainda não existir, registre isso explicitamente — significa que a task provavelmente é a primeira a tocar naquela área do sistema.

3. **Liste requisitos explícitos** — o que a Issue pede diretamente.

4. **Liste requisitos implícitos** — o que é necessário para a funcionalidade fazer sentido, mesmo que não tenha sido dito (ex.: "alterar status" implica que deve existir um conjunto válido de status).

5. **Liste restrições relevantes** — convenções já estabelecidas, decisões de arquitetura existentes, ou limitações da stack atual.

6. **Liste lacunas** — perguntas que não podem ser respondidas com o que existe hoje no repositório.

## Saída esperada

Um relatório de contexto e requisitos, por exemplo:

```
Contexto atual: [o que já existe hoje relacionado à task]
Documentos relevantes: [arquivos consultados]
Requisitos explícitos: [...]
Requisitos implícitos: [...]
Restrições: [...]
Lacunas: [...]
```

## O que esta skill não faz

- Não propõe arquitetura de solução, arquivos a alterar ou abordagem técnica — isso é papel da skill `implementation-planning`.
- Não decide viabilidade da task.
