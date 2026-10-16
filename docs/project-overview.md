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

Aplicação de gerenciamento de chamados. Funcionalidades já implementadas (cada uma nasceu de uma GitHub Issue e passou pelo pipeline de agentes):

- **Chamados:** criar (título, descrição, prioridade e equipe obrigatórias; responsável opcional), visualizar detalhes e alterar status, prioridade, equipe e responsável.
- **Central de atendimento:** tela principal orientada à ação — indicadores clicáveis, seção "Precisa da sua atenção", cards com ações rápidas, busca por texto/linguagem natural e filtros combináveis, com estados de carregamento, vazio e erro.
- **Dashboard:** indicadores, distribuição por status e prioridade, chamados recentes, busca e filtros.
- **Kanban:** chamados agrupados em colunas por status.
- **Assistente de criação:** sugere título e prioridade a partir da descrição (heurística local, sem IA externa).
- **Notificações:** sino com contagem de não lidas e painel de eventos dos chamados.
- **Equipes e responsáveis:** 4 equipes, cada uma com seus membros; combinações inválidas são impedidas.

A aplicação roda inteiramente no navegador (React + TypeScript + Vite), com os dados em memória e espelhados no `localStorage`. Ver [architecture.md](architecture.md) para a stack e o modelo de dados. Novas funcionalidades continuam sendo adicionadas incrementalmente, uma Issue por vez.

## O que este projeto **não** é

- Não é um sistema de help desk pronto para produção.
- Não tem (por ora) requisitos de autenticação, permissões, multi-tenant, ou integrações externas — nem backend: os dados ficam no `localStorage`.
- Não deve crescer em complexidade além do necessário para demonstrar o fluxo — se uma funcionalidade exigir complexidade desproporcional ao valor de demonstração, isso deve ser questionado antes de implementada.

## Próximos passos

Ver [development-workflow.md](development-workflow.md) para como uma Issue se transforma em código, e [architecture.md](architecture.md) para a estrutura técnica proposta.
