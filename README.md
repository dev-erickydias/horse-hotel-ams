# Horse Hotel AMS - Sistema de Gerenciamento de Hotel de Cavalos

Sistema completo de gerenciamento de hotel de cavalos em Amsterdam, desenvolvido com React 18, TypeScript e Vite. Aplicação web robusta com suporte multilíngue (Inglês, Holandês e Português), controle de acesso baseado em papéis (RBAC) e gerenciamento avançado de hospedagens, tarefas e transporte de cavalos.

## Características Principais

- **Gerenciamento Multilíngue**: Suporte para Inglês, Holandês e Português (BR)
- **Controle de Acesso Baseado em Papéis (RBAC)**: Admin, Worker e Client
- **Gerenciamento de Cavalos**: Registro completo com check-in/out, quarentena e agendamento
- **Sistema de Tarefas**: Atribuição de tarefas com prioridades e prazos
- **Reservas e Bookings**: Gerenciamento de hospedagens com datas e tipos de cocheira
- **Transporte Coordenado**: Rastreamento de transportes de cavalos
- **Notificações em Tempo Real**: Sistema de notificações para eventos importantes
- **Sistema de Anúncios**: Comunicações centralizadas com categorização
- **Gerenciamento de Usuários**: Controle de equipe e clientes
- **Design Responsivo**: Interface otimizada para desktop, tablet e mobile
- **Interface Intuitiva**: Componentes UI reutilizáveis com Tailwind CSS

## Stack Tecnológico

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Bundler**: Vite
- **Roteamento**: React Router v6
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL) - em migração
- **Data Local**: localStorage com seed data
- **Utilitários**: date-fns (datas), uuid (identificadores)
- **Ícones**: Lucide React
- **Internacionalização**: Sistema i18n customizado

## Dependências Principais

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.3",
  "typescript": "^5.5.3",
  "tailwindcss": "^3.4.1",
  "date-fns": "^4.1.0",
  "uuid": "^13.0.0",
  "lucide-react": "^0.344.0"
}
```

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd horse-hotel-ams
```

2. Instale as dependências:
```bash
npm install
```

3. Variáveis de Ambiente (se usar Supabase):
```bash
cp .env.example .env.local
```

Configure em `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts Disponíveis

- **`npm run dev`** - Inicia o servidor de desenvolvimento (localhost:5173)
- **`npm run build`** - Compila para produção
- **`npm run preview`** - Preview da build de produção local
- **`npm run lint`** - Executa ESLint

## Estrutura do Projeto

```
horse-hotel-ams/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Layout principal da aplicação
│   │   │   ├── Header.tsx         # Cabeçalho com navegação
│   │   │   └── Sidebar.tsx        # Menu lateral responsivo
│   │   └── ui/
│   │       ├── Badge.tsx          # Componente de badge
│   │       ├── Button.tsx         # Componente de botão
│   │       ├── Card.tsx           # Componente de card
│   │       ├── EmptyState.tsx     # Estado vazio
│   │       ├── Input.tsx          # Componente de input
│   │       ├── LangSwitcher.tsx   # Seletor de idioma
│   │       └── Modal.tsx          # Modal reutilizável
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Contexto de autenticação e usuário
│   │   └── LangContext.tsx        # Contexto de idioma
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx      # Página de login
│   │   │   └── SetPasswordPage.tsx # Configurar senha inicial
│   │   ├── landing/
│   │   │   └── LandingPage.tsx    # Página inicial pública
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx  # Dashboard principal
│   │   ├── horses/
│   │   │   └── HorsesPage.tsx     # Gerenciamento de cavalos
│   │   ├── tasks/
│   │   │   └── TasksPage.tsx      # Gerenciamento de tarefas
│   │   ├── bookings/
│   │   │   └── BookingsPage.tsx   # Gerenciamento de reservas
│   │   ├── transport/
│   │   │   └── TransportPage.tsx  # Coordenação de transportes
│   │   ├── announcements/
│   │   │   └── AnnouncementsPage.tsx # Anúncios e comunicações
│   │   └── users/
│   │       └── UsersPage.tsx      # Gerenciamento de usuários
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Autenticação e usuário atual
│   │   └── LangContext.tsx        # Idioma selecionado
│   ├── i18n/
│   │   ├── en.ts                  # Tradução inglês
│   │   ├── nl.ts                  # Tradução holandês
│   │   ├── pt.ts                  # Tradução português (BR)
│   │   └── index.ts               # Função utilitária de tradução
│   ├── services/
│   │   └── data.ts                # Serviço de dados (localStorage/Supabase)
│   ├── types/
│   │   └── index.ts               # Todas as interfaces TypeScript
│   ├── App.tsx                    # Configuração de rotas
│   ├── main.tsx                   # Ponto de entrada
│   └── index.css                  # Estilos globais + Tailwind
├── public/
│   └── assets/                    # Imagens e assets estáticos
├── index.html                     # Arquivo HTML principal
├── vite.config.ts                 # Configuração Vite
├── tailwind.config.js             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
└── package.json
```

## Tipos TypeScript (src/types/index.ts)

### User & Auth
```typescript
type Role = 'admin' | 'worker' | 'client';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  password?: string;
  inviteToken?: string;
  createdAt: string;
}
```

### Horse Management
```typescript
type StableType = 'shavings' | 'straw';
type StableLocation = 'stable-a' | 'stable-b' | 'stable-c' | 'stable-d' | 'pension-left' | 'pension-middle' | 'pension-right';

interface Horse {
  id: string;
  name: string;
  passportId: string;
  motherName: string;
  ownerId: string;
  ownerName: string;
  checkIn: string;
  checkOut: string;
  stableType: StableType;
  stableLocation: StableLocation;
  walkerSchedule: boolean;
  paddockSchedule: boolean;
  quarantine: boolean;
  quarantineStart?: string;
  quarantineEnd?: string;
  transportDestination?: string;
  notes?: string;
  imageUrl?: string;
  status: 'upcoming' | 'checked-in' | 'checked-out';
}
```

### Tasks, Bookings, Transport, etc.
Todos definidos em `src/types/index.ts` com interfaces completas.

## Modelos Supabase (Migração)

### Tabelas Planeadas

- `horse_hotel_users` - Usuários e autenticação
- `horse_hotel_horses` - Cavalos e hospedagens
- `horse_hotel_tasks` - Tarefas e atribuições
- `horse_hotel_requests` - Solicitações de clientes
- `horse_hotel_announcements` - Anúncios
- `horse_hotel_transports` - Transportes
- `horse_hotel_notifications` - Notificações

*Nota: Atualmente usando localStorage com seed data. Migração para Supabase em progresso.*

## Sistema de Autenticação

### AuthContext (`src/contexts/AuthContext.tsx`)

Gerencia:
- Usuário autenticado
- Token de sessão
- Papéis e permissões
- Login/logout

### Fluxo de Autenticação

1. Login → `LoginPage`
2. Validação de credenciais
3. Set `AuthContext`
4. Redirect para Dashboard
5. Proteger rotas com role check

### Papéis e Permissões

| Papel | Descrição | Acesso |
|-------|-----------|--------|
| Admin | Gerenciador do hotel | Todos os recursos |
| Worker | Funcionário do hotel | Tarefas, cavalos, transporte |
| Client | Proprietário de cavalo | Visualização e solicitações |

## Sistema de Internacionalização (i18n)

### Estrutura

```typescript
// src/i18n/en.ts
export const EN = {
  common: {
    welcome: 'Welcome',
    logout: 'Logout',
  },
  pages: {
    horses: 'Horses',
    tasks: 'Tasks',
  },
};
```

### Uso

```typescript
import { useLanguage } from './contexts/LangContext';

export function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('pages.horses')}</h1>;
}
```

### Idiomas Suportados

- **Inglês** (en.ts)
- **Holandês** (nl.ts)
- **Português (BR)** (pt.ts)

## Páginas Principais

| Página | Rota | Papéis Acesso | Descrição |
|--------|------|---------------|-----------|
| Landing | `/` | Público | Apresentação do serviço |
| Login | `/login` | Público | Autenticação de usuário |
| Dashboard | `/dashboard` | Admin, Worker, Client | Visão geral de dados |
| Cavalos | `/horses` | Admin, Worker, Client | CRUD de cavalos, quarentena |
| Tarefas | `/tasks` | Admin, Worker | Gerenciamento de tarefas |
| Reservas | `/bookings` | Admin, Worker | Agendamento de cocheiras |
| Transporte | `/transport` | Admin, Worker | Coordenação de transportes |
| Anúncios | `/announcements` | All | Comunicações centralizadas |
| Usuários | `/users` | Admin | Gerenciamento de equipe |

## Serviço de Dados (localStorage → Supabase)

### Atualmente: localStorage

```typescript
// src/services/data.ts
export const horses = [
  {
    id: '1',
    name: 'Thunder',
    passportId: 'NLD123456',
    // ...
  },
];
```

### Padrão de Uso

```typescript
import { horses, tasks, users } from './services/data';

// Ler
const myHorses = horses.filter(h => h.ownerId === userId);

// Manipular (em-memória, persistência com localStorage)
const updated = [...horses, newHorse];
localStorage.setItem('horses', JSON.stringify(updated));
```

### Migração para Supabase

Quando integrar Supabase:

1. Substituir localStorage por queries Supabase
2. Usar react-query ou SWR para cache
3. Implementar real-time listeners
4. Adicionar retry logic

## Design Responsivo

### Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Componentes Responsivos

- **Sidebar**: Collapsible em mobile
- **Grid/List**: Muda layout em tablet
- **Modal**: Full-screen em mobile
- **Header**: Menu hambúrguer em mobile

## Deployment

O projeto está deployado em: **https://horse-hotel-ams.vercel.app**

### Deploy Local

```bash
npm run build
npm run preview
```

### Deploy em Produção (Vercel)

```bash
git push origin main
# Deploy automático via Vercel
```

## Desenvolvimento

### Workflow

1. Criar branch: `git checkout -b feature/nova-feature`
2. Develop e test
3. Commit: `git commit -m 'feat: Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. PR e code review
6. Merge

### Convenções de Código

- **TypeScript**: Type-safe sempre
- **Componentes**: PascalCase, uma por arquivo
- **Funções**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Props**: Interfaces específicas por componente

## Troubleshooting

### Problemas Comuns

**"Not found" ao recarregar página**
- Vercel precisa redirecionar SPA para index.html
- Configurar `vercel.json` com rewrites

**Estado perdido ao recarregar**
- Usar localStorage para persistência
- Implementar useEffect para load

**Tradução não atualiza**
- Recarregar página
- Verificar chaves de tradução

## Próximos Passos

- [ ] Completar migração para Supabase
- [ ] Implementar real-time com Supabase subscriptions
- [ ] Adicionar notificações push
- [ ] Implementar reports/analytics
- [ ] Adicionar integração com Google Calendar
- [ ] Sistema de pagamentos

## Licença

Este projeto é proprietário. Todos os direitos reservados.

## Suporte

Para suporte ou dúvidas, abra uma issue no repositório.
