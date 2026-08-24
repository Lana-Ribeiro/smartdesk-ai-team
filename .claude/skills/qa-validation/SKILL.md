---
name: qa-validation
description: Valida uma implementação contra os critérios de aceite da Issue e o plano técnico, incluindo os casos de borda previstos. Produz aprovação ou apontamentos acionáveis. Usada pelo QA.
---

# QA Validation

## Quando usar

Após o `developer` entregar a implementação, como última etapa antes de a task ser considerada "Done".

## Entrada esperada

- A implementação (código) produzida pela skill `code-development`.
- Os critérios de aceite da Issue original (via task estruturada do `orchestrator`).
- O plano técnico do `tech-lead`, incluindo os critérios de validação e casos de borda definidos nele.

## Processo

1. **Verifique cada critério de aceite individualmente.** Marque cada um como atendido ou não atendido — evite avaliações genéricas como "parece OK".

2. **Verifique os casos de borda listados no plano técnico.** Confirme que cada um foi tratado como esperado.

3. **Rode testes e verificações disponíveis no repositório**, se existirem (linters, testes automatizados, scripts de verificação).

4. **Verifique aderência ao plano** — a implementação faz o que o plano descreveu, sem desvios não justificados?

5. **Classifique qualquer problema encontrado** como:
   - Problema de implementação (o código não faz o que o plano pedia) → retorna ao `developer`.
   - Problema de plano (o plano estava incompleto ou incorreto) → retorna ao `tech-lead`.

## Saída esperada

Um relatório de validação, por exemplo:

```
Critérios de aceite:
  - [critério]: atendido / não atendido
Casos de borda:
  - [caso]: tratado / não tratado
Testes executados: [...]
Resultado: Aprovado (pronto para Done) | Reprovado
Apontamentos: [lista específica e acionável, se reprovado]
Origem do problema: N/A | Implementação | Plano
```

## O que esta skill não faz

- Não corrige código ou plano diretamente — apenas reporta.
- Não redefine critérios de aceite.
