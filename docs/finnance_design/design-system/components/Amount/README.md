# Amount

Valor em reais, Manrope 800 com números tabulares, alinhado à direita em tabelas.

- Receita: `fn-amount fn-amount-income`, texto `+ R$ 8.200,00` em `income`.
- Despesa em lista: `fn-amount fn-amount-expense`, texto `− R$ 386,90` em `ink` (o vermelho-alaranjado cansaria numa lista longa).
- Total de despesas em KPI ou resumo: `fn-amount fn-amount-total-expense`, em `expense`.
- Saldo: sem sinal, em `ink`.

A API guarda `amount` como inteiro (centavos): o front formata com `Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 })`. O sinal de menos é U+2212 (−), não hífen.
