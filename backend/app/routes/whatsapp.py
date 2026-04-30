from fastapi import APIRouter, Request, HTTPException
from app.config import settings
from app.services import whatsapp_service

router = APIRouter()


@router.get("/webhook")
async def verificar_webhook(request: Request):
    """Verificação do webhook pela Meta."""
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == settings.whatsapp_webhook_secret:
        return int(challenge)
    raise HTTPException(status_code=403, detail="Token inválido")


@router.post("/webhook")
async def receber_mensagem(request: Request):
    """Recebe mensagens e eventos do WhatsApp."""
    data = await request.json()
    return {"status": "recebido"}
