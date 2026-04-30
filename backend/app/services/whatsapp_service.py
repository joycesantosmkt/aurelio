import httpx
from app.config import settings


WHATSAPP_API_URL = "https://graph.facebook.com/v19.0"


async def enviar_mensagem(telefone: str, mensagem: str) -> dict:
    url = f"{WHATSAPP_API_URL}/{settings.whatsapp_phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {settings.whatsapp_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": telefone,
        "type": "text",
        "text": {"body": mensagem},
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()


async def enviar_resumo_diario(telefone: str, resumo: dict) -> None:
    saldo = resumo.get("saldo", 0)
    entradas = resumo.get("entradas", 0)
    saidas = resumo.get("saidas", 0)
    fiado_pendente = resumo.get("fiado_pendente", 0)

    mensagem = (
        f"*Aurélio - Resumo do Dia* 📊\n\n"
        f"✅ Entradas: R$ {entradas:.2f}\n"
        f"❌ Saídas: R$ {saidas:.2f}\n"
        f"💰 Saldo do dia: R$ {saldo:.2f}\n"
        f"📋 Fiado pendente: R$ {fiado_pendente:.2f}\n\n"
        f"Acesse o dashboard para mais detalhes."
    )
    await enviar_mensagem(telefone, mensagem)


async def enviar_alerta_fiado(telefone_comercio: str, nome_cliente: str, valor: float, telefone_cliente: str) -> None:
    mensagem = (
        f"*Aurélio - Alerta de Fiado* ⚠️\n\n"
        f"O cliente *{nome_cliente}* tem R$ {valor:.2f} em aberto.\n"
        f"Telefone: {telefone_cliente}\n\n"
        f"Quer que eu envie um lembrete para ele?"
    )
    await enviar_mensagem(telefone_comercio, mensagem)
