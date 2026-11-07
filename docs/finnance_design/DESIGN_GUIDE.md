# Finannce — guia de design para implementação

Referência visual e de comportamento do front-end web que consome a **finannce_api** (Laravel + Sanctum). Leia este arquivo primeiro; ele aponta para o resto.

## O que tem nesta pasta

| Caminho                     | Para que serve                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design-system/README.md`   | Princípios, tom de voz, formato de valores, ícones, acessibilidade.                                                                                                                                           |
| `design-system/tokens.json` | Fonte da verdade dos tokens (cores claro/escuro, tipografia, espaço, raio, sombra, tamanhos).                                                                                                                 |
| `design-system/tokens.css`  | Os mesmos tokens como CSS custom properties (`--brand`, `--space-4`…), com tema escuro, e classes `.text-*` de tipografia.                                                                                    |
| `design-system/components/` | 8 componentes de referência (README com regras + `preview.html`) e `bundle.css` com as classes `fn-*`.                                                                                                        |
| `screens/png/`              | Screenshot de cada tela (1440px de largura; modal 560px).                                                                                                                                                     |
| `screens/html/`             | Cada tela como HTML estático, abre direto no navegador. Os links entre telas funcionam.                                                                                                                       |
| `screens/source/`           | Fonte original das telas (`.dc.html`): template com `{{holes}}`, `<sc-for>`, `<sc-if>` e uma classe JS com dados de exemplo e estado (abas, tipo de transação, switch). Útil para ver os estados interativos. |

As telas usam cores literais (hex) em `style=""`. Ao implementar, troque cada uma pelo token equivalente de `tokens.css`. Exceção conhecida: a borda dos inputs nas telas é `#D6DBD8`; use `--control-border` (mais escura, passa 3:1).

## Telas, rotas e endpoints

| Tela                                   | Arquivo                    | Rota sugerida             | Endpoints                                                                                                       |
| -------------------------------------- | -------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Login / Cadastro                       | `00-login`                 | `/login`                  | `POST /login`, `POST /register`                                                                                 |
| Visão geral                            | `01-dashboard`             | `/`                       | `GET /accounts`, `GET /transactions` (filtrado por período) — totais calculados no front                        |
| Transações                             | `02-transactions`          | `/transactions`           | `GET /transactions?start_date&end_date&type&account_id&category_id&per_page`, `PUT`/`DELETE /transactions/{id}` |
| Nova transação / Transferência (modal) | `03-new-transaction-modal` | modal sobre qualquer rota | `POST /transactions`, `POST /transactions/transfer`                                                             |
| Contas                                 | `04-accounts`              | `/accounts`               | `GET`/`POST /accounts`, `PUT`/`DELETE /accounts/{id}`                                                           |
| Categorias                             | `05-categories`            | `/categories`             | `GET`/`POST /categories`, `PUT`/`DELETE /categories/{id}`, `PATCH /categories/{id}/toggle-status`               |
| Menu (rodapé)                          | todas                      | —                         | `PUT /update` (editar perfil), `POST /logout`                                                                   |

## Regras de domínio que o design assume

- `accounts.type`: `checking` = Conta corrente, `saving` = Poupança, `investment` = Investimento.
- `categories.type` e `transactions.type`: `income` = Receita, `expense` = Despesa. O select de categoria no modal só lista categorias **ativas** do tipo escolhido (a API valida `category.type == type`).
- `transactions.is_paid`: `true` = Pago (despesa) / Recebido (receita); `false` = Em aberto. O dashboard lista os em aberto em "A pagar / receber".
- `amount` é inteiro (centavos) na API. Formate com `Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 })`; receita `+ R$`, despesa `− R$` (U+2212).
- Transferência: o modal troca os campos para conta e categoria de origem / destino (`origin_account_id`, `destination_account_id`, `origin_category_id`, `destination_category_id`), sem "pago". A API cria duas transações e recusa se o saldo da origem não cobre o valor; mostre essa mensagem de erro no modal.
- Validações a refletir no formulário: nome de conta/categoria 3–255 caracteres; descrição até 255; senha mínimo 8; transferência mínimo R$ 1,00.

## Layout

- Shell: menu lateral (`--sidebar`, 240px base) + conteúdo, num flex com `flex-wrap` — no celular o menu empilha em cima. Sem `position: sticky` nem `100vh` no menu.
- Conteúdo: padding `32px clamp(16px, 3vw, 40px) 48px`, seções com gap de 20–24px.
- Grades com `repeat(auto-fit, minmax(…, 1fr))`; tabelas largas dentro de `overflow-x: auto`.
- Cards: `--surface-raised`, borda 1px `--line`, `--radius-lg`, padding 22–24px, sem sombra.

## Implementação sugerida (Vue 3)

- Vue 3 + Vite + TypeScript, Vue Router, Pinia, axios com interceptor do token Sanctum (Bearer) e tratamento de 401 → `/login` e 422 → erros por campo.
- Importe `design-system/tokens.css` uma vez (ou mapeie os tokens no `tailwind.config` se usar Tailwind).
- Componentes base (nomes em inglês): `AppShell`, `AppSidebar`, `NavItem`, `BaseButton`, `BaseBadge`, `MoneyAmount`, `KpiCard`, `TextField`, `SelectField`, `SegmentedControl`, `ToggleSwitch`, `DataTable`, `PaginationBar`, `BaseModal`, `ProgressBar`.
- Views: `LoginView`, `DashboardView`, `TransactionsView`, `AccountsView`, `CategoriesView`; modal `TransactionFormModal` (modos expense / income / transfer).
- Dados das telas são exemplos; nada de valores fixos no código.
