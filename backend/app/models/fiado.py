from sqlalchemy import Column, String, Numeric, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comercio_id = Column(UUID(as_uuid=True), ForeignKey("comercios.id"), nullable=False)
    nome = Column(String(255), nullable=False)
    telefone = Column(String(20))
    criado_em = Column(DateTime, default=datetime.utcnow)

    fiados = relationship("Fiado", back_populates="cliente")


class Fiado(Base):
    __tablename__ = "fiados"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=False)
    comercio_id = Column(UUID(as_uuid=True), ForeignKey("comercios.id"), nullable=False)
    descricao = Column(String(255))
    valor = Column(Numeric(10, 2), nullable=False)
    pago = Column(Boolean, default=False)
    data_venda = Column(DateTime, default=datetime.utcnow)
    data_pagamento = Column(DateTime, nullable=True)

    cliente = relationship("Cliente", back_populates="fiados")
