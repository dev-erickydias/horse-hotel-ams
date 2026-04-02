# 📄 Documentacao Tecnica — Horse Hotel AMS

> **Horse Hotel AMS** — Sistema de Gerenciamento para Hotel de Cavalos em Amsterdam

---

## 📋 Sumario

- [Descricao do Projeto](#-descricao-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Explicacao Detalhada dos Arquivos](#-explicacao-detalhada-dos-arquivos)
  - [Raiz do Projeto](#raiz-do-projeto)
  - [Source Principal (src/)](#source-principal-src)
  - [Componentes (src/components/)](#componentes-srccomponents)
  - [Paginas (src/pages/)](#paginas-srcpages)
  - [Servicos (src/services/)](#servicos-srcservices)
  - [Contextos (src/contexts/)](#contextos-srccontexts)
  - [Hooks (src/hooks/)](#hooks-srchooks)
  - [Utilitarios (src/utils/)](#utilitarios-srcutils)
  - [Internacionalizacao (src/i18n/)](#internacionalizacao-srci18n)
  - [Tipos (src/types/)](#tipos-srctypes)
  - [Configuracao (src/config/)](#configuracao-srcconfig)
  - [Banco de Dados (supabase/)](#banco-de-dados-supabase)
- [Instalacao de Dependencias](#-instalacao-de-dependencias)
- [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
- [Como Clonar o Repositorio](#-como-clonar-o-repositorio)

---

## 🐴 Descricao do Projeto

O **Horse Hotel AMS** e um sistema completo de gerenciamento para um hotel de cavalos localizado em Amsterdam, Holanda. O sistema permite a administracao de:

- **Cavalos**: check-in, check-out, quarentena, cuidados especiais, alimentacao
- **Tarefas**: atribuicao de tarefas aos funcionarios com prioridades
- **Reservas**: clientes solicitam uso de instalacoes (arena, paddock, etc.)
- **Transportes**: logistica de transporte internacional de cavalos
- **Anuncios**: comunicacao entre staff e clientes
- **Usuarios**: gerenciamento de admins, funcionarios e clientes com sistema de convites
- **Agenda**: visualizacao semanal/diaria de todos os eventos
- **Notificacoes**: sistema reativo de notificacoes em tempo real

O sistema possui **tres niveis de acesso**: Admin, Worker (funcionario) e Client (cliente). Cada nivel tem permissoes e telas especificas.

Suporte completo a **tres idiomas**: Ingles (EN), Portugues (PT-BR) e Holandes (NL).

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Versao | Finalidade |
|---|---|---|
| **React** | ^18.3.1 | Biblioteca principal de UI |
| **TypeScript** | ^5.5.3 | Tipagem estatica |
| **Vite** | ^5.4.2 | Build tool e dev server |
| **Tailwind CSS** | ^3.4.1 | Framework CSS utilitario |
| **React Router DOM** | ^6.30.3 | Roteamento SPA |
| **Supabase** | ^2.99.2 | Backend-as-a-Service (banco de dados PostgreSQL + Realtime) |
| **bcryptjs** | ^3.0.3 | Hashing de senhas (bcrypt no browser) |
| **date-fns** | ^4.1.0 | Manipulacao de datas |
| **lucide-react** | ^0.344.0 | Icones SVG |
| **uuid** | ^13.0.0 | Geracao de UUIDs |
| **ESLint** | ^9.9.1 | Linting de codigo |
| **PostCSS** | ^8.4.35 | Processamento CSS |
| **Autoprefixer** | ^10.4.18 | Prefixos CSS automaticos |

**Deploy**: Vercel (configurado via `vercel.json`)

---

## 📁 Estrutura do Projeto

```
horse-hotel-ams/
├── .env.example                 # Exemplo de variaveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── index.html                   # HTML principal (entry point)
├── package.json                 # Dependencias e scripts NPM
├── package-lock.json            # Lock de dependencias
├── vite.config.ts               # Configuracao do Vite
├── tailwind.config.js           # Configuracao do Tailwind CSS (cores customizadas)
├── postcss.config.js            # Configuracao do PostCSS
├── tsconfig.json                # Configuracao base TypeScript
├── tsconfig.app.json            # Configuracao TS para a aplicacao
├── tsconfig.node.json           # Configuracao TS para Node
├── eslint.config.js             # Configuracao do ESLint
├── vercel.json                  # Configuracao de deploy Vercel (SPA rewrites)
├── supabase/
│   └── migration.sql            # Schema SQL completo do banco de dados
├── docs/                        # Documentacoes em 3 idiomas
│   ├── documentation-en.md
│   ├── documentation-nl.md
│   └── documentation-pt.md
├── src/
│   ├── main.tsx                 # Entry point React
│   ├── App.tsx                  # Componente raiz com rotas
│   ├── index.css                # Estilos globais + animacoes
│   ├── vite-env.d.ts            # Tipos do Vite
│   ├── config/
│   │   └── constants.ts         # Constantes (email master admin)
│   ├── types/
│   │   └── index.ts             # Todas as interfaces/tipos TypeScript
│   ├── i18n/
│   │   ├── index.ts             # Registry de idiomas
│   │   ├── en.ts                # Traducoes em ingles
│   │   ├── pt.ts                # Traducoes em portugues
│   │   └── nl.ts                # Traducoes em holandes
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Contexto de autenticacao
│   │   └── LangContext.tsx       # Contexto de idioma
│   ├── hooks/
│   │   └── useData.ts           # Hook reativo para mudancas de dados
│   ├── services/
│   │   ├── supabase.ts          # Cliente Supabase
│   │   ├── data.ts              # API de dados (CRUD + cache + Realtime)
│   │   ├── seed.ts              # Dados de demonstracao
│   │   └── resetTokenStore.ts   # Gerenciamento de tokens de reset de senha
│   ├── utils/
│   │   ├── password.ts          # Hashing bcrypt de senhas
│   │   └── sanitize.ts          # Sanitizacao de input (anti-XSS)
│   ├── components/
│   │   ├── DataProvider.tsx      # Provider de inicializacao de dados
│   │   ├── ErrorBoundary.tsx     # Captura de erros React
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx     # Layout principal (sidebar + outlet)
│   │   │   ├── Header.tsx        # Cabecalho com notificacoes
│   │   │   └── Sidebar.tsx       # Barra lateral de navegacao
│   │   └── ui/
│   │       ├── Badge.tsx         # Componente de badge/tag
│   │       ├── Button.tsx        # Componente de botao
│   │       ├── Card.tsx          # Componente de card
│   │       ├── EmptyState.tsx    # Estado vazio
│   │       ├── Input.tsx         # Input, Textarea, Select, Toggle
│   │       ├── LangSwitcher.tsx  # Seletor de idioma
│   │       └── Modal.tsx         # Componente de modal
│   └── pages/
│       ├── landing/
│       │   └── LandingPage.tsx   # Pagina publica do site
│       ├── auth/
│       │   ├── LoginPage.tsx     # Pagina de login
│       │   ├── SignupPage.tsx    # Pagina de registro
│       │   ├── SetPasswordPage.tsx        # Definir senha (via convite)
│       │   ├── ForgotPasswordPage.tsx     # Esqueci minha senha
│       │   └── ResetPasswordPage.tsx      # Redefinir senha
│       ├── dashboard/
│       │   └── DashboardPage.tsx # Painel principal
│       ├── horses/
│       │   └── HorsesPage.tsx    # Gerenciamento de cavalos
│       ├── tasks/
│       │   └── TasksPage.tsx     # Gerenciamento de tarefas
│       ├── bookings/
│       │   └── BookingsPage.tsx  # Gerenciamento de reservas
│       ├── transport/
│       │   └── TransportPage.tsx # Gerenciamento de transportes
│       ├── announcements/
│       │   └── AnnouncementsPage.tsx  # Anuncios
│       ├── users/
│       │   └── UsersPage.tsx     # Gerenciamento de usuarios
│       ├── profile/
│       │   └── ProfilePage.tsx   # Perfil do usuario
│       └── schedule/
│           └── SchedulePage.tsx  # Agenda/calendario
```

---

## 🔍 Explicacao Detalhada dos Arquivos

### Raiz do Projeto

#### `index.html`
Arquivo HTML principal que serve como entry point da aplicacao SPA. Configura:
- Favicon em SVG com emoji de cavalo (🐴)
- Fontes Google: **Playfair Display** (titulos) e **DM Sans** (corpo)
- Carrega o `src/main.tsx` como modulo

#### `package.json`
Define o projeto como `vite-react-typescript-starter` com 4 scripts:
- `dev` — Inicia o servidor de desenvolvimento Vite
- `build` — Gera o build de producao
- `lint` — Executa o ESLint
- `preview` — Pre-visualiza o build de producao

#### `vite.config.ts`
Configuracao minima do Vite com o plugin React. Exclui `lucide-react` da otimizacao de dependencias para evitar problemas de bundling.

#### `tailwind.config.js`
Configuracao do Tailwind CSS com **paleta de cores customizada**:
- **cream** (creme) — Tons de fundo quentes (#fefdfb a #c4b49c)
- **forest** (floresta) — Tons verdes escuros (#f0f5f1 a #091a0d)
- **gold** (dourado) — Tons dourados/ambar (#fdf9f0 a #654025)

Fontes customizadas:
- `font-display` — Playfair Display (serifada, para titulos)
- `font-body` — DM Sans (sans-serif, para corpo)

#### `vercel.json`
Configuracao de deploy no Vercel com rewrite universal para `index.html`, garantindo que o roteamento SPA funcione corretamente.

#### `.env.example`
Template com as variaveis de ambiente necessarias:
- `VITE_SUPABASE_URL` — URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` — Chave anonima do Supabase

#### `eslint.config.js`
Configuracao flat do ESLint v9 com TypeScript, React Hooks e React Refresh.

#### `postcss.config.js`
Configuracao do PostCSS com plugins Tailwind CSS e Autoprefixer.

---

### Source Principal (src/)

#### `src/main.tsx`
Entry point da aplicacao React. Renderiza o componente `<App />` dentro de `<StrictMode>` no elemento `#root`.

#### `src/App.tsx`
Componente raiz que define toda a **arquitetura de roteamento** da aplicacao:

**Providers (de fora para dentro):**
1. `ErrorBoundary` — Captura erros de renderizacao
2. `BrowserRouter` — Roteamento SPA
3. `DataProvider` — Inicializa dados do Supabase/seed
4. `LangProvider` — Contexto de idioma
5. `AuthProvider` — Contexto de autenticacao

**Rotas publicas:**
- `/` — Landing page
- `/login` — Login
- `/signup` — Registro
- `/set-password/:token` — Definir senha (convite)
- `/forgot-password` — Esqueci senha
- `/reset-password` — Redefinir senha

**Rotas protegidas (`/app/*`):**
- `/app/dashboard` — Painel principal
- `/app/horses` — Cavalos
- `/app/tasks` — Tarefas (somente staff)
- `/app/bookings` — Reservas
- `/app/transport` — Transportes (somente staff)
- `/app/announcements` — Anuncios
- `/app/users` — Usuarios (somente staff)
- `/app/profile` — Perfil
- `/app/schedule` — Agenda

O componente `ProtectedRoute` valida autenticacao e, opcionalmente, permissao de staff.

#### `src/index.css`
Estilos globais com:
- **Base**: fundo cream, texto stone, fontes, selecao dourada, scrollbar customizada
- **Animacoes**: fade-in, slide-up, scale-in, slide-in-right, float, sway, horse-walk
- **Efeitos decorativos**: grain overlay (textura de ruido), campo de grama animado (SVG), silhueta de cavalo caminhando, padrao de ferraduras, cerca decorativa
- **Utilitarios**: line-clamp-2, text-balance, font-display, font-body

---

### Componentes (src/components/)

#### `DataProvider.tsx`
Componente wrapper que chama `initializeData()` ao montar. Exibe uma tela de loading com o logo "AH" enquanto os dados carregam. Se o Supabase falhar, a app continua funcionando com dados de demonstracao (seed).

#### `ErrorBoundary.tsx`
Class component React que captura erros de renderizacao em qualquer componente filho. Exibe uma UI de erro com botao de reload.

#### `layout/AppLayout.tsx`
Layout principal da area autenticada. Estrutura flexbox com:
- `Sidebar` (navegacao lateral)
- `<Outlet />` (conteudo da rota atual)

#### `layout/Header.tsx`
Cabecalho sticky com:
- Titulo da pagina
- Seletor de idioma (`LangSwitcher`)
- **Sistema de notificacoes**: dropdown com ate 15 notificacoes, badge de contagem de nao lidas, botao "marcar todas como lidas", acoes rapidas de aprovar/rejeitar solicitacoes diretamente da notificacao

#### `layout/Sidebar.tsx`
Barra lateral de navegacao com:
- Logo "AH" e nome da app
- Links de navegacao (diferentes para staff e clientes)
- Avatar e nome do usuario logado
- Botao de logout
- Responsivo: colapsavel em desktop, menu hamburguer em mobile

#### `ui/Badge.tsx`
Componente de badge com 6 variantes: default, success, warning, danger, info, purple.

#### `ui/Button.tsx`
Componente de botao com 5 variantes (primary, secondary, ghost, danger, success) e 3 tamanhos (sm, md, lg). Suporta icone.

#### `ui/Card.tsx`
Componente de card com borda arredondada. Exporta tambem `CardHeader` e `CardBody`. Opcao `hover` para efeito de elevacao.

#### `ui/EmptyState.tsx`
Componente para exibir estado vazio com icone, titulo, descricao e acao opcional.

#### `ui/Input.tsx`
Exporta 4 componentes de formulario:
- `Input` — Campo de texto com label e validacao
- `Textarea` — Area de texto
- `Select` — Select dropdown
- `Toggle` — Interruptor on/off

Todos com `maxLength` padrao para seguranca (500 para input, 2000 para textarea).

#### `ui/LangSwitcher.tsx`
Seletor de idioma com dropdown que mostra bandeiras (🇬🇧 🇧🇷 🇳🇱). Suporta modo claro e escuro. Salva a preferencia no perfil do usuario.

#### `ui/Modal.tsx`
Componente de modal com overlay, backdrop blur, animacao de entrada, botao de fechar. 3 tamanhos: sm, md, lg. Bloqueia scroll do body quando aberto.

---

### Paginas (src/pages/)

#### `landing/LandingPage.tsx`
Pagina publica do site com secoes:
- **Hero**: titulo, subtitulo, CTAs (contato e portal do cliente)
- **About**: descricao do hotel
- **Services**: 4 servicos (hotel, transporte, quarentena, pensao)
- **Facilities**: 6 instalacoes (arena, paddock, walker, wash, guest house, tack room)
- **Transport**: detalhes do servico de transporte com 6 features
- **Team**: informacoes sobre a equipe profissional
- **Contact**: endereco, telefone, email, horarios
- **Footer**: direitos autorais

Design sofisticado com animacoes, efeito de grama, silhueta de cavalo caminhando e padroes decorativos.

#### `auth/LoginPage.tsx`
Formulario de login com email e senha. Inclui rate limiting (5 tentativas = bloqueio de 15 min). Links para registro e "esqueci minha senha".

#### `auth/SignupPage.tsx`
Formulario de registro com nome, email, telefone, senha e confirmacao. Apos registro, o usuario fica com status `pending` ate aprovacao do admin.

#### `auth/SetPasswordPage.tsx`
Pagina para definir senha via link de convite (token na URL).

#### `auth/ForgotPasswordPage.tsx`
Formulario de "esqueci minha senha". Gera um token de reset armazenado em `localStorage`. Rate limiting de 3 solicitacoes por email a cada 5 minutos.

#### `auth/ResetPasswordPage.tsx`
Pagina para redefinir a senha usando o token de reset. Valida o token, permite definir nova senha.

#### `dashboard/DashboardPage.tsx`
Painel principal com visao diferente para staff e clientes:
- **Staff**: cavalos no hotel, tarefas pendentes, solicitacoes pendentes, transportes agendados, chegadas/partidas do dia, cavalos em quarentena, tarefas urgentes
- **Cliente**: meus cavalos, minhas solicitacoes

Cards clicaveis que navegam para as paginas respectivas.

#### `horses/HorsesPage.tsx`
Gerenciamento completo de cavalos com:
- Listagem com busca e filtro por status
- Modal de criacao/edicao com todos os campos (nome, passaporte, dono, datas, tipo de estabulo, localizacao, quarentena, cuidados especiais, alimentacao)
- Detalhes expandidos ao clicar em um cavalo
- Acoes de editar e excluir (somente staff)
- Clientes veem apenas seus proprios cavalos

#### `tasks/TasksPage.tsx`
Gerenciamento de tarefas (somente staff):
- Abas: tarefas de hoje, todas ativas, futuras, concluidas
- Criacao com titulo, descricao, atribuicao a funcionario, cavalo relacionado, data, prioridade
- Marcar como concluida
- Prioridades: low, medium, high, urgent

#### `bookings/BookingsPage.tsx`
Gerenciamento de reservas de instalacoes:
- **Staff**: ve todas as solicitacoes, pode aprovar/rejeitar com notas
- **Cliente**: ve suas solicitacoes, pode criar novas (titulo, descricao, instalacao, data, horario)
- Instalacoes disponiveis: Arena, Paddock, Round Pen, Wash Bay, Guest House, Other

#### `transport/TransportPage.tsx`
Gerenciamento de transportes (somente staff):
- Listagem com status (scheduled, in-transit, completed)
- Agendar novo transporte (cavalo, data, hora, origem, destino, motorista, notas)
- Acoes: iniciar transporte, marcar como completo

#### `announcements/AnnouncementsPage.tsx`
Sistema de anuncios:
- **Staff**: criar, editar, fixar, arquivar, restaurar, excluir anuncios
- **Cliente**: visualizar anuncios direcionados a eles
- Categorias: general, maintenance, transport, important
- Audiencia: todos, somente staff, somente clientes
- Anuncios arquivados sao excluidos automaticamente apos 10 dias

#### `users/UsersPage.tsx`
Gerenciamento de usuarios (somente staff):
- Listagem com busca por nome, email, nome de cavalo ou passaporte
- Criar usuario com senha temporaria
- Aprovacao de registros pendentes
- Alteracao de role (admin/worker/client)
- Excluir usuario
- Sistema de convites com link
- O master admin (`deverickydias@gmail.com`) e invisivel e nao pode ser editado/excluido

#### `profile/ProfilePage.tsx`
Perfil do usuario (disponivel para todos):
- Editar nome, email, telefone
- Alterar senha (senha atual + nova senha + confirmacao)
- Clientes: ver e registrar seus cavalos

#### `schedule/SchedulePage.tsx`
Agenda/calendario com:
- Visao semanal e diaria
- Navegacao entre semanas/dias
- Botao "hoje"
- Eventos codificados por cor: booking (azul), transport (roxo), arrival (verde), departure (dourado)
- Eventos computados automaticamente a partir de reservas aprovadas, transportes, chegadas e partidas de cavalos
- Admins podem editar horarios de eventos de booking

---

### Servicos (src/services/)

#### `supabase.ts`
Inicializacao do cliente Supabase. Se as variaveis de ambiente nao estiverem configuradas, cria um cliente placeholder e ativa o "modo offline" com dados de demonstracao.

#### `data.ts`
**Camada central de dados da aplicacao.** Implementa:

1. **Cache em memoria** (`state`): todos os dados ficam em memoria para acesso sincrono rapido
2. **Write-through**: operacoes CRUD atualizam o cache local E disparam escrita assincrona no Supabase
3. **Conversao snake_case ↔ camelCase**: entre Supabase (snake) e TypeScript (camel)
4. **Sistema de eventos reativo**: `onDataChange(event, listener)` permite que componentes se re-renderizem quando dados mudam
5. **Supabase Realtime**: subscricoes em todas as tabelas para receber INSERT/UPDATE/DELETE em tempo real
6. **API publica** (`api`): metodos para todas as operacoes CRUD de todas as entidades
7. **Schedule Events**: eventos computados a partir de reservas aprovadas, transportes e cavalos (chegadas/partidas)
8. **Auto-seed**: se nao houver dados no Supabase, insere dados de demonstracao automaticamente
9. **Reset de dados**: funcao protegida que so pode ser executada pelo master admin

Tabelas Supabase:
| Tabela | Entidade |
|---|---|
| `horse_hotel_users` | Usuarios |
| `horse_hotel_horses` | Cavalos |
| `horse_hotel_tasks` | Tarefas |
| `horse_hotel_requests` | Solicitacoes de reserva |
| `horse_hotel_announcements` | Anuncios |
| `horse_hotel_transports` | Transportes |
| `horse_hotel_notifications` | Notificacoes |

#### `seed.ts`
Dados de demonstracao (seed data) com:
- **6 usuarios**: 1 admin, 2 workers, 3 clientes (1 pendente)
- **4 cavalos**: Eclipse, Thunderbolt, Bella Rosa, Nordic King — com diferentes status, tipos de estabulo, cuidados especiais
- **4 tarefas**: com diferentes prioridades e atribuicoes
- **4 solicitacoes**: arena, wash bay, paddock, guest house — com diferentes status
- **4 anuncios**: manutencao, quarentena, transporte, boas-vindas
- **4 transportes**: Amsterdam→Stockholm, Paris→Amsterdam, Amsterdam→Dubai, Amsterdam→Lyon
- **8 notificacoes**: chegadas, solicitacoes, partidas, aprovacoes, registros

Todas as datas sao relativas a data atual (hoje + N dias).

#### `resetTokenStore.ts`
Gerenciamento de tokens de redefinicao de senha usando `localStorage`:
- Tokens de 256 bits criptograficos (`crypto.getRandomValues`)
- Expiracao em 1 hora
- Uso unico (invalidado apos reset bem-sucedido)
- Limpeza automatica de tokens expirados
- Rate limiting: maximo 3 solicitacoes por email a cada 5 minutos
- Apenas 1 token ativo por usuario

---

### Contextos (src/contexts/)

#### `AuthContext.tsx`
Contexto de autenticacao com:
- **Sessao via cookie** (`hh_session`): token de sessao de 256 bits, cookies Secure + SameSite=Strict
- **Rate limiting de login**: 5 tentativas = bloqueio de 15 minutos
- **Verificacao de senha**: bcrypt hash comparison
- **Migracao automatica**: senhas plaintext sao migradas para bcrypt no login
- **Prevencao de enumeracao**: tempo de resposta consistente para usuarios existentes e nao-existentes

Metodos expostos: `login()`, `logout()`, `isRole()`, `isStaff`

#### `LangContext.tsx`
Contexto de idioma com:
- Deteccao automatica do idioma do navegador
- Persistencia da preferencia no perfil do usuario (Supabase)
- Restauracao da preferencia ao restaurar sessao

Metodos expostos: `lang`, `setLang()`, `t` (objeto de traducoes)

---

### Hooks (src/hooks/)

#### `useData.ts`
Hook personalizado que se inscreve em eventos de mudanca de dados. Retorna um numero de `revision` que incrementa a cada mudanca, permitindo re-renderizacao reativa via `useMemo`.

Uso: `const rev = useData('horses', 'tasks');`

---

### Utilitarios (src/utils/)

#### `password.ts`
Utilitario de hashing de senhas usando `bcryptjs` com 12 rounds:
- `hashPassword(password)` — Gera hash bcrypt
- `verifyPassword(password, hash)` — Verifica senha contra hash
- `isPlaintextPassword(stored)` — Detecta senhas legacy nao-hashadas

#### `sanitize.ts`
Utilitario de sanitizacao de input para prevencao de XSS:
- `sanitizeString(value)` — Remove tags HTML, scripts, event handlers, javascript:, data:, vbscript:, eval(), document.cookie, window.location
- `sanitizeObject(obj)` — Sanitiza recursivamente todos os campos string de um objeto
- `isValidEmail(email)` — Validacao de formato de email
- `enforceMaxLength(value, max)` — Limita tamanho de string
- `sanitizePhone(value)` — Permite apenas digitos, espacos, +, -, parenteses

Aplicado na camada de dados (`create`/`update`) como barreira de seguranca.

---

### Internacionalizacao (src/i18n/)

#### `index.ts`
Registry central de idiomas. Define os 3 idiomas com labels e bandeiras. Exporta `getTranslations(lang)`.

#### `en.ts`
Traducoes completas em **ingles** (~450 chaves). Define o tipo `Translations` que e usado como contrato para os demais idiomas.

Secoes: common, landing, auth, nav, dashboard, horses, tasks, bookings, transport, announcements, users, profile, setPassword, notifications, schedule.

#### `pt.ts`
Traducoes completas em **portugues brasileiro**. Mesma estrutura do `en.ts`.

#### `nl.ts`
Traducoes completas em **holandes**. Mesma estrutura do `en.ts`.

---

### Tipos (src/types/)

#### `index.ts`
Todas as interfaces e tipos TypeScript da aplicacao:

- **User**: id, email, name, role, status, avatar, phone, password, inviteToken, sessionToken, lang
- **Horse**: 25+ campos incluindo dados do cavalo, estabulo, quarentena, alimentacao, cuidados especiais
- **Task**: titulo, descricao, cavalo, atribuicao, prioridade, data de vencimento
- **ClientRequest**: solicitacao de reserva de instalacao com datas e status
- **Announcement**: anuncio com categoria, audiencia, fixacao e arquivamento
- **Transport**: transporte com origem, destino, motorista, status
- **Notification**: notificacao com tipo, audiencia e destino
- **ScheduleEvent**: evento de agenda computado a partir de outras entidades

Tipos enum: Role, UserStatus, Lang, StableType, StableLocation, FoodType, FeedType, TaskPriority, RequestStatus, AnnouncementAudience, TransportStatus, NotificationType, ScheduleEventType

---

### Configuracao (src/config/)

#### `constants.ts`
Define o email do **master admin** (`deverickydias@gmail.com`). Este usuario e invisivel na pagina de usuarios e nao pode ser editado ou excluido por outros admins.

---

### Banco de Dados (supabase/)

#### `migration.sql`
Schema completo do banco de dados PostgreSQL (Supabase) com:

1. **Drop de tabelas existentes** (para re-execucao segura)
2. **13 tipos enum** customizados
3. **7 tabelas** com chaves primarias UUID, foreign keys, defaults
4. **Row Level Security (RLS)** habilitado em todas as tabelas
5. **Policies permissivas** (para uso com chave anonima — recomendacao de usar Edge Functions em producao)
6. **Seed do master admin**

---

## 📦 Instalacao de Dependencias

```bash
# Certifique-se de ter o Node.js (v18+) e npm instalados

# Instalar dependencias
npm install
```

### Configuracao do Supabase (Opcional)

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL de `supabase/migration.sql` no SQL Editor do Supabase
3. Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

> **Nota**: O sistema funciona sem Supabase! Sem as variaveis de ambiente, a aplicacao roda em **modo offline** com dados de demonstracao pre-carregados.

---

## 🚀 Como Rodar o Projeto Localmente

```bash
# 1. Clonar o repositorio
git clone https://github.com/dev-erickydias/horse-hotel-ams.git

# 2. Entrar na pasta do projeto
cd horse-hotel-ams

# 3. Instalar dependencias
npm install

# 4. (Opcional) Configurar variaveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

O projeto estara disponivel em `http://localhost:5173`

### Outros Comandos

```bash
# Build de producao
npm run build

# Visualizar build de producao
npm run preview

# Executar linting
npm run lint
```

### Credenciais de Demonstracao (Modo Offline)

| Email | Senha | Role |
|---|---|---|
| `admin@horsehotel.nl` | `admin123` | Admin |
| `anna@horsehotel.nl` | `admin123` | Worker |
| `sophie@example.com` | (hash de demo) | Client |
| `marcus@example.com` | (hash de demo) | Client |

---

## 📥 Como Clonar o Repositorio

```bash
git clone https://github.com/dev-erickydias/horse-hotel-ams.git
```

---

> 📝 **Documentacao gerada em:** Abril 2026
> 👨‍💻 **Autor:** Ericky Dias — [github.com/dev-erickydias](https://github.com/dev-erickydias)
