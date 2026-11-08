# Tiófinho Jr Agrofer & Petshop

Site institucional da loja **Tiófinho Jr Agrofer & Petshop**, no Bairro Piratini, em Gramado/RS (desde 2007).

Banho e tosa, pet shop, agropecuária e ferragem. Os pedidos são feitos pelo WhatsApp.

## Estrutura

```
index.html            Página única (todas as seções)
assets/css/style.css  Estilos e animações
assets/js/main.js     Menu, animações de entrada, aberto/fechado, formulário → WhatsApp
assets/img/           Logo sem fundo (azul / amarelo / branco), fachada e favicon
imagem/               Arquivos originais enviados pelo cliente
```

## Como editar

- **WhatsApp:** constante `WHATS` em `assets/js/main.js`.
- **Horário:** objeto `HOURS` em `assets/js/main.js` (em minutos desde 00:00) e a tabela `#hours-table` no `index.html`.
- **Mensagens prontas dos botões:** atributo `data-wa="..."` em cada link.
- **Avaliações:** seção `#avaliacoes` no `index.html`.

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```bash
npx http-server -p 5510
```

## Publicar

É um site estático, sem build. Pode ser publicado no GitHub Pages (Settings → Pages → branch `main`), na Netlify ou na Vercel.
