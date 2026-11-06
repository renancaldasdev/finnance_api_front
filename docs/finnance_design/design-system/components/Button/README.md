# Button

Botão de ação com altura mínima de `control-height` (44px) e `radius-md`; o primário em `brand` aparece no máximo uma vez por tela.

## Variantes

- **Primário** (`fn-btn fn-btn-primary`): a ação principal da tela ("Nova transação", "Salvar transação", "Entrar").
- **Secundário** (`fn-btn`): ações de apoio ("Transferência", "Cancelar"). Borda `control-border`.
- **Escuro** (`fn-btn fn-btn-dark`): aplicar filtros.
- **Ícone** (`fn-btn fn-btn-icon`): editar e excluir em linhas de tabela; sempre com `aria-label`. Excluir usa `fn-btn-danger`.

## Regras

- Texto começa com verbo, caixa de frase.
- Ícone de traço de 16px antes do texto, só quando ajuda a reconhecer (+, setas de transferência).
- Navegação entre telas usa `<a href>` com a classe; ação na tela usa `<button type="button">`.
