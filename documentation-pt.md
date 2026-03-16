# Horse Hotel AMS — Documentação

## Visão Geral

Horse Hotel AMS é um sistema completo de gestão para hotéis de cavalos, projetado para gerenciar registros de cavalos hospedados, tarefas da equipe, reservas de clientes, logística de transporte, avisos e agendamento — tudo com controle de acesso baseado em funções e suporte multilíngue (Inglês, Português, Holandês).

## Stack Tecnológico

- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **Estilização:** Tailwind CSS 3.4
- **Roteamento:** React Router 6
- **Ícones:** Lucide React
- **Datas:** date-fns
- **Persistência:** localStorage (chave: `horse_hotel_data_v4`)
- **Autenticação:** Baseada em Context com gerenciamento de funções

## Funções & Permissões

| Funcionalidade | Admin | Trabalhador | Cliente |
|---|---|---|---|
| Painel | Estatísticas completas | Estatísticas completas | Meus cavalos e pedidos |
| Cavalos | Ver/Adicionar/Editar/Excluir todos | Ver/Adicionar/Editar todos | Ver apenas seus cavalos |
| Tarefas | Criar/Atribuir/Concluir | Ver/Concluir atribuídas | — |
| Reservas | Revisar/Aprovar/Rejeitar | Revisar/Aprovar/Rejeitar | Criar pedidos |
| Transporte | Criar/Gerenciar | Criar/Gerenciar | — |
| Avisos | Criar para todos, Arquivar, Excluir permanentemente | Criar para todos/equipe, Arquivar, Restaurar | Apenas visualizar |
| Usuários | Adicionar/Alterar função/Excluir | — | — |
| Agenda | Ver/Editar todos os eventos | Ver/Editar todos os eventos | Ver próprios + eventos públicos |
| Perfil | Ver | Editar nome/telefone, Alterar senha | Editar nome/telefone, Alterar senha, Registrar cavalos |

## Páginas & Funcionalidades

### 1. Página Inicial (`/`)
Página pública com informações do hotel, serviços, instalações, detalhes de transporte e formulário de contato. Totalmente responsiva.

### 2. Autenticação (`/login`, `/signup`)
- Login com email/senha
- Auto-cadastro (status: pendente → aprovação do admin necessária)
- Definir senha via token de convite (`/set-password/:token`)

### 3. Painel (`/app/dashboard`)
- **Visão da equipe:** Contagem de cavalos, tarefas pendentes, pedidos pendentes, transportes agendados. Cards rápidos para chegando/saindo hoje, alertas de quarentena, tarefas urgentes.
- **Visão do cliente:** Contagem de meus cavalos, contagem de meus pedidos.

### 4. Gestão de Cavalos (`/app/horses`)
- Busca por nome do cavalo, nome do proprietário ou ID do passaporte
- Filtro por status: todos, esperado, hospedado, saiu
- Perfil completo do cavalo: nome, ID do passaporte, mãe, proprietário, datas e horários de entrada/saída, tipo de baia (maravalha/palha), localização (Estábulo A-D, Pensão esquerda/meio/direita), agenda de caminhador/paddock, quarentena com datas, destino de transporte
- Seção de cuidados especiais: tipo de alimentação (feno/capim/ambos), tipo de ração (padrão/preparada pelo cliente/outro), notas de cuidados
- Formatação segura de datas — sem crashes em datas vazias/inválidas

### 5. Gestão de Tarefas (`/app/tasks`) — Apenas equipe
- Criar tarefas com título, descrição, trabalhador atribuído, cavalo relacionado, data limite, prioridade (baixa/média/alta/urgente)
- Seções: Tarefas de hoje, Todas ativas, Próximas, Concluídas
- Marcar tarefas como concluídas

### 6. Reservas (`/app/bookings`)
- **Clientes:** Enviar pedidos de instalação (arena, paddock, redondel, outro) com data e horários (início/fim)
- **Equipe:** Revisar pedidos com notas do admin, aprovar ou rejeitar
- **Notificações:** Equipe recebe notificação de novo pedido (com sourceId para ações rápidas). Cliente recebe notificação sobre aprovação/rejeição.
- **Ações rápidas nas notificações:** Admin pode aprovar/rejeitar diretamente do painel de notificações sem sair da página.

### 7. Transporte (`/app/transport`) — Apenas equipe
- Agendar transporte: selecionar cavalo, data, hora, origem, destino, motorista (com autocomplete de usuários)
- Rastrear status: agendado → em trânsito → concluído
- Campo de motorista usa componente de autocomplete que busca usuários por nome

### 8. Avisos (`/app/announcements`)
- **Público-alvo:** todos, apenas equipe, apenas clientes. Trabalhadores podem postar para todos ou equipe. Admin pode postar para qualquer público.
- **Fixar:** Fixar avisos importantes no topo
- **Categorias:** Geral, Manutenção, Transporte, Importante (badges coloridos)
- **Sistema de arquivo:** Equipe pode arquivar avisos. Itens arquivados vão para seção colapsável "Arquivados". Cada item mostra dias restantes antes da exclusão automática. Avisos são excluídos permanentemente após 10 dias. Equipe pode restaurar itens. Admin pode excluir permanentemente a qualquer momento.

### 9. Gestão de Usuários (`/app/users`) — Apenas equipe
- Buscar usuários por nome, email, telefone, nome do cavalo ou ID do passaporte
- Ver cavalos vinculados por usuário (com badges de nome e passaporte)
- Seção de aprovações pendentes: aprovar com atribuição de função ou rejeitar
- **Alteração de função pelo admin:** Admin pode alterar a função de qualquer usuário (cliente ↔ trabalhador ↔ admin) diretamente no card do usuário
- Criar novos usuários com senha temporária
- Excluir usuários (apenas admin, não pode excluir a si mesmo)

### 10. Agenda (`/app/schedule`)
- **Visão semanal:** Grade de 7 dias com cards compactos, clique no dia para detalhes
- **Visão diária:** Lista completa de eventos do dia selecionado
- **Tipos de evento:** Reserva (azul), Transporte (roxo), Chegada (verde), Saída (âmbar)
- Navegação: semana/dia anterior/próximo, botão "Hoje"
- **Visão do cliente:** Suas reservas + todas chegadas/saídas/transportes
- **Editar:** Admin pode editar horário de qualquer reserva, clientes apenas as suas

### 11. Perfil (`/app/profile`)
- Ver/editar nome, email (somente leitura), telefone
- Alterar senha (atual → nova → confirmar)
- **Seção Meus Cavalos:** Registrar cavalos com informações básicas + detalhes de cuidados/alimentação. Editar cavalos existentes.

## Sistema de Notificações

- Filtragem por função: notificações filtradas por público (todos/equipe/clientes) e targetUserId
- Tipos: chegada, saída, pedido, tarefa, transporte, aviso, registro
- Ícone de sino no cabeçalho com contagem de não lidas (pulso animado)
- Clique na notificação → navega para página vinculada
- Notificações de pedidos para equipe incluem botões "Aprovar" e "Rejeitar" para ações rápidas inline
- Marcar todas como lidas

## Internacionalização (i18n)

Três idiomas totalmente suportados: Inglês (`en`), Português (`pt`), Holandês (`nl`). Seletor de idioma no cabeçalho. Todos os rótulos, botões, mensagens e placeholders são traduzidos.

## Arquitetura de Dados

Todos os dados são armazenados no localStorage sob a chave `horse_hotel_data_v4`. O serviço de dados (`src/services/data.ts`) fornece uma API CRUD completa. Dados iniciais incluem um usuário admin (`admin@admin.com` / `admin`) e três cavalos de exemplo.

## Estrutura de Arquivos

```
src/
├── App.tsx                          # Rotas e rotas protegidas
├── contexts/
│   ├── AuthContext.tsx               # Estado de autenticação e verificação de funções
│   └── LangContext.tsx               # Estado de idioma e seletor
├── i18n/
│   ├── en.ts, pt.ts, nl.ts          # Arquivos de tradução
│   └── index.ts                     # Exportações i18n
├── services/
│   └── data.ts                      # Camada de dados (CRUD localStorage)
├── types/
│   └── index.ts                     # Interfaces TypeScript
├── components/
│   ├── layout/                      # AppLayout, Header, Sidebar
│   └── ui/                          # Badge, Button, Card, EmptyState, Input, Modal
└── pages/                           # Todas as páginas da aplicação
```

## Executando o Projeto

```bash
npm install
npm run dev          # Servidor de desenvolvimento (http://localhost:5173)
npm run build        # Build de produção
npm run preview      # Visualizar build de produção
```

## Login Padrão

- **Admin:** admin@admin.com / admin
