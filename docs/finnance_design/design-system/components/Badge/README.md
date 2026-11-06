# Badge

Pílula (`radius-pill`) de 12px/700 para status e categorias, nunca clicável.

- **Neutro** (`fn-badge`): categoria da transação, tipo de conta. Fundo `surface-sunken`, texto `ink-soft`.
- **Sucesso** (`fn-badge fn-badge-success`): Pago, Recebido, Ativa (`is_paid = true`, `active = true`).
- **Atenção** (`fn-badge fn-badge-warning`): Em aberto (`is_paid = false`).

Categoria inativa usa o badge neutro com o texto "Inativa" e a linha inteira com opacidade 0,6.
