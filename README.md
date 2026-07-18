# Depois que eu acordei

Blog pessoal para publicar relatos sobre sonhos, desejos, conflitos, escolhas e
superações. O projeto possui páginas públicas, login com Google e um painel
administrativo com controle de acesso por perfil.

## Stack

- Next.js 16 com App Router e TypeScript
- PostgreSQL
- Prisma ORM 7
- Auth.js com Google OAuth
- Sharp para validação e otimização de imagens
- Vitest para testes unitários

As fotos são convertidas para WebP e armazenadas diretamente no PostgreSQL em uma
coluna `bytea`. O limite por upload é de 5 MB.

## Requisitos

- Node.js 22 ou mais recente
- PostgreSQL acessível pela aplicação
- Projeto OAuth 2.0 no Google Cloud Console

## Configuração local

1. Instale as dependências:

```bash
npm install
```

2. Crie `.env` a partir de `.env.example` e preencha as variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/depois_que_eu_acordei"
AUTH_SECRET="uma-chave-aleatoria-longa"
AUTH_GOOGLE_ID="cliente-google.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="segredo-do-cliente-google"
SITE_URL="http://localhost:3000"
APP_TIME_ZONE="America/Sao_Paulo"
```

Gere o `AUTH_SECRET` com:

```bash
openssl rand -base64 32
```

3. Crie as tabelas e gere o Prisma Client:

```bash
npm run db:deploy
npm run db:generate
```

4. Inicie a aplicação:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Google OAuth

No Google Cloud Console, crie um cliente OAuth do tipo **Aplicativo da Web**.
Configure as seguintes URLs para desenvolvimento:

**Origem JavaScript autorizada**

```text
http://localhost:3000
```

**URI de redirecionamento autorizado**

```text
http://localhost:3000/api/auth/callback/google
```

Na configuração de produção, adicione o domínio real e o callback equivalente:

```text
https://seu-dominio.com/api/auth/callback/google
```

Se a tela de consentimento estiver no modo de teste, adicione as contas permitidas
como usuários de teste no Google Cloud Console.

## Primeiro administrador

Toda conta Google verificada é criada inicialmente com o perfil `USER`. Depois de
entrar pela primeira vez, promova a primeira conta diretamente no PostgreSQL:

```sql
UPDATE "depois-que-eu-acordei"."User"
SET "role" = 'ADMIN'
WHERE "email" = 'seu-email@gmail.com';
```

Saia e entre novamente, ou recarregue a aplicação. O link **Painel** será exibido.
A partir dele, administradores podem promover ou rebaixar outros usuários. A
aplicação impede que o último administrador seja rebaixado pela interface.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm start            # executar o build
npm run lint         # lint
npm run typecheck    # checagem de tipos
npm test             # testes unitários
npm run db:migrate   # criar/aplicar migrations em desenvolvimento
npm run db:deploy    # aplicar migrations existentes
npm run db:studio    # interface de inspeção do banco
```

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre as credenciais e a conexão do banco nas configurações do projeto.
   Defina `SITE_URL` com o domínio público, ou deixe-a ausente para usar
   automaticamente o domínio de produção fornecido pela Vercel.
3. Use uma conexão PostgreSQL compatível com aplicações serverless, preferencialmente
   com pool de conexões.
4. Adicione o domínio de produção e seu callback no cliente OAuth do Google.
5. Aplique as migrations no banco de produção com `npm run db:deploy`.
6. Faça o deploy; a Vercel executará `npm run build`.

O filesystem da Vercel não é usado para uploads. As imagens permanecem no banco
PostgreSQL fornecido em `DATABASE_URL`.

## Regras principais

- Visitantes leem relatos publicados sem autenticação.
- Rascunhos e suas imagens são acessíveis apenas por administradores.
- `USER` não visualiza nem acessa rotas administrativas.
- `ADMIN` cria, edita, publica e exclui relatos e gerencia perfis.
- Autorização é verificada novamente no servidor em cada alteração.
- Imagens aceitas: JPG, PNG e WebP, até 5 MB.
