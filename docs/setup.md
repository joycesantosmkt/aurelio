# Como rodar o Aurélio localmente

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # preencha as variáveis
uvicorn app.main:app --reload
```

API disponível em: http://localhost:8000
Docs automáticas: http://localhost:8000/docs

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard disponível em: http://localhost:5173

## Contas necessárias

| Serviço | Link | Gratuito? |
|---|---|---|
| Supabase (banco) | supabase.com | Sim |
| Railway (backend) | railway.app | Sim (trial) |
| Cloudflare Pages (frontend) | cloudflare.com | Sim |
| Meta for Developers (WhatsApp) | developers.facebook.com | Sim (sandbox) |
