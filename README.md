# Cadastro de Clientes

Sistema web para cadastrar, listar, buscar, editar e excluir clientes (nome, data de nascimento e endereço).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma 6 · Postgres (Neon) · Zod

## Funcionalidades

- **Dashboard** na tela principal: total de clientes, novos cadastros e aniversariantes por período (hoje, 7 dias, mês, mês anterior ou intervalo livre), idade média, indicadores, próximos aniversariantes e gráficos
- Menu principal com **Dashboard** e **Cadastros → Clientes**
- Cadastro, edição e exclusão (com confirmação) de clientes
- Listagem ordenada por nome, com busca por nome (sem diferenciar maiúsculas/minúsculas)
- Validação no navegador e no servidor:
  - nome obrigatório (máx. 120 caracteres)
  - data de nascimento obrigatória, não pode estar no futuro nem ser anterior a 1900
  - endereço obrigatório (máx. 255 caracteres)
- Layout responsivo: cartões no celular, tabela no desktop

## Pré-requisitos

- Node.js 20.9 ou superior
- Um banco Postgres. Recomendado: Neon, criado pela Vercel (Storage > Create Database > Neon)

## Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente. Copie o modelo e preencha com as URLs do seu banco:

   ```bash
   cp .env.example .env.local
   ```

   | Variável                | Para que serve                                  |
   | ----------------------- | ----------------------------------------------- |
   | `DATABASE_URL`          | Conexão **com pool** usada pela aplicação       |
   | `DATABASE_URL_UNPOOLED` | Conexão **direta** usada pelas migrations       |

   Na Vercel, essas URLs ficam em **Storage > (seu banco) > .env.local > Show secret**.
   Se o projeto já estiver ligado à Vercel, você também pode usar `npx vercel env pull .env.local`.

   > O `.env.local` está no `.gitignore` e **nunca** deve ser commitado.

3. Crie as tabelas no banco:

   ```bash
   npm run db:deploy
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse <http://localhost:3000>.

## Scripts

| Comando              | O que faz                                                  |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                                |
| `npm run build`      | Build de produção (não altera o banco)                     |
| `npm run start`      | Roda o build de produção                                   |
| `npm run lint`       | Verifica o código com ESLint                               |
| `npm run db:deploy`  | Aplica as migrations pendentes no banco do `.env.local`    |
| `npm run db:migrate` | Cria uma nova migration após alterar `prisma/schema.prisma`|
| `npm run db:studio`  | Abre o Prisma Studio para ver/editar os dados              |

## Deploy na Vercel

1. Importe o repositório do GitHub na Vercel (**Add New > Project**).
2. Em **Storage**, crie um banco **Neon** e conecte-o ao projeto. Isso cria `DATABASE_URL` e
   `DATABASE_URL_UNPOOLED` automaticamente nos ambientes.
3. Faça o deploy. A Vercel executa o script `vercel-build`, que roda `prisma migrate deploy`
   e cria/atualiza as tabelas antes do build.

## Estrutura

```
prisma/
  schema.prisma          # modelo Cliente
  migrations/            # migrations versionadas
src/
  app/
    layout.tsx           # layout base: cabeçalho, menu principal (pt-BR)
    page.tsx             # Dashboard (tela principal)
    error.tsx            # mensagem amigável se o banco falhar
    globals.css          # Tailwind + cores do tema (--color-brand-*)
    clientes/
      page.tsx           # listagem + busca
      actions.ts         # Server Actions: criar, atualizar, excluir
      novo/page.tsx      # cadastro
      [id]/editar/page.tsx
  components/
    MenuPrincipal.tsx    # menu escuro com submenu Cadastros
    BarraTitulo.tsx      # faixa verde de título das telas
    ClienteForm.tsx      # formulário com exibição de erros
    BuscaClientes.tsx    # campo de busca
    BotaoExcluir.tsx     # exclusão com confirmação
    Icones.tsx           # ícones SVG
    dashboard/           # cartões e gráficos do dashboard
  lib/
    prisma.ts            # instância do Prisma Client
    validacao.ts         # regras de validação (Zod) e utilitários de data
    dashboard.ts         # cálculos do dashboard (períodos, idades, aniversários)
docs/design/             # imagens de referência (ignorada pelo Git)
```
