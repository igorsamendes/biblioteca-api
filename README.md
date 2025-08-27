<h1 align="center"> Biblioteca API </h1>

# Descrição do projeto

API REST em NestJS com Prisma + PostgreSQL para gerenciar uma pequena biblioteca digital:
cadastro/listagem de livros (filtro por status e busca por título), cadastro de usuários, registro de empréstimos e devoluções.
Inclui Swagger (documentação interativa), seeds (dados iniciais) e testes unitários (Jest).

# :hammer: Tecnologias Utilizadas

Node.js (runtime)

NestJS (framework web)

Prisma (ORM)

PostgreSQL (banco relacional)

Jest (testes)

Swagger (OpenAPI UI)

# 📁 Acesso ao projeto

Repositório: https://github.com/igorsamendes/biblioteca-api

# 🛠️ Como abrir e rodar o projeto (passo a passo)
## 1) Instalar Git

Link da ferramenta
```
https://www.git-scm.com/downloads
```

## 2) Clonar o repositório

```
git clone https://github.com/igorsamendes/biblioteca-api.git

cd biblioteca-api
```

## 3) Instalar Node.js

Link da ferramenta
```
https://nodejs.org/en/download/prebuilt-installer
```
Verificar:
```
node -v
npm -v
```

## 4) Instalar dependências do projeto

```
npm install
```

## 5) Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto (baseado no .env.example):

```
DATABASE_URL="postgresql://postgres:senha@localhost:5432/biblioteca?schema=public"
```

Certifique-se de ter o PostgreSQL instalado e em execução (porta padrão 5432).
Crie o banco (se ainda não existir):
```
CREATE DATABASE biblioteca;
```

## 6) Aplicar migrations (Prisma)

```
npx prisma migrate dev --name init
```

## 7) Executar seed (dados iniciais)

Cria 2 usuários e 4 livros (não duplica se rodar de novo).

```
npm run seed
```

## 8) Subir a API (modo dev)

```
npm run start:dev
```
API disponível em: http://localhost:3000


# 📘 Documentação (Swagger)

Com o servidor rodando:

UI: http://localhost:3000/api-docs
 (tem botão Try it out)

JSON: http://localhost:3000/api-json

Dica: no Swagger você consegue testar todos os endpoints sem precisar de outra ferramenta.


# 🔌 Testes rápidos da API (terminal)

> Em **Windows/PowerShell**, prefira `Invoke-RestMethod` (evita problemas de aspas).  
> Dica: ajuste os **IDs** conforme os retornos da sua API (ex.: `1`, `2`, ...).

## Root (saúde da API)
```
Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET
```

## Users
**Criar usuário**
```
$body = @{ name="Igor"; email="igor@example.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -ContentType "application/json" -Body $body
```

**Listar usuários**
```
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET
```

**Buscar usuários por nome/e-mail**
```
Invoke-RestMethod -Uri "http://localhost:3000/users?search=igor" -Method GET
```

## Books
**Criar livro**
```
$body = @{ title="Clean Code"; author="Robert C. Martin"; publishedYear=2008 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/books" -Method POST -ContentType "application/json" -Body $body
```

**Listar livros (filtros opcionais)**
```
Invoke-RestMethod -Uri "http://localhost:3000/books?status=AVAILABLE&search=clean" -Method GET
```

**Alternar status (AVAILABLE ↔ BORROWED)**
```
Invoke-RestMethod -Uri "http://localhost:3000/books/1/status" -Method PATCH
```

## Loans
**Registrar empréstimo**
```
$loan = @{ bookId=1; userId=1 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/loans" -Method POST -ContentType "application/json" -Body $loan
```

**Listar empréstimos**
```
Invoke-RestMethod -Uri "http://localhost:3000/loans" -Method GET
```

**Somente em aberto (returned=false)**
```
Invoke-RestMethod -Uri "http://localhost:3000/loans?returned=false" -Method GET
```

**Somente devolvidos (returned=true)**
```
Invoke-RestMethod -Uri "http://localhost:3000/loans?returned=true" -Method GET
```

**Filtrar por usuário (ex.: userId=1)**
```
Invoke-RestMethod -Uri "http://localhost:3000/loans?userId=1&returned=false" -Method GET
```

**Marcar devolução (substitua 1 pelo id do empréstimo)**
```
Invoke-RestMethod -Uri "http://localhost:3000/loans/1/return" -Method PATCH
```

# 🧭 Endpoints implementados

**Root**
- `GET /` — informações básicas da API (name, version, status, docs)

**Books**
- `POST /books` — cria livro  
- `GET /books?status=AVAILABLE|BORROWED&search=<title>` — lista com filtros  
- `PATCH /books/:id/status` — alterna status

**Users**
- `POST /users` — cria usuário  
- `GET /users?search=<term>` — lista usuários (filtro por nome/e-mail)

**Loans**
- `POST /loans` — registra empréstimo  
- `GET /loans` — lista (filtros: `userId`, `bookId`, `returned`)  
- `PATCH /loans/:id/return` — marca devolução

# 🧪 Testes

Rodar testes unitários:
```
npm test
```

Modo observação (com Git inicializado):
```
npm run test:watch
```

Cobertura:
```
npm run test:cov
```

# 🔍 Prisma Studio (GUI do banco)

Abrir o Studio (tabelas Book, User, Loan):
```
npx prisma studio
```

# 🧯 Solução de problemas comuns

“Expected property name or '}' in JSON…” no PowerShell
Use Invoke-RestMethod e monte o body com ConvertTo-Json (exemplos acima).

Cannot GET /api-json
O Swagger precisa estar configurado; no projeto já está com jsonDocumentUrl: 'api-json'. Salve o main.ts e garanta que está rodando com start:dev.

Porta 5432 ocupada / conexão recusada
Verifique se o PostgreSQL está ativo e se a DATABASE_URL está correta.

Migrations estão ok mas não vejo dados
Rode npm run seed e/ou abra npx prisma studio.

# 👤 Desenvolvedor

[<img src="https://avatars.githubusercontent.com/u/43549254?v=4" width=100 title="Igor Mendes">](https://github.com/igorsamendes)
