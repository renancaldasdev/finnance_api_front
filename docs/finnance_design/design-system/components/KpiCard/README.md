# KpiCard

Card de resumo com rótulo, valor grande e uma linha de contexto; usado em grade `repeat(auto-fit, minmax(220px, 1fr))`.

- **Destaque** (`fn-kpi fn-kpi-hero`): só um por tela, para o saldo total. Fundo `sidebar`.
- **Padrão** (`fn-kpi`): receitas, despesas, em aberto. O valor usa a cor do significado (`income`, `expense`, `warning`) ou `ink`.
- Pode levar uma barra `fn-progress` no lugar da linha de contexto (taxa de economia, metas).

O consumidor fornece os números já formatados; o card não calcula nada.
