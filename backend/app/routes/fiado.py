from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()


@router.get("/clientes")
async def listar_clientes(db: AsyncSession = Depends(get_db)):
    return {"clientes": []}


@router.post("/clientes")
async def criar_cliente(db: AsyncSession = Depends(get_db)):
    return {"mensagem": "Cliente criado"}


@router.get("/clientes/{cliente_id}/fiados")
async def fiados_do_cliente(cliente_id: str, db: AsyncSession = Depends(get_db)):
    return {"fiados": []}


@router.post("/")
async def registrar_fiado(db: AsyncSession = Depends(get_db)):
    return {"mensagem": "Fiado registrado"}


@router.patch("/{fiado_id}/pagar")
async def marcar_pago(fiado_id: str, db: AsyncSession = Depends(get_db)):
    return {"mensagem": "Fiado marcado como pago"}
