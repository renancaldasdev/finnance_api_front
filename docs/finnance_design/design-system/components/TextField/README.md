# TextField

Rótulo em `label` (13px/700, `ink-soft`) acima de um campo de 44px com borda `control-border` e `radius-md`; o mesmo visual vale para `<select>`, `<input type="date">` e `<textarea>`.

- Envolva tudo num `<label class="fn-field">` para o rótulo ficar ligado ao campo.
- Dica ou erro abaixo em `fn-field-hint`; erro: adicione `fn-field-error` ao label e use a mensagem da validação da API (422) em português.
- Campo de valor do modal: `R$` em `ink-muted` + input em `amount-input` (32px/800) colorido pelo tipo (`expense`, `income` ou `ink`).
- Opcional é dito no rótulo: "Descrição (opcional)".
