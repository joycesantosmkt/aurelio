from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()


@router.get("/")
async def listar_lancamentos(db: AsyncSession = Depends(get_db)):
    return {"lancamentos": []}


@router.post("/")
async def criar_lancamento(db: AsyncSession = Depends(get_db)):
    return {"mensagem": "Lançamento criado"}


@router.get("/resumo")
async def resumo_caixa(db: AsyncSession = Depends(get_db)):
    return {"entradas": 0, "saidas": 0, "saldo": 0}
