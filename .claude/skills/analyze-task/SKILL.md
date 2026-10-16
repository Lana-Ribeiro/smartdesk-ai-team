---
name: analyze-task
description: Interpreta uma GitHub Issue (ou descrição de solicitação equivalente) e a transforma em uma task estruturada, com objetivo, tipo de solicitação e escopo aparente. Usada pelo Orchestrator no início do pipeline.
---

# Analyze Task

## Quando usar

No início do pipeline, quando uma GitHub Issue (ou pedido equivalente) chega e precisa ser transformada em algo acionável pelos demais agentes.

## Entrada esperada

- Título e corpo da Issue (ou texto livre descrevendo a solicitação).
- Nenhum contexto adicional é obrigatório nesta etapa — o levantamento de contexto aprofundado é responsabilidade da skill `documentation-analysis`, na etapa seguinte.

## Processo

1. **Identifique o tipo de solicitação:**
   - Nova funcionalidade
   - Ajuste ou melhoria em funcionalidade existente
   - Correção de bug
   - Outro (documentação, configuração, etc. — sinalizar se o pipeline completo faz sentido para o caso)

2. **Extraia o objetivo em uma frase clara.** Se a Issue for vaga a ponto de não permitir isso, não invente o objetivo — sinalize a ambiguidade.

3. **Identifique o escopo aparente:**
   - Quais das quatro funcionalidades do SmartDesk (criar, listar, visualizar, alterar status) são afetadas, se alguma.
   - Se a solicitação parece pequena (um único comportamento) ou ampla (múltiplas funcionalidades ou mudança estrutural).

4. **Identifique critérios de aceite**, se explícitos na Issue. Se não houver critérios explícitos, registre isso — o `qa`, mais adiante, precisará de critérios para validar.

## Saída esperada

Uma task estruturada, por exemplo:

```
Tipo: Nova funcionalidade
Objetivo: Permitir alterar o status de um chamado existente
Escopo: Alterar status (backend)
Critérios de aceite: [explícitos na Issue, ou "não especificados — levantar com o usuário"]
Observações: [ambiguidades ou informações faltantes, se houver]
```

## O que esta skill não faz

- Não levanta contexto de documentação ou código — isso é papel da skill `documentation-analysis`.
- Não propõe solução técnica.
