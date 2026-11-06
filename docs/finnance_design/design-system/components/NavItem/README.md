# NavItem

Item do menu lateral escuro (`sidebar`): ícone de traço de 18px + texto 14px, 44px de altura, `radius-md`.

- Ativo: `aria-current="page"`, fundo `sidebar-active`, texto branco 700.
- Inativo: texto `sidebar-ink` 600.
- Itens: Visão geral, Transações, Contas, Categorias. No rodapé do menu: perfil (Editar perfil → `PUT /update`) e Sair (`POST /logout`).
- O menu fica em linha com o conteúdo num flex com `flex-wrap`; no celular ele empilha acima. Nunca `position: sticky` nem `100vh`.
