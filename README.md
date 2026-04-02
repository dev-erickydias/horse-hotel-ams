<p align="center">
  <img src="https://img.shields.io/badge/🐴_Horse_Hotel_AMS-Sistema_de_Gerenciamento-1f4d29?style=for-the-badge&labelColor=0f2914" alt="Horse Hotel AMS" />
</p>

<h1 align="center">🐴 Horse Hotel AMS</h1>

<p align="center">
  <strong>Sistema completo de gerenciamento para hotel de cavalos em Amsterdam</strong><br/>
  <em>Hospedagem premium, transporte internacional e cuidados profissionais para equinos</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🇬🇧_English-Supported-1f4d29?style=flat-square" alt="English" />
  <img src="https://img.shields.io/badge/🇧🇷_Português-Suportado-1f4d29?style=flat-square" alt="Português" />
  <img src="https://img.shields.io/badge/🇳🇱_Nederlands-Ondersteund-1f4d29?style=flat-square" alt="Nederlands" />
</p>

---

## 📸 Screenshots

> 🖼️ Adicione screenshots da aplicacao aqui para mostrar a interface.
>
> Sugestao de capturas:
> - Landing Page (pagina publica)
> - Dashboard (admin e cliente)
> - Gerenciamento de Cavalos
> - Agenda/Calendario
> - Pagina de Login
> - Versao mobile

---

## 📝 Descricao

O **Horse Hotel AMS** e uma aplicacao web completa para gerenciar um hotel de cavalos em Amsterdam. O sistema foi projetado para atender as necessidades de administradores, funcionarios e clientes proprietarios de cavalos, oferecendo uma experiencia intuitiva e moderna.

O sistema opera em **tempo real** com Supabase Realtime e tambem funciona em **modo offline** com dados de demonstracao, permitindo explorar todas as funcionalidades sem configuracao de backend.

---

## ✨ Funcionalidades

### 🐴 Gerenciamento de Cavalos
- Registro completo com passaporte, mae, proprietario
- Check-in e check-out com datas e horarios
- Tipos de estabulo (serragem ou palha) e 7 localizacoes
- Controle de quarentena com datas de inicio/fim
- Cuidados especiais, tipo de alimentacao e racao
- Agendamento de walker e paddock

### 📋 Sistema de Tarefas
- Criacao e atribuicao de tarefas aos funcionarios
- 4 niveis de prioridade: baixa, media, alta e urgente
- Vinculacao a cavalos especificos
- Visualizacao por abas: hoje, ativas, futuras, concluidas

### 📅 Reservas de Instalacoes
- Clientes solicitam uso de arena, paddock, round pen, wash bay e mais
- Staff aprova ou rejeita solicitacoes com notas
- Aprovacao rapida direto pelo painel de notificacoes

### 🚛 Transporte Internacional
- Agendamento de transportes com origem, destino e motorista
- Status: agendado, em transito, concluido
- Integrado a agenda e notificacoes

### 📢 Sistema de Anuncios
- Categorias: geral, manutencao, transporte, importante
- Audiencia segmentada: todos, somente staff, somente clientes
- Fixacao de anuncios importantes
- Arquivamento com exclusao automatica apos 10 dias

### 📆 Agenda/Calendario
- Visualizacao semanal e diaria
- Eventos automaticos: reservas, transportes, chegadas, partidas
- Codificacao por cores por tipo de evento
- Edicao de horarios de reservas pelo admin

### 🔔 Notificacoes em Tempo Real
- Notificacoes para chegadas, partidas, solicitacoes, tarefas, transportes
- Badge de contagem de nao lidas
- Acoes rapidas (aprovar/rejeitar) direto na notificacao
- Supabase Realtime para atualizacoes instantaneas

### 👥 Gerenciamento de Usuarios
- 3 niveis de acesso: Admin, Worker (funcionario) e Client
- Sistema de registro com aprovacao do admin
- Convites com link
- Perfil com troca de senha

### 🌐 Internacionalizacao Completa
- 3 idiomas: Ingles 🇬🇧, Portugues 🇧🇷 e Holandes 🇳🇱
- Deteccao automatica do idioma do navegador
- Preferencia salva no perfil do usuario

### 🔒 Seguranca
- Hashing bcrypt com 12 rounds
- Tokens de sessao de 256 bits
- Rate limiting de login (5 tentativas = bloqueio de 15 min)
- Sanitizacao completa contra XSS
- Cookies Secure + SameSite=Strict
- Migracao automatica de senhas plaintext para bcrypt

### 📱 Design Responsivo
- Interface otimizada para desktop, tablet e mobile
- Sidebar colapsavel em desktop e menu hamburguer em mobile
- Design sofisticado com paleta de cores cream, forest e gold

---

## 🛠 Tecnologias Utilizadas

<table>
  <tr>
    <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" /><br/><strong>React 18</strong></td>
    <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" /><br/><strong>TypeScript</strong></td>
    <td align="center"><img src="https://vitejs.dev/logo.svg" width="40" /><br/><strong>Vite</strong></td>
    <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="40" /><br/><strong>Tailwind CSS</strong></td>
    <td align="center"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" width="40" /><br/><strong>Supabase</strong></td>
  </tr>
</table>

| Tecnologia | Finalidade |
|---|---|
| **React 18** | Biblioteca de UI com hooks |
| **TypeScript** | Tipagem estatica |
| **Vite** | Build tool ultrarapido |
| **Tailwind CSS** | Estilizacao utilitaria |
| **React Router v6** | Roteamento SPA |
| **Supabase** | Backend (PostgreSQL + Realtime) |
| **bcryptjs** | Hashing de senhas |
| **date-fns** | Manipulacao de datas |
| **Lucide React** | Icones SVG |
| **Vercel** | Deploy e hosting |

---

## 🚀 Como Usar

### Pre-requisitos

- **Node.js** v18 ou superior
- **npm** ou **yarn**
- (Opcional) Conta no [Supabase](https://supabase.com) para persistencia de dados

### 📥 Clonar o Repositorio

```bash
git clone https://github.com/dev-erickydias/horse-hotel-ams.git
```

### 📦 Instalar Dependencias

```bash
cd horse-hotel-ams
npm install
```

### ⚙️ Configurar Variaveis de Ambiente (Opcional)

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

> 💡 **Sem Supabase?** Sem problema! O sistema funciona em **modo offline** com dados de demonstracao completos.

### ▶️ Rodar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:5173**

### 📦 Build de Producao

```bash
npm run build
npm run preview
```

---

## 🔑 Credenciais de Demonstracao

> Disponiveis no modo offline (sem `.env` configurado)

| Email | Senha | Papel |
|---|---|---|
| `admin@horsehotel.nl` | `admin123` | 🔴 Admin |
| `anna@horsehotel.nl` | `admin123` | 🟡 Worker |
| `sophie@example.com` | — | 🟢 Client |
| `marcus@example.com` | — | 🟢 Client |

---

## 📁 Estrutura do Projeto

```
horse-hotel-ams/
├── 📄 index.html              # Entry point HTML
├── 📄 package.json             # Dependencias e scripts
├── ⚙️ vite.config.ts           # Configuracao Vite
├── 🎨 tailwind.config.js       # Cores e fontes customizadas
├── 📄 vercel.json              # Deploy Vercel (SPA rewrites)
├── 🗄️ supabase/
│   └── migration.sql           # Schema completo do banco
├── 📂 src/
│   ├── main.tsx                # Entry point React
│   ├── App.tsx                 # Rotas e providers
│   ├── index.css               # Estilos e animacoes globais
│   ├── 📂 config/              # Constantes da aplicacao
│   ├── 📂 types/               # Interfaces TypeScript
│   ├── 📂 i18n/                # Traducoes (EN, PT, NL)
│   ├── 📂 contexts/            # Auth + Idioma
│   ├── 📂 hooks/               # Hook reativo useData
│   ├── 📂 services/            # Supabase, CRUD, seed, reset tokens
│   ├── 📂 utils/               # Password hashing, sanitizacao XSS
│   ├── 📂 components/
│   │   ├── 📂 layout/          # AppLayout, Header, Sidebar
│   │   └── 📂 ui/              # Badge, Button, Card, Input, Modal...
│   └── 📂 pages/
│       ├── 📂 landing/         # Pagina publica do site
│       ├── 📂 auth/            # Login, Signup, Reset Password
│       ├── 📂 dashboard/       # Painel principal
│       ├── 📂 horses/          # Gerenciamento de cavalos
│       ├── 📂 tasks/           # Tarefas
│       ├── 📂 bookings/        # Reservas de instalacoes
│       ├── 📂 transport/       # Logistica de transporte
│       ├── 📂 announcements/   # Anuncios
│       ├── 📂 users/           # Gerenciamento de usuarios
│       ├── 📂 profile/         # Perfil do usuario
│       └── 📂 schedule/        # Agenda/calendario
```

---

## 🌐 Deploy

O projeto esta deployado na Vercel:

🔗 **https://horse-hotel-ams.vercel.app**

Para deploy automatico, basta fazer push na branch `main`:

```bash
git push origin main
```

---

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/dev-erickydias">
        <img src="https://github.com/dev-erickydias.png" width="100px;" alt="Ericky Dias" style="border-radius: 50%;" /><br />
        <sub><strong>Ericky Dias</strong></sub>
      </a><br />
      <a href="https://github.com/dev-erickydias">🔗 GitHub</a>
    </td>
  </tr>
</table>

---

## 📄 Licenca

Este projeto e proprietario. Todos os direitos reservados.

---

<p align="center">
  Feito com 💚 por <a href="https://github.com/dev-erickydias"><strong>Ericky Dias</strong></a>
</p>
