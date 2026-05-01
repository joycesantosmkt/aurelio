# Como rodar o Aurélio localmente

## Worker (Backend)

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars   # preencha as variáveis
npm run dev
```

API disponível em: http://localhost:8787

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard disponível em: http://localhost:5173

## Criar banco D1 no Cloudflare

```bash
cd worker
npx wrangler d1 create aurelio
# Copie o database_id gerado e cole no wrangler.toml
npm run db:migrate:local   # aplica migrações local
npm run db:migrate         # aplica migrações em produção
```

## Contas necessárias

| Serviço | Uso | Custo |
|---|---|---|
| Cloudflare | Worker + D1 + Pages | Gratuito |
| GitHub | Código + CI/CD | Gratuito |
| Meta for Developers | WhatsApp API | Gratuito (sandbox) |
