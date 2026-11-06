# 💰 Finannce - Gerenciador de Finanças Pessoais

Uma aplicação web moderna para gerenciar contas, categorias e transações financeiras com interface intuitiva e design elegante.

## 🎯 Características

- ✅ **Autenticação com Laravel Sanctum** - Login e registro seguro
- 📊 **Dashboard interativa** - Visão geral de saldos, receitas e despesas
- 💳 **Gerenciamento de Contas** - Criar, editar e deletar contas
- 🏷️ **Categorias de Transações** - Organizar transações por categoria
- 📝 **Histórico de Transações** - Registrar receitas, despesas e transferências
- 🎨 **Design System** - Interface consistente e responsiva
- 🌓 **Tema Claro/Escuro** - Suporte a temas light e dark
- 📱 **Responsivo** - Funciona perfeitamente em desktop e mobile

## 🚀 Stack Tecnológico

- **Frontend**: [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Autenticação**: [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **Backend**: [Laravel](https://laravel.com/) (em localhost:8000)

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Laravel backend rodando em `http://localhost:8000`
- Sanctum configurado no backend

## ⚙️ Instalação e Setup

### 1. Clonar e instalar dependências

```bash
git clone <https://github.com/renancaldasdev/finnance_api_front>
cd finnace_api_front
npm install
```

### 2. Configurar variáveis de ambiente

Criar arquivo `.env` na raiz do projeto:

```env
NUXT_PUBLIC_API_BASE=http://localhost
```

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
app/
├── components/          # Componentes Vue reutilizáveis
│   ├── AppShell.vue          # Layout wrapper com sidebar
│   ├── AppSidebar.vue        # Barra lateral de navegação
│   ├── NavItem.vue           # Item de navegação
│   └── TransactionFormModal.vue
├── composables/         # Vue Composables (lógica reutilizável)
│   ├── useAuth.ts            # Autenticação e gerenciamento de usuário
│   ├── useApi.ts             # Cliente HTTP com token
│   ├── useTransactions.ts    # CRUD de transações
│   ├── useAccounts.ts        # CRUD de contas
│   └── useCategories.ts      # CRUD de categorias
├── middleware/          # Middleware Nuxt
│   └── auth.ts               # Proteção de rotas
├── pages/              # Páginas da aplicação (file-based routing)
│   ├── index.vue             # Home (login/register)
│   ├── dashboard.vue         # Dashboard autenticada
│   ├── transactions.vue      # Lista de transações
│   ├── accounts.vue          # Gerenciamento de contas
│   └── categories.vue        # Gerenciamento de categorias
├── server/             # Backend (Nitro)
│   └── api/                  # Endpoints de API (se necessário)
├── app.vue             # Root component
├── app.css             # Estilos globais + design tokens + Tailwind
└── nuxt.config.ts      # Configuração Nuxt

public/                # Assets estáticos
docs/                  # Documentação e design system
└── finnance_design/
    ├── design-system/
    │   └── tokens.css       # Variáveis CSS do design system
    └── screens/
        ├── html/            # Referências HTML
        └── png/             # Mockups visuais

tailwind.config.js     # Configuração Tailwind CSS
tsconfig.json          # Configuração TypeScript
```

## 🔐 Autenticação

### Login

```typescript
const { login } = useAuth();
await login(email, password);
// Redireciona para /dashboard após sucesso
```

### Register

```typescript
const { register } = useAuth();
await register(name, email, password, passwordConfirmation);
// Redireciona para /dashboard após sucesso
```

### Logout

```typescript
const { logout } = useAuth();
await logout();
// Redireciona para /
```

## 🛣️ Rotas Principais

| Rota            | Descrição                   | Autenticação  |
| --------------- | --------------------------- | ------------- |
| `/`             | Home (Login/Register)       | Não           |
| `/dashboard`    | Dashboard principal         | ✅ Necessária |
| `/transactions` | Lista de transações         | ✅ Necessária |
| `/accounts`     | Gerenciamento de contas     | ✅ Necessária |
| `/categories`   | Gerenciamento de categorias | ✅ Necessária |

**Comportamento de redirecionamento:**

- Usuário não autenticado tenta acessar rota protegida → redireciona para `/`
- Usuário autenticado acessa `/` → redireciona para `/dashboard`

## 🎨 Design System

A aplicação utiliza um design system completo com:

- **Paleta de Cores**: Definida em `docs/finnance_design/design-system/tokens.css`
- **Tipografia**: Manrope (Google Fonts)
- **Spacing**: Sistema de espaçamento padronizado (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px)
- **Radius**: Border radius consistente (8px, 10px, 16px, 20px, 999px)
- **Temas**: Light (padrão) e Dark

### Cores Principais

```css
--sidebar: #0f1a17 /* Sidebar escura */ --brand: #0b7a5c /* Cor primária (verde teal) */ --income: #0b7a5c
  /* Receitas */ --expense: #b4470f /* Despesas */ --danger: #9a3b0c /* Ações destrutivas */ --warning: #8a4e00
  /* Avisos */;
```

## 📦 Composables API

### useAuth()

```typescript
const {
  user, // Ref<User | null>
  token, // Ref<string | null>
  isAuthenticated, // ComputedRef<boolean>
  login, // (email, password) => Promise
  register, // (name, email, password, passwordConfirmation) => Promise
  logout, // () => Promise
  initToken, // () => void
  getMe, // () => Promise
} = useAuth();
```

### useApi()

```typescript
const {
  token, // Ref<string | null>
  get, // (url) => Promise
  post, // (url, data) => Promise
  put, // (url, data) => Promise
  del, // (url) => Promise
} = useApi();
```

### useTransactions()

```typescript
const {
  transactions, // Ref<Transaction[]>
  fetchTransactions, // () => Promise
  createTransaction, // (data) => Promise
  updateTransaction, // (id, data) => Promise
  deleteTransaction, // (id) => Promise
} = useTransactions();
```

## 🔄 Fluxo de Autenticação

1. Usuário acessa `/` (home)
2. Escolhe entre "Entrar" ou "Criar conta"
3. **Login**:
   - Envia credenciais para `POST /login`
   - Recebe `{ token, user }`
   - Token é salvo em localStorage
   - Usuário é redirecionado para `/dashboard`
4. **Logout**:
   - Token e dados do usuário são removidos
   - Redireciona para `/`

## 📝 Variáveis de Ambiente

| Variável               | Descrição          | Padrão                  |
| ---------------------- | ------------------ | ----------------------- |
| `NUXT_PUBLIC_API_BASE` | URL da API backend | `http://localhost:8000` |

## 🏗️ Build para Produção

```bash
# Build
npm run build

# Preview da build
npm run preview

# Gerar site estático (SSG)
npm run generate
```

## 🧪 Desenvolvendo

### Hot Module Replacement (HMR)

Mudanças em arquivos são refletidas instantaneamente no navegador durante `npm run dev`

### Tipos TypeScript

Os tipos são auto-gerados em `.nuxt/` após `npm install`. Se os tipos não atualizar:

```bash
npm install
```

### Componentes e Composables Auto-Importados

- Componentes em `app/components/` são auto-importados
- Composables em `app/composables/` são auto-importados como `use*`
- Utilities em `app/utils/` são auto-importados

## 🐛 Troubleshooting

### "Module not found" error

```bash
npm install
# e reinicie npm run dev
```

### Tipos TypeScript não aparecem

```bash
npm install
# Regenera tipos em .nuxt/
```

### CSS não está sendo aplicado

- Verifique se as classes Tailwind existem em seus templates
- Confirme que `app.css` está sendo importado em `nuxt.config.ts`
- Reinicie o servidor dev

### Autenticação retorna 401

- Confirme que o backend Laravel está rodando em `http://localhost:8000`
- Verifique que Sanctum está configurado no backend
- Limpe localStorage e tente novamente

## 📚 Recursos

- [Documentação Nuxt 4](https://nuxt.com/)
- [Documentação Vue 3](https://vuejs.org/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)
- [Documentação Laravel Sanctum](https://laravel.com/docs/sanctum)

## 👨‍💻 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade privada.

## 📧 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Nuxt 4 + Vue 3 + Tailwind CSS**
