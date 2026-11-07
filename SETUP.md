# Finnance Frontend - Setup Completo

## Pré-requisitos

- Node.js 20+ (ou 22+, mas use versão estável)
- npm 10+
- Laravel Backend em http://localhost (porta 80) com Sanctum configurado

## 1. Setup do Projeto Nuxt

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000` (ou a porta indicada)

## 2. Setup da API Laravel (Sanctum)

Se ainda não tem o backend, crie um:

```bash
# Criar novo projeto Laravel
composer create-project laravel/laravel finnance_api
cd finnance_api

# Instalar Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Configurar CORS e Sanctum
php artisan migrate

# Adicionar traits e configs necessárias
```

### Endpoints Esperados (Laravel Routes)

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    // Transactions CRUD
    Route::apiResource('transactions', TransactionController::class);

    // Logout
    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    });
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
```

### Estrutura do Model Transaction (Laravel)

```php
// app/Models/Transaction.php
class Transaction extends Model {
    protected $fillable = ['user_id', 'description', 'amount', 'type', 'created_at'];

    protected $casts = [
        'amount' => 'decimal:2',
        'type' => 'string', // 'income' ou 'expense'
    ];
}

// Migrations
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('description');
    $table->decimal('amount', 10, 2);
    $table->enum('type', ['income', 'expense']);
    $table->timestamps();
});
```

## 3. Variáveis de Ambiente

**Frontend (.env):**

```
NUXT_PUBLIC_API_BASE=http://localhost
```

**Backend (.env - Laravel):**

```
APP_URL=http://localhost
FRONTEND_URL=http://localhost:3000

# Sanctum - Domains & Paths
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 4. CORS no Laravel

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3001'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization'],
'max_age' => 0,
'supports_credentials' => true,
```

## 5. Iniciar Ambos os Servidores

**Terminal 1 - Frontend:**

```bash
cd ~/dev/finnace_api_front
npm run dev
```

**Terminal 2 - Backend:**

```bash
cd ~/dev/finnace_api
php artisan serve  # Roda em http://localhost (porta 80)
```

## 6. Testar Fluxo Completo

1. Acesse `http://localhost:3000`
2. Você é redirecionado para `/login`
3. Clique em "Registre-se"
4. Preencha nome, email, senha
5. Após registrar, você está logado
6. Dashboard mostra transações (vazio inicialmente)
7. Adicione uma transação
8. Veja o saldo atualizar em tempo real

## 7. Estrutura de Pastas Criada

```
app/
├── composables/
│   ├── useApi.ts          # Client HTTP com token Sanctum
│   ├── useAuth.ts         # Login/logout com token storage
│   └── useTransactions.ts # CRUD de transações (padrão para outras entidades)
├── middleware/
│   └── auth.ts            # Proteção de rotas autenticadas
└── pages/
    ├── login.vue          # Página de login
    ├── register.vue       # Página de registro
    └── index.vue          # Dashboard com transações
```

## 8. Adicionar Mais Entidades

Siga o padrão de `useTransactions.ts`:

```typescript
// app/composables/useAccounts.ts
export const useAccounts = () => {
  const { get, post, put, del } = useApi();

  const accounts = ref([]);

  const fetchAccounts = async () => {
    const data = await get('/accounts');
    accounts.value = data.data || data;
  };

  // ... mais CRUD operations

  return { accounts, fetchAccounts /* ... */ };
};
```

Depois use em qualquer página:

```typescript
const { accounts } = useAccounts();
onMounted(() => accounts.fetch());
```

## Troubleshooting

**"Cannot GET /login"** → Middleware auth não está funcionando. Verifique se `definePageMeta({ middleware: 'auth' })` está em index.vue

**API retorna 401** → Token expirou ou é inválido. Verifique localStorage tem `auth_token` e está válido

**CORS error** → Configure CORS no Laravel backend (veja seção 4)

**"Port 3000 in use"** → Nuxt usa 3001 automaticamente. Normal. Ou mate a porta: `lsof -i :3000 | grep -v PID | awk '{print $2}' | xargs kill -9`
