# Documentação Técnica - Horse Hotel AMS

## Arquitetura Geral

Horse Hotel AMS é uma aplicação React SPA (Single Page Application) construída com TypeScript, Vite e Tailwind CSS. A arquitetura segue padrões modernos de React com contextos para state global, componentes funcionais com hooks e roteamento via React Router.

### Fluxo de Arquitetura

```
Usuário Browser
    ↓
React Router (Roteamento)
    ↓
Pages (Componentes de página)
    ↓
Components (UI + Lógica)
    ↓
Contexts (AuthContext, LangContext)
    ↓
Services (localStorage / Supabase)
    ↓
TypeScript Types (Type-safety)
```

## Estrutura de Roteamento

### React Router Setup (`src/App.tsx`)

```typescript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/horses" element={<HorsesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Proteção de Rotas

```typescript
function ProtectedRoute() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
```

### Verificação de Papéis

```typescript
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
```

## Sistema de Contextos

### AuthContext (`src/contexts/AuthContext.tsx`)

**Estado Gerenciado**:
```typescript
{
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
```

**Funções Disponíveis**:
- `login(email, password)` - Autentica usuário
- `logout()` - Desconecta usuário
- `setUser(user)` - Define usuário manualmente
- `hasPermission(role)` - Verifica permissão
- `isAdmin()`, `isWorker()`, `isClient()` - Atalhos de papel

**Uso**:
```typescript
function MyComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user && <p>Olá, {user.name}</p>}
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### LangContext (`src/contexts/LangContext.tsx`)

**Estado Gerenciado**:
```typescript
{
  language: 'en' | 'nl' | 'pt';
  translations: Translation;
}
```

**Funções Disponíveis**:
- `setLanguage(lang)` - Muda idioma
- `t(key)` - Busca tradução por chave

**Uso**:
```typescript
function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('pages.horses')}</h1>
      <button onClick={() => setLanguage('nl')}>
        Nederlands
      </button>
    </div>
  );
}
```

### Combinar Contextos

```typescript
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* ... */}
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
```

## Hierarquia de Componentes

### Layout Hierárquico

```
AppLayout (layout principal)
├── Header
│   └── LangSwitcher
│       └── Language selector (en/nl/pt)
├── Sidebar
│   ├── Nav items (links)
│   └── User profile
└── Main Content Area
    └── <Outlet /> (página atual)
```

### Componentes de Página

Cada página (`/pages/*/Page.tsx`) contém:
1. Fetch de dados (useEffect)
2. State de tabela/lista
3. Modais para criar/editar
4. Paginação e filtros

### Componentes UI Reutilizáveis

Localização: `src/components/ui/`

#### Button.tsx
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  const classes = `btn btn-${variant}`;
  return <button className={classes} {...props} />;
}
```

#### Modal.tsx
```typescript
export function Modal({ 
  open, 
  onClose, 
  title, 
  children 
}: ModalProps) {
  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
```

#### Card.tsx
```typescript
export function Card({ children, onClick }: CardProps) {
  return (
    <div className="card bg-base-100 shadow-xl cursor-pointer" onClick={onClick}>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
```

#### Badge.tsx
```typescript
export function Badge({ 
  variant = 'default', 
  children 
}: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
```

## Camada de Dados (Data Layer)

### Serviço de Dados (`src/services/data.ts`)

**Padrão Atual** (localStorage):
```typescript
// Seed data
export const horses: Horse[] = [
  {
    id: '1',
    name: 'Thunder',
    passportId: 'NLD123456',
    // ... more fields
  },
];

// Funções de manipulação
export function addHorse(horse: Horse) {
  const updated = [...horses, horse];
  localStorage.setItem('horses', JSON.stringify(updated));
  return updated;
}

export function updateHorse(id: string, updates: Partial<Horse>) {
  const index = horses.findIndex(h => h.id === id);
  if (index > -1) {
    horses[index] = { ...horses[index], ...updates };
    localStorage.setItem('horses', JSON.stringify(horses));
  }
  return horses[index];
}

export function deleteHorse(id: string) {
  const filtered = horses.filter(h => h.id !== id);
  localStorage.setItem('horses', JSON.stringify(filtered));
}
```

### Migração para Supabase

**Padrão com Supabase**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export async function getHorses() {
  const { data, error } = await supabase
    .from('horse_hotel_horses')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function addHorse(horse: Horse) {
  const { data, error } = await supabase
    .from('horse_hotel_horses')
    .insert([horse]);
  
  if (error) throw error;
  return data[0];
}
```

### Padrão de Uso em Componentes

```typescript
function HorsesPage() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados
    async function loadHorses() {
      try {
        const data = await getHorses(); // localStorage ou Supabase
        setHorses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHorses();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {horses.map(horse => (
        <HorseCard key={horse.id} horse={horse} />
      ))}
    </div>
  );
}
```

## Sistema de Tipos TypeScript

### Localização: `src/types/index.ts`

Arquivo centralizado com todas as interfaces:

#### User & Auth
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

#### Horse Management
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
  checkIn: string;  // ISO date
  checkOut: string; // ISO date
  stableType: StableType;
  stableLocation: StableLocation;
  walkerSchedule: boolean;  // Walker agendado?
  paddockSchedule: boolean; // Paddock agendado?
  quarantine: boolean;
  quarantineStart?: string;
  quarantineEnd?: string;
  transportDestination?: string;
  notes?: string;
  imageUrl?: string;
  status: 'upcoming' | 'checked-in' | 'checked-out';
}
```

#### Tasks
```typescript
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string;
  horseId?: string;
  horseName?: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string; // ISO date
  completed: boolean;
  priority: TaskPriority;
  createdAt: string;
  createdBy: string;
}
```

#### Outros Tipos
- `ClientRequest` - Solicitações de clientes
- `Announcement` - Anúncios do hotel
- `Transport` - Transportes de cavalos
- `Notification` - Sistema de notificações
- `Booking` - Reservas de cocheiras

## Sistema de Internacionalização (i18n)

### Estrutura de Tradução

Cada arquivo de idioma (`i18n/en.ts`, `i18n/nl.ts`, `i18n/pt.ts`) segue:

```typescript
export const EN = {
  common: {
    welcome: 'Welcome',
    logout: 'Logout',
    loading: 'Loading...',
    error: 'An error occurred',
  },
  pages: {
    dashboard: 'Dashboard',
    horses: 'Horses',
    tasks: 'Tasks',
    bookings: 'Bookings',
    transport: 'Transport',
    announcements: 'Announcements',
    users: 'Users',
  },
  roles: {
    admin: 'Administrator',
    worker: 'Worker',
    client: 'Client',
  },
  horses: {
    name: 'Name',
    passportId: 'Passport ID',
    motherName: 'Mother Name',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    stableType: 'Stable Type',
    stableLocation: 'Stable Location',
    quarantine: 'Quarantine',
  },
  // ... mais chaves
};
```

### Uso de Tradução

```typescript
import { useLanguage } from '../contexts/LangContext';

function HorseForm() {
  const { t } = useLanguage();

  return (
    <form>
      <label>{t('horses.name')}</label>
      <input placeholder={t('horses.name')} />
      
      <label>{t('horses.passportId')}</label>
      <input />
    </form>
  );
}
```

### Adicionar Novo Idioma

1. Criar arquivo `i18n/xx.ts` (xx = código idioma)
2. Copiar estrutura de `en.ts`
3. Traduzir todas as chaves
4. Importar em `LangContext`
5. Adicionar ao seletor em `LangSwitcher`

## Controle de Acesso Baseado em Papéis (RBAC)

### Estratégia de RBAC

```typescript
// Funções auxiliares
function hasRole(user: User, requiredRole: Role): boolean {
  return user.role === requiredRole;
}

function hasAnyRole(user: User, roles: Role[]): boolean {
  return roles.includes(user.role);
}

function canEdit(user: User, resource: any): boolean {
  // Admin pode editar tudo
  if (user.role === 'admin') return true;
  
  // Worker pode editar seus dados
  if (user.role === 'worker') return user.id === resource.createdBy;
  
  // Client não pode editar
  return false;
}
```

### Proteção em Componentes

```typescript
function AdminPanel() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Unauthorized />;
  }

  return (
    <div>
      {/* Painel admin */}
    </div>
  );
}
```

### Proteção em Tabelas

```typescript
function HorsesTable({ horses }: { horses: Horse[] }) {
  const { user } = useAuth();

  return (
    <table>
      <tbody>
        {horses.map(horse => (
          <tr key={horse.id}>
            <td>{horse.name}</td>
            {user?.role === 'admin' && (
              <td>
                <Button>Editar</Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Responsividade e Mobile

### Tailwind CSS Breakpoints

```css
/* Padrão mobile-first */
.container { /* Mobile */ }
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### Componentes Responsivos

**Sidebar Collapsible**:
```typescript
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      
      <aside className={`
        fixed md:relative inset-0 md:block
        ${isOpen ? 'block' : 'hidden'}
        w-64 bg-base-200
      `}>
        {/* Nav items */}
      </aside>
    </>
  );
}
```

**Grid Responsivo**:
```typescript
function HorsesGrid({ horses }: { horses: Horse[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {horses.map(horse => (
        <HorseCard key={horse.id} horse={horse} />
      ))}
    </div>
  );
}
```

## Utilitários

### date-fns para Datas

```typescript
import { format, isAfter, isBefore, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatar data
const formatted = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });

// Comparar datas
const isExpired = isAfter(new Date(), horse.quarantineEnd);

// Calcular diferença
const daysLeft = differenceInDays(horse.checkOut, new Date());
```

### UUID para IDs

```typescript
import { v4 as uuidv4 } from 'uuid';

function addHorse(horseData: Omit<Horse, 'id' | 'createdAt'>) {
  const horse: Horse = {
    ...horseData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  return addHorse(horse);
}
```

## Padrões de Desenvolvimento

### Formato de Componente

```typescript
import { FC, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LangContext';
import { Button } from '../components/ui/Button';

interface MyComponentProps {
  title: string;
  onSave?: (data: any) => void;
}

export const MyComponent: FC<MyComponentProps> = ({ 
  title, 
  onSave 
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [state, setState] = useState('');

  const handleSave = () => {
    onSave?.(state);
  };

  return (
    <div>
      <h1>{title}</h1>
      <input 
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <Button onClick={handleSave}>
        {t('common.save')}
      </Button>
    </div>
  );
};
```

### Hook Customizado

```typescript
function useHorses() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getHorses();
      setHorses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { horses, loading, error, refetch: load };
}
```

## Troubleshooting

### TypeScript

**Erro: "Cannot find name 'XX'"**
- Verificar importação do tipo em `src/types/index.ts`
- Fazer build do TypeScript: `npm run build`

**Erro: "Property 'XX' is missing"**
- Adicionar propriedade na interface
- Usar `Partial<T>` se opcional

### Estado Global

**Contexto não atualiza**
- Verificar se componente está envolvido por Provider
- Usar `useCallback` para funções em contextos
- Evitar criar novos objetos em cada render

### Roteamento

**Página em branco após navegação**
- Verificar rota em `App.tsx`
- Verificar `<Outlet />` em layout
- Verificar proteção de rota

### Responsividade

**Layout quebrado em mobile**
- Verificar classes Tailwind (ex: `md:block`)
- Testar com DevTools mobile mode
- Usar `container` classe para max-width

## Performance

### Otimizações

```typescript
// Lazy loading de página
const HorsesPage = lazy(() => import('./pages/horses/HorsesPage'));

// Memoização
const HorseCard = memo(function HorseCard({ horse }: Props) {
  return <Card>{horse.name}</Card>;
});

// useCallback para deps de effect
const handleSave = useCallback((data: Horse) => {
  updateHorse(data);
}, []);
```

## Deployment

Vercel configuration no `vite.config.ts`:
```typescript
export default {
  build: {
    outDir: 'dist',
    sourcemap: false, // Desabilitar em produção
  },
};
```

## Referências

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [date-fns](https://date-fns.org)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
