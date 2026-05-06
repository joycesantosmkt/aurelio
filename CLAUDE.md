# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aurélio is a WhatsApp-based financial advisor for small Brazilian merchants. The system receives WhatsApp messages (receipts, voice notes, images), processes them with AI, and sends back daily financial summaries, alerts, and insights — all in a conversational, friendly tone ("compadre das finanças").

## Architecture

The project has two independent deployable units:

**`worker/`** — Cloudflare Worker (TypeScript + Hono)
- Receives WhatsApp webhooks from Meta Business API
- Exposes REST API consumed by the frontend
- Runs a daily cron at 20h (UTC) that sends WhatsApp summaries to all merchants
- Database access via Drizzle ORM over Cloudflare D1 (SQLite)
- All environment secrets live in `.dev.vars` locally and Cloudflare secrets in production

**`frontend/`** — React + Vite → Cloudflare Pages
- Admin dashboard for merchants (mobile-first)
- Talks to the Worker API via axios (`src/services/api.ts`)
- Pages: Dashboard, Caixa, Fiado, Relatorios

## Key Files

- `worker/src/index.ts` — app entrypoint, route mounting, cron handler, `Bindings` type (all env vars)
- `worker/src/db/schema.ts` — Drizzle schema: `comercios`, `lancamentos`, `clientes`, `fiados`
- `worker/src/services/whatsapp.ts` — functions to send WhatsApp messages via Meta Cloud API
- `worker/src/cron/resumo-diario.ts` — daily cron logic: queries all merchants, sends WhatsApp summary
- `worker/wrangler.toml` — D1 binding (`DB`), cron trigger, environment vars

## Commands

### Worker (backend)
```bash
cd worker
npm install
cp .dev.vars.example .dev.vars   # fill in secrets
npm run dev                       # local dev at http://localhost:8787
npm run deploy                    # deploy to Cloudflare Workers
npm run db:migrate:local          # apply D1 migrations locally
npm run db:migrate                # apply D1 migrations in production
npm run db:generate               # generate new migration from schema changes
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # local dev at http://localhost:5173
npm run build    # TypeScript check + Vite build
```

## Environment Variables

Defined in `worker/src/index.ts` as `Bindings`:
- `DB` — D1 database binding (set in `wrangler.toml`)
- `WHATSAPP_TOKEN` — Meta Business API bearer token
- `WHATSAPP_PHONE_ID` — WhatsApp sender phone ID
- `WHATSAPP_WEBHOOK_SECRET` — token used to verify Meta webhook handshake
- `SECRET_KEY` — JWT signing key
- `FRONTEND_URL` — used for CORS origin allowlist

## Database

Cloudflare D1 (SQLite). Migrations live in `worker/migrations/`. Schema managed with Drizzle ORM.

Tables: `comercios` → `lancamentos` (entrada/saida), `clientes`, `fiados`

All timestamps stored as Unix milliseconds (integer).

## CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push to `main`:
- Worker: `wrangler deploy` with `CLOUDFLARE_API_TOKEN` secret
- Frontend: build + Cloudflare Pages action with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets

## WhatsApp Integration

The webhook at `POST /whatsapp/webhook` receives all incoming messages. `GET /whatsapp/webhook` handles Meta's verification handshake using `WHATSAPP_WEBHOOK_SECRET`. Message processing logic (AI parsing, intent detection, onboarding flow) goes in `worker/src/routes/whatsapp.ts`.

## Product Context

Full product specification and onboarding conversation flows are documented in `docs/produto.md`. Before modifying any WhatsApp message copy or conversation logic, read that file — it contains approved message scripts, tone guidelines, and feature decisions.
