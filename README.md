# SaaS Monorepo

A full-stack SaaS playground where I explore product ideas, backend architecture, and AI integration in one codebase.

This project is my hands-on portfolio piece. I use it to practice building production-style features end to end: auth, dashboards, role-aware APIs, account management, and an LLM-powered chat experience with resilient fallbacks.

## Why I built this

I wanted one repository that shows more than UI work. This project demonstrates how I think through:

- feature design from UI to database
- API reliability and error handling
- auth and session flows
- practical DX choices in a monorepo
- debugging real integration issues (CORS, model/provider compatibility, request validation)

## What this app does

### Web app

- React + Vite frontend
- TanStack Router based route structure
- Dashboard experience with pages for analytics, billing, integrations, chat, and settings
- Toast notifications for user feedback
- Better Auth client integration

### API

- Fastify server in TypeScript
- Better Auth handler under `/api/auth/*`
- Role-aware admin endpoint (`/api/admin`)
- Account deletion endpoint (`DELETE /api/account`)
- Chat endpoints:
  - `POST /api/chat`
  - `GET /api/chat/usage`
  - `GET /api/chat/health`
- Prisma + PostgreSQL data layer

### AI chat behavior

- Supports real LLM calls through Hugging Face router
- Configurable model/provider through environment variables
- Graceful fallback to mock responses when network/provider fails
- Simple in-memory per-user rate limiting

## Tech stack

- Frontend: React, TypeScript, Vite, TanStack Router, React Query, Tailwind CSS
- Backend: Fastify, Better Auth, Prisma, PostgreSQL
- AI: Hugging Face Router API
- Tooling: ESLint, Vitest, npm workspaces

## Monorepo structure

```text
packages/
  api/   # Fastify + Prisma + Better Auth
  web/   # React + Vite client
```

## Getting started

## 1) Install dependencies

From repository root:

```bash
npm install
```

## 2) Configure environment files

API env file:

```bash
cp packages/api/.env.example packages/api/.env
```

Web env file:

```bash
cp packages/web/.env.example packages/web/.env
```

Minimum variables you will need in `packages/api/.env`:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `PRODUCTION_MODE` (`false` for mock chat, `true` for real LLM calls)
- `HUGGING_FACE_API_KEY` (required when `PRODUCTION_MODE=true`)
- optional chat routing vars:
  - `HF_PROVIDER`
  - `HF_MODEL`
  - `HF_ROUTER_BASE_URL`
  - `HF_INFERENCE_URL`

`packages/web/.env`:

- `VITE_API_URL=http://localhost:3000`

## 3) Database setup

```bash
npm run db:sync
```

(Or use migrations in dev)

```bash
npm run db:dev
```

## 4) Run the app

Start API + web together from root:

```bash
npm run dev
```

- API runs on `http://localhost:3000`
- Web runs on Vite default port (usually `http://localhost:5173`)

## Useful scripts

From root:

- `npm run dev` - run API + web concurrently
- `npm run build` - build web app
- `npm run db:sync` - generate client + push schema
- `npm run db:dev` - run Prisma migrate dev
- `npm run migrate:deploy` - deploy migrations
- `npm run generate` - generate Prisma client

## Key engineering decisions

- Kept web and API as separate runtime boundaries for clear ownership
- Added explicit diagnostics endpoints (`/api/chat/health`, `/api/chat/usage`) for easier debugging
- Designed chat integration to fail safely instead of crashing user flows
- Added account deletion cleanup in a transaction to maintain relational integrity
- Hardened CORS/method behavior for real browser usage

## What I would improve next

- persist rate limits in Redis for multi-instance deployments
- add e2e tests 
- add CI checks for lint, tests, and migrations




