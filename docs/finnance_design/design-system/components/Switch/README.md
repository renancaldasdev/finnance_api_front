# Switch

Liga/desliga imediato, sem botão de salvar: usado para ativar e desativar categorias (`PATCH /categories/{id}/toggle-status`).

- `<button role="switch" aria-checked="true|false">` com `aria-label` que diz o que liga ("Categoria Lazer ativa").
- Trilho de 40×24px em `brand` quando ligado, `control-border` quando desligado; botão de 44px de altura para o toque.
- Mostre o estado também em texto ao lado (badge Ativa / Inativa).
- Para escolhas que só valem ao salvar um formulário, use checkbox.
