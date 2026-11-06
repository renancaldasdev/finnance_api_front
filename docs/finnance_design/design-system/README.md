# Finannce

Design system do app web de finanças pessoais que consome a **finannce_api** (Laravel + Sanctum). Cobre as telas de Login/Cadastro, Visão geral, Transações, Contas, Categorias e o modal de Nova transação / Transferência.

## Princípios

- **O número é o protagonista.** Saldos e valores usam Manrope 800 com `font-variant-numeric: tabular-nums`, para alinhar em colunas. O resto da interface fica quieto.
- **Cor é significado.** `income` só para dinheiro que entra, `expense` / `expense-chart` só para o que sai, `warning` só para o que está em aberto, `danger` só para excluir. `brand` é a ação primária, uma por tela.
- **Bordas, não sombras.** Cards são `surface-raised` com 1px de `line` e `radius-lg`. Sombra só no segmented control selecionado e em modais.
- **Alvos de 44px.** Todo botão, input, item de menu e ícone clicável tem pelo menos `control-height`.

## Conteúdo e tom

- Português do Brasil, frases curtas, segunda pessoa implícita: "Nova transação", "Marcar como pago", "Ver extrato".
- Botões começam com verbo e usam caixa de frase: "Salvar transação", "Criar conta", "Transferir".
- Valores sempre com sinal e moeda: `+ R$ 8.200,00` (receita), `− R$ 386,90` (despesa, sinal de menos tipográfico U+2212). Saldo sem sinal.
- Datas em `dd/mm` nas listas e `dd/mm/aaaa` em filtros.
- Termos da API traduzidos para o que a pessoa reconhece: `checking` = Conta corrente, `saving` = Poupança, `investment` = Investimento, `is_paid` = Pago / Recebido / Em aberto, `active` = Ativa / Inativa.

## Fundamentos visuais

- **Cor:** chão `surface` cinza-esverdeado, cards `surface-raised`, menu lateral `sidebar` quase preto-verde. Um acento só, o verde `brand`. Neutros têm um leve viés verde, nunca cinza puro.
- **Tipografia:** uma família, Manrope (Google Fonts, 400–800). Hierarquia por peso e tamanho: `display` para o título da página, `heading` para o título do card, `kpi` para os números, `label` para rótulos, `overline` para cabeçalhos de tabela.
- **Espaço:** escala de 4px (`space-1` a `space-10`). Cards com `space-6` de padding; grade com `space-4` de gap.
- **Layout:** menu lateral (`sidebar-width`) + conteúdo fluido em linha com `flex-wrap`, de modo que o menu empilha no celular. Grades de KPI com `repeat(auto-fit, minmax(220px, 1fr))`. Tabelas largas rolam dentro do próprio card.
- **Gráficos:** barras com cantos `6px 6px 2px 2px`, receita em `income`, despesa em `expense-chart`. Progresso com trilho `surface-sunken` e preenchimento `brand` (ou `warning` / `expense` quando o limite está perto ou estourado).

## Iconografia

Ícones de traço (stroke 2px, cantos e terminais arredondados, 16–20px, `currentColor`), no estilo Lucide/Feather. Nunca emoji. Botão só com ícone leva `aria-label` ("Editar transação", "Excluir conta", "Sair"). O logotipo é um quadrado `brand` de 34px com `radius-md` contendo um gráfico de barras em traço branco, seguido do nome "finannce" em minúsculas, Manrope 800.

## Componentes

Classes CSS com prefixo `fn-` em `components/bundle.css`, prontas para virar componentes Vue 3: Button, Badge, Amount, KpiCard, TextField, SegmentedControl, Switch e NavItem. Cada um tem um README com as regras de uso.

## Acessibilidade

- Texto com contraste de 4,5:1 nos dois temas; bordas de controle (`control-border`) e anel de foco (`focus-ring`) com 3:1.
- Receita e despesa não dependem só da cor: o sinal `+` / `−` sempre acompanha o valor.
- Use `<button>`, `<a href>`, `<label>` e `<input>` reais; switches com `role="switch"` e `aria-checked`; segmented control com `role="radiogroup"` / `role="radio"`.
