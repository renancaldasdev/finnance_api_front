# SegmentedControl

Escolha exclusiva entre 2–3 opções num trilho `surface-sunken`; a opção ativa ganha `surface-raised` e `shadow-selected`.

- Tipo de transação: Despesa / Receita / Transferência (`role="radiogroup"` + `role="radio"` com `aria-checked`). No modal, a opção ativa pode usar a cor do tipo no texto.
- Abas de conteúdo: Entrar / Criar conta, Despesas / Receitas (`role="tablist"` + `role="tab"` com `aria-selected`).
- Nunca mais de 3 opções; acima disso use um select.
