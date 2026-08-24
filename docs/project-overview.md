# Visão Geral do Projeto

## O que é este repositório

O **SmartDesk AI Team** é um projeto de demonstração com dois objetivos sobrepostos:

1. Demonstrar um **fluxo de desenvolvimento de software orientado por múltiplos agentes especializados** no Claude Code, partindo de uma GitHub Issue até a entrega validada de uma funcionalidade.
2. Fazer isso sobre uma aplicação real, ainda que simples: o **SmartDesk**, um sistema de gerenciamento de chamados (help desk).

O SmartDesk em si não é o produto — é o veículo. Cada nova funcionalidade do SmartDesk nasce de uma Issue e serve para exercitar o pipeline de agentes de ponta a ponta.

## Por que este formato

Times reais frequentemente dividem o trabalho de desenvolvimento em papéis: alguém entende o pedido, alguém levanta o contexto, alguém planeja a solução técnica, alguém implementa, alguém valida. Este projeto reproduz essa divisão usando agentes do Claude Code, cada um com uma responsabilidade única e um conjunto restrito de skills, para tornar o processo:

- **Rastreável** — cada etapa produz um artefato (análise, plano, implementação, validação).
- **Previsível** — o mesmo fluxo se repete a cada Issue, independentemente do tamanho da mudança.
- **Fácil de demonstrar** — dá para acompanhar visualmente a Issue avançando pelo pipeline até "Done".

## O sistema SmartDesk

Aplicação simples de gerenciamento de chamados. Funcionalidades iniciais previstas:

- Criar chamado
- Listar chamados
- Visualizar detalhes de um chamado
- Alterar status de um chamado

Nenhuma dessas funcionalidades está implementada ainda — este repositório, no momento, contém apenas a estrutura de agentes, skills e documentação. O código da aplicação será adicionado incrementalmente, uma Issue por vez.

## O que este projeto **não** é

- Não é um sistema de help desk pronto para produção.
- Não tem (por ora) requisitos de autenticação, permissões, multi-tenant, notificações, ou integrações externas.
- Não deve crescer em complexidade além do necessário para demonstrar o fluxo — se uma funcionalidade exigir complexidade desproporcional ao valor de demonstração, isso deve ser questionado antes de implementada.

## Próximos passos

Ver [development-workflow.md](development-workflow.md) para como uma Issue se transforma em código, e [architecture.md](architecture.md) para a estrutura técnica proposta.
