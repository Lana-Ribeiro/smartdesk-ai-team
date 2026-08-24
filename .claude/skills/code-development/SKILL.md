---
name: code-development
description: Implementa um plano técnico em código, seguindo as convenções do projeto e sem expandir escopo além do que foi planejado. Usada pelo Developer.
---

# Code Development

## Quando usar

Após o `tech-lead` entregar o plano técnico, para implementar exatamente o que foi planejado.

## Entrada esperada

O plano técnico produzido pela skill `implementation-planning`.

## Processo

1. **Siga o plano arquivo por arquivo.** Não adicione arquivos, funções ou abstrações que não estejam no plano.

2. **Mantenha a implementação simples**, coerente com o princípio de que o SmartDesk deve permanecer um sistema simples de demonstração — evite generalizar para casos hipotéticos futuros.

3. **Siga as convenções já estabelecidas** no código existente (nomenclatura, organização de pastas, estilo). Se ainda não houver código (primeira Issue), siga a stack proposta em `docs/architecture.md`.

4. **Trate os casos de borda listados no plano.** Não adicione tratamento de erro para cenários fora do que o plano previu.

5. **Se, durante a implementação, o plano se mostrar incompleto ou inconsistente com o código real**, pare e sinalize — não decida sozinho como preencher a lacuna.

6. **Não faça commit ou push.** Isso só ocorre mediante autorização explícita do usuário.

## Saída esperada

- O código implementado, refletindo fielmente o plano técnico.
- Um resumo do que foi implementado, para o `developer` encaminhar ao `qa`.

## O que esta skill não faz

- Não decide arquitetura ou abordagem — isso já deve vir do plano técnico.
- Não valida formalmente a implementação — isso é papel da skill `qa-validation`.
