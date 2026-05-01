# 🔐 OAuth 2.0 + OpenID Connect Authentication Server

A production-ready **OAuth 2.0 Authorization Server** with **OpenID Connect (OIDC)** support, built using **TypeScript, Node.js, Express, PostgreSQL, and Drizzle ORM**.

This project implements the **Authorization Code Flow**, **Refresh Tokens**, **RS256 JWT signing**, **JWKS**, and **OpenID Discovery**, with a clean **controller–service architecture** and **secure middleware separation**.

---

## ✨ Features

* 🔑 User Registration & Login
* 🍪 Cookie-based session for browser flows
* 🔐 OAuth 2.0 Authorization Code Flow
* 🔄 Refresh Token support
* 👤 OIDC `/userinfo` endpoint
* 🔏 RS256 JWT (public/private key)
* 🔓 JWKS endpoint (`/.well-known/jwks.json`)
* 🌐 OpenID Discovery (`/.well-known/openid-configuration`)
* 🧩 Zod validation
* 🗄 PostgreSQL with Drizzle ORM
* 🐳 Docker support
* 🧱 Clean architecture (Controller → Service → DB)

---

## 🧠 Architecture Overview

```text
Client App
   ↓
/oauth/authorize (browser)
   ↓
Login (cookie session)
   ↓
Authorization Code
   ↓
/oauth/token (server-to-server)
   ↓
Access Token (JWT RS256)
   ↓
/oauth/userinfo (Bearer token)
```

---

## ⚙️ Tech Stack

* Node.js + Express
* TypeScript
* PostgreSQL
* Drizzle ORM
* Zod
* JWT (RS256)
* Docker (optional)

---

## 📁 Project Structure

```text
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── db/
│   ├── schema.ts
│   └── index.ts
├── utils/
├── config/
└── index.ts
```

---

## 🔐 Authentication Model

### 1. Session (Cookie-based)

Used for:

* `/oauth/authorize`
* `/auth/login`

### 2. Bearer Token (Access Token)

Used for:

* `/oauth/userinfo`
* API access

---

## 🔑 JWT Strategy

* Algorithm: **RS256**
* Private key → sign token
* Public key → verify token

---

## 📌 Environment Variables

Create `.env`:

```env
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/oauth_db

JWT_PRIVATE_KEY=./keys/private.pem
JWT_PUBLIC_KEY=./keys/public.pem

BASE_URL=http://localhost:3000
```

---

## 🔐 Generate Keys

```bash
mkdir keys

openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

---

## 🗄 Database Setup

### Run migrations

```bash
pnpm drizzle-kit push
```

---

## 🧪 Running Locally

```bash
pnpm install
pnpm dev
```

Server runs at:

```text
http://localhost:3000
```

---

## 🔄 OAuth Endpoints

### 🔹 Authorization

```http
GET /oauth/authorize
```

Query params:

```text
client_id
redirect_uri
response_type=code
state
```

---

### 🔹 Token

```http
POST /oauth/token
```

Body:

```json
{
  "code": "...",
  "client_id": "...",
  "client_secret": "...",
  "redirect_uri": "..."
}
```

---

### 🔹 Refresh Token

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "..."
}
```

---

### 🔹 UserInfo

```http
GET /oauth/userinfo
Authorization: Bearer <access_token>
```

---

### 🔹 JWKS

```http
GET /.well-known/jwks.json
```

---

### 🔹 OpenID Discovery

```http
GET /.well-known/openid-configuration
```

---

## 🛡 Security Design

* RS256 signing
* Authorization code expiry (5 min)
* One-time code usage
* Refresh token expiry
* Cookie (`httpOnly`, `sameSite`)
* Middleware separation:

  * Session middleware
  * Bearer middleware

---

## 🧩 Middleware Strategy

| Middleware        | Purpose       |
| ----------------- | ------------- |
| sessionMiddleware | Browser login |
| bearerMiddleware  | API access    |

---

## 🐳 Docker (Optional)

### Dockerfile

```Dockerfile
FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
```

---

## 🚀 Deployment (Render)

### Steps:

1. Push repo to GitHub
2. Create new Web Service on Render
3. Add environment variables
4. Add PostgreSQL DB
5. Deploy

---

## 🔐 Production Notes

* Use `secure: true` cookies (HTTPS)
* Use real domain (no localhost)
* Update `issuer` in discovery
* Use strong secrets

---

## 🧪 Testing Flow

1. Register user
2. Login
3. Call `/oauth/authorize`
4. Get `code`
5. Exchange via `/oauth/token`
6. Use token in `/userinfo`

---

## 📈 Future Improvements

* PKCE support 🔥
* Consent screen
* Scope-based access
* Token revocation
* Multi-client support

---

## 🤝 Contribution

Feel free to fork and improve.

---

## 📜 License

MIT
