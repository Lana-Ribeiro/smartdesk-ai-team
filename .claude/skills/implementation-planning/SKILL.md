---
name: implementation-planning
description: Traduz um relatório de contexto e requisitos em um plano técnico de implementação — arquivos afetados, abordagem, casos de borda e critérios de validação. Usada pelo Tech Lead.
---

# Implementation Planning

## Quando usar

Após o `documentation-analyst` entregar o relatório de contexto e requisitos, antes de qualquer código ser escrito.

## Entrada esperada

O relatório de contexto e requisitos produzido pela skill `documentation-analysis`.

## Processo

1. **Defina a abordagem técnica** em alto nível — como a funcionalidade será implementada dado o contexto levantado. Prefira a solução mais simples que atenda aos requisitos; evite abstrações ou generalizações não pedidas.

2. **Liste os arquivos afetados**, indicando para cada um se será criado ou alterado, e o motivo.

3. **Descreva o comportamento esperado** em termos concretos o suficiente para o `developer` implementar sem precisar tomar decisões de design por conta própria.

4. **Levante casos de borda** relevantes ao escopo da task (ex.: status inválido, chamado inexistente, campos obrigatórios ausentes).

5. **Defina critérios de validação** que o `qa` usará depois — devem ser verificáveis, não vagos.

6. **Se a task exigir mudança de stack, nova dependência ou mudança estrutural** em relação ao que está em `docs/architecture.md`, explicite isso e justifique — não introduza essas mudanças silenciosamente dentro do plano.

## Saída esperada

Um plano técnico, por exemplo:

```
Abordagem: [descrição em alto nível]
Arquivos afetados:
  - src/... (criar/alterar): [motivo]
Comportamento esperado: [...]
Casos de borda: [...]
Critérios de validação: [...]
Mudanças de stack/arquitetura: [nenhuma | descrição + justificativa]
```

## O que esta skill não faz

- Não escreve código.
- Não executa testes ou validação — isso é papel da skill `qa-validation`.
