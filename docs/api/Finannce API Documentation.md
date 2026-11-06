# 🏦 Finannce API

Documentação Completa para Desenvolvimento do Frontend

### 📑 Índice

- [Introdução](#intro)
- [Autenticação](#auth)
- [Contas](#accounts)
- [Categorias](#categories)
- [Transações](#transactions)
- [Modelos de Dados](#data-models)
- [Tratamento de Erros](#errors)

## 🚀 Introdução

**Base URL:** http://localhost/api

**Versão:** 1.0

**Autenticação:** Laravel Sanctum (Token Bearer)

**ℹ️ Health Check**\
Antes de fazer qualquer requisição, você pode verificar se a API está funcionando:\
GET /ping

{"success": true, "message": "pong"}

## 🔐 Autenticação

### Registro (Sign Up)

POST /register

#### Parâmetros

| Campo    | Tipo   | Obrigatório | Descrição                     |
| -------- | ------ | ----------- | ----------------------------- |
| name     | string | Sim         | Nome completo do usuário      |
| email    | string | Sim         | Email válido e único          |
| password | string | Sim         | Senha com mínimo 8 caracteres |

Requisição:

{ "name": "João Silva", "email": "joao@example.com", "password": "senha123" }

Resposta (201 Created):

{ "user": { "id": 1, "name": "João Silva", "email": "joao@example.com" }, "token": "eyJ0eXAiOiJKV1QiLCJhbGc..." }

### Login

POST /login

#### Parâmetros

| Campo    | Tipo   | Obrigatório | Descrição        |
| -------- | ------ | ----------- | ---------------- |
| email    | string | Sim         | Email registrado |
| password | string | Sim         | Senha da conta   |

Requisição:

{ "email": "joao@example.com", "password": "senha123" }

Resposta (200 OK):

{ "user": { "id": 1, "name": "João Silva", "email": "joao@example.com" }, "token": "eyJ0eXAiOiJKV1QiLCJhbGc..." }

### Atualizar Perfil

PUT /update

#### Headers Obrigatórios

Authorization: Bearer {token}

#### Parâmetros

| Campo    | Tipo   | Obrigatório | Descrição                   |
| -------- | ------ | ----------- | --------------------------- |
| name     | string | Opcional    | Novo nome do usuário        |
| email    | string | Opcional    | Novo email (deve ser único) |
| password | string | Opcional    | Nova senha                  |

### Logout

POST /logout

#### Headers Obrigatórios

Authorization: Bearer {token}

Resposta (200 OK):

{ "success": true, "message": "Logout realizado com sucesso" }

**ℹ️ Usando o Token**\
Todos os endpoints que precisam de autenticação requerem o header:\
Authorization: Bearer {token}\
Substitua `{token}` pelo token retornado no login/registro.

## 💰 Contas (Accounts)

### Listar Todas as Contas

GET /accounts

Resposta (200 OK):

\[ { "id": 1, "name": "Conta Corrente", "type": "current_account", "balance": 1500.50, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }, { "id": 2, "name": "Poupança", "type": "savings", "balance": 5000.00, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" } \]

### Visualizar Conta Específica

GET /accounts/{id}

Resposta (200 OK):

{ "id": 1, "name": "Conta Corrente", "type": "current_account", "balance": 1500.50, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }

### Criar Nova Conta

POST /accounts

#### Parâmetros

| Campo   | Tipo   | Obrigatório | Descrição                                                 |
| ------- | ------ | ----------- | --------------------------------------------------------- |
| name    | string | Sim         | Nome da conta                                             |
| type    | enum   | Sim         | `current_account`, `savings`, `credit_card`, `investment` |
| balance | float  | Sim         | Saldo inicial (ex: 1000.50)                               |

Requisição:

{ "name": "Conta Corrente", "type": "current_account", "balance": 1000.00 }

Resposta (201 Created):

{ "id": 1, "name": "Conta Corrente", "type": "current_account", "balance": 1000.00, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }

### Atualizar Conta

PUT /accounts/{id}

#### Parâmetros

| Campo   | Tipo   | Descrição          |
| ------- | ------ | ------------------ |
| name    | string | Novo nome da conta |
| type    | enum   | Novo tipo de conta |
| balance | float  | Novo saldo         |

### Deletar Conta

DELETE /accounts/{id}

**⚠️ Nota:** Usar soft delete. A conta não é imediatamente removida do banco de dados, mas é marcada como deletada.

## 🏷️ Categorias

### Listar Todas as Categorias

GET /categories

Resposta (200 OK):

\[ { "id": 1, "name": "Alimentação", "type": "expense", "description": "Gastos com comida e bebidas", "active": true, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }, { "id": 2, "name": "Salário", "type": "income", "description": "Rendimento mensal", "active": true, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" } \]

### Visualizar Categoria Específica

GET /categories/{id}

### Criar Nova Categoria

POST /categories

#### Parâmetros

| Campo       | Tipo    | Obrigatório | Descrição              |
| ----------- | ------- | ----------- | ---------------------- |
| name        | string  | Sim         | Nome da categoria      |
| type        | enum    | Sim         | `income` ou `expense`  |
| description | string  | Opcional    | Descrição da categoria |
| active      | boolean | Opcional    | Padrão: true           |

Requisição:

{ "name": "Alimentação", "type": "expense", "description": "Gastos com comida e bebidas", "active": true }

Resposta (201 Created):

{ "id": 1, "name": "Alimentação", "type": "expense", "description": "Gastos com comida e bebidas", "active": true, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }

### Atualizar Categoria

PUT /categories/{id}

Aceita os mesmos parâmetros da criação.

### Alternar Status da Categoria

PATCH /categories/{id}/toggle-status

Muda o status de `active` de true para false (ou vice-versa).

### Deletar Categoria

DELETE /categories/{id}

## 📊 Transações

### Listar Todas as Transações

GET /transactions

#### Parâmetros de Query (Opcionais)

| Parâmetro  | Tipo    | Descrição                                   |
| ---------- | ------- | ------------------------------------------- |
| start_date | date    | Filtrar por data inicial (YYYY-MM-DD)       |
| end_date   | date    | Filtrar por data final (YYYY-MM-DD)         |
| per_page   | integer | Registros por página (máx: 100). Padrão: 15 |
| page       | integer | Número da página para paginação             |

Exemplo de requisição:

GET /transactions?start_date=2024-11-01&end_date=2024-11-30&per_page=20&page=1

Resposta (200 OK):

{ "data": \[ { "id": 1, "account_id": 1, "category_id": 1, "amount": 150.50, "type": "expense", "date": "2024-11-05", "description": "Supermercado", "is_paid": true, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" } \], "links": { "first": "http://localhost/api/transactions?page=1", "last": "http://localhost/api/transactions?page=1", "prev": null, "next": null }, "meta": { "current_page": 1, "from": 1, "last_page": 1, "path": "http://localhost/api/transactions", "per_page": 20, "to": 1, "total": 1 } }

### Visualizar Transação Específica

GET /transactions/{id}

### Criar Nova Transação

POST /transactions

#### Parâmetros

| Campo       | Tipo    | Obrigatório | Descrição                       |
| ----------- | ------- | ----------- | ------------------------------- |
| account_id  | integer | Sim         | ID da conta                     |
| category_id | integer | Sim         | ID da categoria                 |
| amount      | float   | Sim         | Valor da transação (ex: 150.50) |
| type        | enum    | Sim         | `income` ou `expense`           |
| date        | date    | Sim         | Data da transação (YYYY-MM-DD)  |
| description | string  | Opcional    | Descrição da transação          |
| is_paid     | boolean | Opcional    | Padrão: false                   |

Requisição:

{ "account_id": 1, "category_id": 1, "amount": 150.50, "type": "expense", "date": "2024-11-05", "description": "Supermercado", "is_paid": true }

Resposta (201 Created):

{ "id": 1, "account_id": 1, "category_id": 1, "amount": 150.50, "type": "expense", "date": "2024-11-05", "description": "Supermercado", "is_paid": true, "created_at": "2024-11-05T10:30:00Z", "updated_at": "2024-11-05T10:30:00Z" }

**ℹ️ Importante:** Quando uma transação é criada com sucesso, o saldo da conta é automaticamente atualizado. Se o tipo for `income`, o saldo aumenta; se for `expense`, o saldo diminui.

### Atualizar Transação

PUT /transactions/{id}

Aceita os mesmos parâmetros da criação. O saldo da conta é recalculado automaticamente.

### Deletar Transação

DELETE /transactions/{id}

**ℹ️ Importante:** Quando uma transação é deletada, o saldo da conta é revertido automaticamente.

### Transferência Entre Contas

POST /transactions/transfer

#### Parâmetros

| Campo           | Tipo    | Obrigatório | Descrição                          |
| --------------- | ------- | ----------- | ---------------------------------- |
| from_account_id | integer | Sim         | ID da conta de origem              |
| to_account_id   | integer | Sim         | ID da conta de destino             |
| amount          | float   | Sim         | Valor a transferir                 |
| date            | date    | Sim         | Data da transferência (YYYY-MM-DD) |
| description     | string  | Opcional    | Descrição da transferência         |

Requisição:

{ "from_account_id": 1, "to_account_id": 2, "amount": 500.00, "date": "2024-11-05", "description": "Transferência para poupança" }

**ℹ️ Como funciona:** Uma transferência cria duas transações: uma saída (expense) da conta de origem e uma entrada (income) na conta de destino. Os saldos de ambas as contas são atualizados automaticamente.

## 📋 Modelos de Dados

### User (Usuário)

| Campo             | Tipo     | Descrição                    |
| ----------------- | -------- | ---------------------------- |
| id                | integer  | Identificador único          |
| name              | string   | Nome do usuário              |
| email             | string   | Email único do usuário       |
| email_verified_at | datetime | Data de verificação do email |
| created_at        | datetime | Data de criação              |
| updated_at        | datetime | Data da última atualização   |

### Account (Conta)

| Campo      | Tipo     | Descrição                                                 |
| ---------- | -------- | --------------------------------------------------------- |
| id         | integer  | Identificador único                                       |
| user_id    | integer  | ID do usuário proprietário                                |
| name       | string   | Nome da conta                                             |
| type       | enum     | `current_account`, `savings`, `credit_card`, `investment` |
| balance    | float    | Saldo atual (atualizado automaticamente)                  |
| deleted_at | datetime | Data de exclusão (soft delete)                            |
| created_at | datetime | Data de criação                                           |
| updated_at | datetime | Data da última atualização                                |

### Category (Categoria)

| Campo       | Tipo     | Descrição                      |
| ----------- | -------- | ------------------------------ |
| id          | integer  | Identificador único            |
| user_id     | integer  | ID do usuário proprietário     |
| name        | string   | Nome da categoria              |
| type        | enum     | `income` ou `expense`          |
| description | string   | Descrição opcional             |
| active      | boolean  | Status da categoria            |
| deleted_at  | datetime | Data de exclusão (soft delete) |
| created_at  | datetime | Data de criação                |
| updated_at  | datetime | Data da última atualização     |

### Transaction (Transação)

| Campo       | Tipo     | Descrição                          |
| ----------- | -------- | ---------------------------------- |
| id          | integer  | Identificador único                |
| user_id     | integer  | ID do usuário proprietário         |
| account_id  | integer  | ID da conta relacionada            |
| category_id | integer  | ID da categoria                    |
| amount      | float    | Valor da transação                 |
| type        | enum     | `income` ou `expense`              |
| date        | date     | Data da transação                  |
| description | string   | Descrição da transação             |
| is_paid     | boolean  | Se a transação foi paga/confirmada |
| deleted_at  | datetime | Data de exclusão (soft delete)     |
| created_at  | datetime | Data de criação                    |
| updated_at  | datetime | Data da última atualização         |

## ⚠️ Tratamento de Erros

### Códigos de Resposta HTTP

| Código | Significado           | Descrição                                       |
| ------ | --------------------- | ----------------------------------------------- |
| 200    | OK                    | Requisição bem-sucedida                         |
| 201    | Created               | Recurso criado com sucesso                      |
| 400    | Bad Request           | Parâmetros inválidos ou mal formatados          |
| 401    | Unauthorized          | Token ausente ou inválido                       |
| 403    | Forbidden             | Acesso negado (não é o proprietário do recurso) |
| 404    | Not Found             | Recurso não encontrado                          |
| 422    | Unprocessable Entity  | Validação falhou                                |
| 500    | Internal Server Error | Erro no servidor                                |

### Exemplo de Resposta de Erro

{ "message": "The given data was invalid.", "errors": { "email": \[ "The email field is required." \], "password": \[ "The password field is required." \] } }

### Erros Comuns

**🔑 Token inválido ou expirado**\
Se receber erro 401, verifique se o token foi incluído no header `Authorization` e se ainda é válido.

**🚫 Saldo insuficiente**\
Se tentar criar uma transação (expense) com saldo insuficiente, a transação será criada mesmo assim, resultando em saldo negativo. Você deve validar isso no frontend.

**🔒 Permissão negada**\
Você só pode acessar contas, categorias e transações que pertencem ao usuário autenticado. Tentar acessar recursos de outro usuário resultará em erro 403 ou 404.

📚 Documentação da Finannce API v1.0

Atualizado em 2024-11-05
