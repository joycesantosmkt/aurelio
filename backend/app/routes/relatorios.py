from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()


@router.get("/diario")
async def relatorio_diario(db: AsyncSession = Depends(get_db)):
    return {"periodo": "hoje", "entradas": 0, "saidas": 0, "saldo": 0}


@router.get("/mensal")
async def relatorio_mensal(db: AsyncSession = Depends(get_db)):
    return {"periodo": "mes_atual", "entradas": 0, "saidas": 0, "saldo": 0}


@router.get("/fiado-pendente")
async def total_fiado_pendente(db: AsyncSession = Depends(get_db)):
    return {"total_pendente": 0, "clientes": []}
