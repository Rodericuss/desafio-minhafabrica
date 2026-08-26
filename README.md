# Desafio técnico MinhaFabrica

Aplicação full stack para autenticação e gestão de usuários e produtos, construída
como parte do processo seletivo da MinhaFabrica.

## Funcionalidades

- Login com e-mail e senha.
- Autenticação JWT com rotas protegidas.
- Seed idempotente do administrador.
- Dashboard com totais reais de usuários e produtos.
- CRUD completo de usuários.
- CRUD completo de produtos.
- Validação no frontend, Service e Model.
- Feedback de erro e loading nas operações assíncronas.
- Modais para criação e edição.
- Confirmação antes de exclusões.
- Layout responsivo para desktop e dispositivos móveis.
- Tratamento centralizado de erros no backend.

## Tecnologias

### Backend

- Node.js e JavaScript com ES Modules
- Express 5
- MongoDB e Mongoose
- bcryptjs
- JSON Web Token

### Frontend

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios

### Qualidade

- npm workspaces
- Biome
- TypeScript em modo estrito

## Arquitetura

O backend segue o fluxo obrigatório:

```text
Route → Middleware → Controller → Service → Repository → Model → MongoDB
```

- **Route:** associa método e URL ao Controller.
- **Middleware:** trata autenticação e responsabilidades HTTP transversais.
- **Controller:** extrai dados HTTP, chama o Service e define a resposta.
- **Service:** contém validações e regras de negócio.
- **Repository:** concentra todo acesso ao Mongoose.
- **Model:** define schema, constraints, índices e serialização.

O frontend usa páginas do App Router, componentes Client para interfaces
interativas e uma instância Axios centralizada com interceptor JWT.

## Pré-requisitos

- Node.js 20.9 ou superior
- npm
- MongoDB local ou MongoDB Atlas

## Instalação

Na raiz do repositório:

```bash
npm install
```

O projeto é um monorepo npm com os workspaces `backend` e `frontend`.

## Variáveis de ambiente

### Backend

Copie o exemplo:

```bash
cp backend/.env.example backend/.env
```

Configure:

```dotenv
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/desafio-minhafabrica
JWT_SECRET=substitua-por-um-segredo-longo-e-aleatorio
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:3000
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=substitua-por-uma-senha-forte
```

Não versione o arquivo `.env`.

### Frontend

Copie o exemplo:

```bash
cp frontend/.env.example frontend/.env.local
```

Conteúdo esperado:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Variáveis `NEXT_PUBLIC_*` ficam disponíveis no bundle do navegador e não devem
conter secrets.

## Seed do administrador

Com o MongoDB disponível e o `backend/.env` configurado:

```bash
npm run seed:admin --workspace=backend
```

O script utiliza o mesmo User Service do CRUD, portanto aplica as mesmas
validações e o mesmo hash bcrypt. Ele é idempotente por e-mail normalizado: se o
usuário já existir, nenhuma informação ou senha será alterada silenciosamente.

## Desenvolvimento

Em terminais separados:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Abra `http://localhost:3000` e use as credenciais configuradas no seed.

## Produção

A aplicação está publicada em:

- Frontend: https://crud-minhafabrica.vercel.app
- API: https://crud-minhafabrica-api-rodericuss.fly.dev
- Health check: https://crud-minhafabrica-api-rodericuss.fly.dev/health

O frontend está na Vercel e a API/MongoDB estão na organização Fly `vitor-785`.
O MongoDB roda em uma máquina privada, sem IP público, com um volume criptografado
de 1 GB. A API acessa o banco pelo DNS privado do Fly e aceita CORS somente da
origem do frontend.

O administrador de demonstração usa o e-mail `admin@minhafabrica.com`. A senha é
entregue separadamente e não é armazenada neste repositório.

Para encerrar os recursos temporários após a apresentação, confirme os nomes antes
de executar:

```bash
flyctl machine destroy 28654122a99e68 --app crud-minhafabrica-db-rodericuss
flyctl machine destroy 48e7459c4776e8 --app crud-minhafabrica-api-rodericuss
flyctl volumes destroy vol_vp2x35xpnn5l1xk4 --app crud-minhafabrica-db-rodericuss
flyctl apps destroy crud-minhafabrica-db-rodericuss
flyctl apps destroy crud-minhafabrica-api-rodericuss
```

Esses comandos removem os dados persistidos do MongoDB. Se quiser manter o estado
para outra demonstração, pare apenas as máquinas e preserve o volume.

## Endpoints

```text
POST   /api/v1/auth/login
GET    /api/v1/users
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
GET    /api/v1/dashboard
GET    /health
```

Exceto login e health check, os endpoints exigem:

```http
Authorization: Bearer <token>
```

Erros seguem o contrato:

```json
{ "message": "Descrição do erro" }
```

## Validação e build

```bash
npm run check
npm run typecheck
npm run build
npm audit --audit-level=high
```

## Segurança

- Senhas originais nunca são persistidas.
- bcryptjs usa fator de custo 12 e entradas acima de 72 bytes são rejeitadas.
- O hash não aparece nas respostas da API.
- O JWT contém somente o ID no claim `sub`, além de `iat` e `exp`.
- O secret JWT existe apenas no ambiente do backend.
- O frontend adiciona o Bearer token pelo interceptor Axios.
- A proteção visual do Next.js não substitui o middleware real do backend.
- Erros inesperados não devolvem stack trace ao cliente.

O token fica em `localStorage` para demonstrar o fluxo de interceptor solicitado.
Essa decisão é simples, mas permite que um XSS bem-sucedido leia o token. Uma
aplicação com requisitos de segurança mais rígidos deveria considerar cookies
HttpOnly junto de uma estratégia explícita de CSRF e CORS.

## Decisões arquiteturais

As decisões que não eram totalmente impostas pelo desafio estão registradas em
[`docs/adr`](docs/adr), incluindo monorepo, JavaScript no backend, bcryptjs, payload
JWT, seed por script e armazenamento do token no navegador.
